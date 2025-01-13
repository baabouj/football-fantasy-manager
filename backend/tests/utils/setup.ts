import { prisma } from "../../src/lib/prisma";
import { app } from "../../src/app";

let teardownHappened = false;

export async function setup() {
  await prisma.$connect();
  const server = app.listen(4000);
  return async () => {
    if (teardownHappened) {
      throw new Error("teardown called twice");
    }
    teardownHappened = true;
    server.close();
    await prisma.$transaction([prisma.user.deleteMany()]);
    await prisma.$disconnect();
  };
}
