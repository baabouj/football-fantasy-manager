import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import passport from "passport";

import { jwtStrategy } from "./lib/passport";
import { HttpError } from "./lib/http-error";

import { errorHandler } from "./middlewares/error-handler.middleware";

import { authRouter } from "./routes/auth.route";
import { teamRouter } from "./routes/team.route";
import { transfersRouter } from "./routes/transfers.route";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.options("*", cors());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Routes
app.use("/auth", authRouter);
app.use("/team", teamRouter);
app.use("/transfers", transfersRouter);

// Error handling
app.use((_req, _res, next) => {
  next(new HttpError(httpStatus.NOT_FOUND, "Not Found"));
});

app.use(errorHandler);

export { app };
