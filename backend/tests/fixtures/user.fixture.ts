import { faker } from "@faker-js/faker";
import { prisma } from "../../src/lib/prisma";
import { hash } from "../../src/lib/hash";

export type User = {
  id: string;
  email: string;
  password: string;
};

const generateUser = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
  };
};

const insertUsers = async (users: User[]) => {
  const createdUsers = await Promise.all(
    users.map(async ({ password, ...user }) => {
      const hashedPassword = await hash.make(password);
      return prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
    })
  );
  return createdUsers;
};

export { generateUser, insertUsers };
