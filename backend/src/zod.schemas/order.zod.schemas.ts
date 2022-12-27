import { z } from "zod";

export const orderZodSchema = z.object({
    orderCreationId: z.string(),
    razorpayPaymentId: z.string(),
    razorpayOrderId: z.string(),
    razorpaySignature: z.string(),
});