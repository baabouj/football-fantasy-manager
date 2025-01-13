import type { Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";

import { ACCESS_TOKEN_COOKIE_NAME } from "./constants";
import { userService } from "../services/user.service";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET!,
  jwtFromRequest: (req: Request) => {
    const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return "";
    return token;
  },
};

const jwtVerify = async (payload: any, done: any) => {
  const user = await userService.find(payload.sub as string);

  if (!user) {
    return done(null, false);
  }
  return done(null, user);
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
