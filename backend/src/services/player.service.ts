import { prisma } from "../lib/prisma";

export const playerService = {
  createMany: async (
    players: { name: string; position: string; price: number }[],
    teamId: string
  ) => {
    const createdTeam = await prisma.player.createMany({
      data: players.map((player) => ({ ...player, teamId })),
    });
    return createdTeam;
  },
};
