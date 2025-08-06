import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/docs",
  }),
  schema: z.object({
    title: z.string(),
    mainImage: z.string().optional(),
    summary: z.string().optional(),
    slug: z.string(), // Add slug to the schema
  }),
});

export const collections = { docs };
