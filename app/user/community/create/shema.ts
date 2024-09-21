import { z } from "zod";

export const productSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
  }),
  content: z.string({
    required_error: "content is required.",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
