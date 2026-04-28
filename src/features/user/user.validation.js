import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be atleast 2 characters")
        .optional(),
    phone: z
        .string()
        .min(10, "Phone Number must be atleast 10 digits")
        .optional(),
    location: z
        .string()
        .optional(),
    bio: z
        .string()
        .max(200, "Bio must be less than 200 characters")
        .optional(),
})