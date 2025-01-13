import argon from "argon2";

export const hash = {
  make: (plain: string) => {
    return argon.hash(plain);
  },
  verify: (hash: string, plain: string) => {
    return argon.verify(hash, plain);
  },
};
