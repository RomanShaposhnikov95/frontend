import { z } from 'zod';

export const formSchema = z.object({
    owner: z
        .string()
        .min(1, { message: 'Owner must be at least 1 character.' })
        .max(50, { message: 'Owner cannot exceed 50 characters.' }),
    text: z
        .string()
        .min(1, { message: 'Log text must be at least 1 character.' })
        .max(200, { message: 'Log text cannot exceed 200 characters.' }),
});
