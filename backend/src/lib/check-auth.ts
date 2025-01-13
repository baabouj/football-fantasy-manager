import httpStatus from "http-status";
import passport from "passport";

import type { Request } from "express";
import type { User } from "@prisma/client";

import { HttpError } from "./http-error";

const verifyCallback =
  (req: Request, resolve: any, reject: any) =>
  async (err: any, user: User, info: any) => {
    if (err || info || !user) {
      return reject(new HttpError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }
    req.user = user.id;
    return resolve(user);
  };

export const checkAuth = async (req: Request) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req);
  });
};
