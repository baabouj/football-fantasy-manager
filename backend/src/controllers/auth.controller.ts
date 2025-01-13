import { handleAsync } from "../lib/handle-async";

import httpStatus from "http-status";
import { authService } from "../services/auth.service";
import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants";
import { HttpError } from "../lib/http-error";
import { generateJwt } from "../lib/jwt";
import { loginSchema } from "../validations/auth.validation";

export const authController = {
  login: handleAsync(
    async (req, res) => {
      const { email, password } = req.body;

      const data = await authService.login(email, password);

      if (!data)
        throw new HttpError(httpStatus.UNAUTHORIZED, "Invalid credentials");

      const cookieToken: string = req.cookies[`${ACCESS_TOKEN_COOKIE_NAME}`];

      if (cookieToken) {
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
          secure: true,
          httpOnly: true,
          sameSite: "lax",
        });
      }

      const accessToken = generateJwt(data.user.id);
      res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1h
      });

      res
        .status(data.isFirstTime ? httpStatus.CREATED : httpStatus.OK)
        .send(data);
    },
    {
      schema: loginSchema,
    }
  ),
  logout: handleAsync(
    async (req, res) => {
      const cookieToken: string = req.cookies[`${ACCESS_TOKEN_COOKIE_NAME}`];

      if (cookieToken) {
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
          secure: true,
          httpOnly: true,
          sameSite: "lax",
        });
      }

      res.status(httpStatus.NO_CONTENT).send(null);
    },
    {
      isProtected: true,
    }
  ),
};