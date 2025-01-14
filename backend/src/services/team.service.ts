import { prisma } from "../lib/prisma";

export const teamService = {
  find: async (ownerId: string) => {
    const team = await prisma.team.findUnique({
      where: {
        ownerId,
      },
      include: {
        players: true,
      },
    });
    return team;
  },
  create: async (name: string, ownerId: string) => {
    const createdTeam = await prisma.team.create({
      data: {
        name,
        ownerId,
        budget: 5000000,
      },
    });
    return createdTeam;
  },
};
