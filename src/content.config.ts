import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.enum(['silicon-voice', 'tech-obs', 'future-lens', 'human-memo']).default('silicon-voice'),
    lang: z.enum(['zh', 'en', 'bilingual']).default('bilingual'),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const novelChapters = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/novel' }),
  schema: z.object({
    part: z.number(),
    partTitle: z.string(),
    chapter: z.number(),
    chapterTitle: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    wordCount: z.number(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, novelChapters };
