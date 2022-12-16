import { z } from "zod";

export const qtyZodSchema = z.object({
    qty: z.number()
});

export const commentZodSchema = z.object({
    comment: z.string()
});
