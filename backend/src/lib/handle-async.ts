import httpStatus from "http-status";

import type { RequestHandler } from "express";
import { type Schema } from "zod";

import { checkAuth } from "./check-auth";
import { type InputError, parseSchema } from "./parse-schema";
import { HttpError } from "./http-error";

export const handleAsync = <
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown
>(
  fn: RequestHandler<TParams, any, TBody, TQuery>,
  settings?: {
    schema?: {
      body?: Schema<TBody>;
      query?: Schema<TQuery>;
      params?: Schema<TParams>;
    };
    isProtected?: boolean;
  }
): RequestHandler => {
  return async (req, res, next) => {
    try {
      if (settings?.isProtected) {
        await checkAuth(req);
      }

      if (settings?.schema) {
        let errors: InputError[] = [];
        for (const [key, keySchema] of Object.entries(settings.schema)) {
          const result = parseSchema((req as any)[key], keySchema);

          if (!result.success) {
            errors = [...errors, ...result.errors];
          } else {
            // @ts-ignore
            // overwrite the request input with the validated data
            req[key] = result.data;
          }
        }
        if (errors.length > 0) {
          throw new HttpError(httpStatus.BAD_REQUEST, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Validation failed",
            errors,
          });
        }
      }

      // @ts-ignore
      await Promise.resolve(fn(req, res, next));
    } catch (error) {
      next(error);
    }
  };
};
