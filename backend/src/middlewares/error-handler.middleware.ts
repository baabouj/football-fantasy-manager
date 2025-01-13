import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pino from "pino";

import { HttpError } from "../lib/http-error";

const errorConverter = (err: Error | HttpError): HttpError => {
  if (!(err instanceof HttpError)) {
    if (process.env.NODE_ENV === "development") {
      // log error in development
      pino().error(err);
    }

    return new HttpError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }

  return err;
};

const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const exception = errorConverter(err);
  res.status(exception.getStatus()).send(exception.getResponse());
};

export { errorHandler };
