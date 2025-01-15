import httpStatus from "http-status";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { teamService } from "./team.service";

import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/http-error";

import { type TransferQuery } from "../validations/transfers.validation";

export const playerService = {
  createMany: async (
    players: { name: string; position: string; price: number; form: number }[],
    teamId: string
  ) => {
    const createdTeam = await prisma.player.createMany({
      data: players.map((player) => ({
        ...player,
        askingPrice: player.price,
        teamId,
      })),
    });
    return createdTeam;
  },
  findTransferList: async (
    userId: string,
    { team, player, price }: TransferQuery
  ) => {
    const players = await prisma.player.findMany({
      where: {
        isInTransferList: true,
        team: {
          ownerId: {
            not: userId,
          },
        },
        ...(team && {
          team: {
            name: {
              contains: team,
            },
          },
        }),
        ...(player && {
          name: {
            contains: player,
          },
        }),
        ...(price && {
          price: {
            lte: price,
          },
        }),
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });
    return players;
  },
  addToTransferList: async (
    playerId: string,
    userId: string,
    askingPrice: number
  ) => {
    try {
      const players = await prisma.player.update({
        where: {
          id: playerId,
          team: {
            ownerId: userId,
          },
        },
        data: {
          isInTransferList: true,
          askingPrice,
        },
      });
      return players;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // the player doesn't exist or the user is not the player's team owner
        return null;
      }
    }
  },
  removeFromTransferList: async (playerId: string, userId: string) => {
    try {
      const players = await prisma.player.update({
        where: {
          id: playerId,
          team: {
            ownerId: userId,
          },
        },
        data: {
          isInTransferList: false,
        },
      });
      return players;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // the player doesn't exist or the user is not the player's team owner
        return null;
      }
    }
  },
  transfer: async (playerId: string, userId: string) => {
    const buyerTeam = await teamService.find(userId);
    if (!buyerTeam)
      throw new HttpError(httpStatus.BAD_REQUEST, "Please create a team");

    try {
      const player = await prisma.player.findUnique({
        where: {
          id: playerId,
          isInTransferList: true,
          teamId: {
            not: buyerTeam.id,
          },
        },
        include: {
          team: {
            select: {
              budget: true,
            },
          },
        },
      });

      if (!player)
        throw new HttpError(httpStatus.BAD_REQUEST, "Player doesn't exist");

      // Calculate the purchase price (95% of asking price)
      const purchasePrice = player.askingPrice * 0.95;

      if (buyerTeam.budget < purchasePrice)
        throw new HttpError(
          httpStatus.BAD_REQUEST,
          "Team budget is not enough to buy this player"
        );

      // Transfer player to buyer's team
      await prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          teamId: buyerTeam.id,
          isInTransferList: false,
          price: purchasePrice,
          askingPrice: purchasePrice,
        },
      });

      // Deduct price from buyer's budget
      await teamService.updateBudget(
        buyerTeam.id,
        buyerTeam.budget - purchasePrice
      );

      // Add price to seller's budget
      await teamService.updateBudget(
        player.teamId,
        player.team.budget + purchasePrice
      );

      return player;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // the player doesn't exist or is not in the transfer list
        // or the player already belongs to the user's team
        throw new HttpError(
          httpStatus.BAD_REQUEST,
          "You can't buy this player"
        );
      }
      throw error;
    }
  },
};
