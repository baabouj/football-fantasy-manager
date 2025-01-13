import type { Schema } from "zod";

export type InputError = { input: string; error: string };

export const parseSchema = <T>(
  data: T,
  schema: Schema
):
  | { success: true; data: T }
  | {
      success: false;
      errors: InputError[];
    } => {
  const result = schema.safeParse(data);

  if (result.success) return result;

  const errors = result.error.errors.map((err) => ({
    input: err.path.join("."),
    error: err.message,
  }));

  return {
    success: false,
    errors,
  };
};
