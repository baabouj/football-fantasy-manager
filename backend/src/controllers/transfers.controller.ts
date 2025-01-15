import httpStatus from "http-status";
import { z } from "zod";

import { playerService } from "../services/player.service";

import { HttpError } from "../lib/http-error";
import { handleAsync } from "../lib/handle-async";

import {
  addToTransferListSchema,
  findTransfersSchema,
} from "../validations/transfers.validation";

export const transfersController = {
  find: handleAsync(
    async (req, res) => {
      const userId = req.user as string;
      const players = await playerService.findTransferList(
        userId,
        req.query ?? {}
      );

      if (!players) throw new HttpError(httpStatus.NOT_FOUND, "Not Found");

      res.status(httpStatus.OK).send(players);
    },
    {
      isProtected: true,
      // @ts-ignore
      schema: findTransfersSchema,
    }
  ),
  add: handleAsync(
    async (req, res) => {
      const userId = req.user as string;
      const player = await playerService.addToTransferList(
        req.params.playerId,
        userId,
        req.body.askingPrice
      );

      if (!player) throw new HttpError(httpStatus.NOT_FOUND, "Not Found");

      res.status(httpStatus.OK).send(player);
    },
    {
      isProtected: true,
      schema: addToTransferListSchema,
    }
  ),
  remove: handleAsync(
    async (req, res) => {
      const userId = req.user as string;
      const player = await playerService.removeFromTransferList(
        req.params.playerId,
        userId
      );

      if (!player) throw new HttpError(httpStatus.NOT_FOUND, "Not Found");

      res.status(httpStatus.OK).send(player);
    },
    {
      isProtected: true,
      schema: {
        params: z.object({
          playerId: z.string().cuid(),
        }),
      },
    }
  ),
  buy: handleAsync(
    async (req, res) => {
      const userId = req.user as string;
      const player = await playerService.transfer(req.params.playerId, userId);

      res.status(httpStatus.OK).send(player);
    },
    {
      isProtected: true,
      schema: {
        params: z.object({
          playerId: z.string().cuid(),
        }),
      },
    }
  ),
};
