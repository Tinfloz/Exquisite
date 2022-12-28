import { z } from "zod";

// user body validation
export const userZodSchema = z.object({
    email: z.string(),
    password: z.string(),
    userType: z.string().optional(),
    name: z.string().optional()
});

export const addressZodSchema = z.object({
    address: z.string(),
    city: z.string(),
    province: z.string(),
    pincode: z.string(),
});

export const userAccChangeZodSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional(),
});

export const resetPasswordLinkZodSchema = z.object({
    email: z.string()
});

export const resetPasswordSetZodSchema = z.object({
    password: z.string(),
    confirmPassword: z.string()
});