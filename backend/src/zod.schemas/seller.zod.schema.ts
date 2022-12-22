import { z } from "zod";

export const productZodSchema = z.object({
    item: z.string(),
    description: z.string().optional(),
    price: z.string(),
    stock: z.string(),
    image: z.string()
});

export const stockZodSchema = z.object({
    stock: z.number()
});