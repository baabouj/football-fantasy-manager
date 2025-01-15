import { z } from "zod";

export const findTransfersSchema = {
  query: z
    .object({
      team: z.string().max(64).optional(),
      player: z.string().max(64).optional(),
      price: z
        .string()
        .transform((p) => {
          const price = parseInt(p, 10);
          return !Number.isNaN(price) && price > 0 ? price : undefined;
        })
        .optional(),
    })
    .optional()
    .default({}),
};

export const addToTransferListSchema = {
  body: z.object({
    askingPrice: z.number(),
  }),
  params: z.object({
    playerId: z.string().cuid(),
  }),
};

export type TransferQuery = z.infer<typeof findTransfersSchema.query>;
