import { z } from "zod";

export const ratinZodSchema = z.object({
    rating: z.number(),
});