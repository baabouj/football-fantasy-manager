import { prisma } from "../lib/prisma";

export const userService = {
  find: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  },
  findByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  },
  create: async (email: string, password: string) => {
    const createdUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    return createdUser;
  },
};
