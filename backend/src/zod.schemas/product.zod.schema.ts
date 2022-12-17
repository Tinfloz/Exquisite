import { z } from "zod";

export const ratingZodSchema = z.object({
    rating: z.number(),
});