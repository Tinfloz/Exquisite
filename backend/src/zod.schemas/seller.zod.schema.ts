import { z } from "zod";

export const productZodSchema = z.object({
    item: z.string(),
    description: z.string().optional(),
    price: z.number(),
    stock: z.number(),
    image: z.string()
});

export const stockZodSchema = z.object({
    stock: z.number()
});