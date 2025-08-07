import { z } from 'zod'

export const AIGenerateSchema = z.object({
  type: z.enum(['OUTLINE', 'CONTENT', 'TITLE', 'EXCERPT', 'SEO_KEYWORDS', 'IMPROVEMENT']),
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt must be less than 2000 characters'),
  context: z.string().optional(), // Additional context for generation
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']).default('professional'),
  targetAudience: z.string().optional(),
  keywords: z.array(z.string()).max(10).optional(),
  postId: z.string().optional(), // For improvements on existing posts
})

export const AIImproveContentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  improvementType: z.enum(['grammar', 'seo', 'readability', 'engagement', 'structure']),
  instructions: z.string().optional(),
})

export const AIGenerateTitleSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  keywords: z.array(z.string()).max(5).optional(),
  tone: z.enum(['professional', 'casual', 'clickbait', 'informative', 'question']).default('professional'),
  maxLength: z.number().min(10).max(100).default(60),
})

export const AIGenerateOutlineSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  targetAudience: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative']).default('professional'),
  depth: z.enum(['basic', 'intermediate', 'advanced']).default('intermediate'),
  sections: z.number().min(3).max(10).default(5),
})

export const AIGenerateExcerptSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  maxLength: z.number().min(50).max(300).default(150),
})

export const AIGenerateKeywordsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  maxKeywords: z.number().min(1).max(20).default(10),
})

export type AIGenerateInput = z.infer<typeof AIGenerateSchema>
export type AIImproveContentInput = z.infer<typeof AIImproveContentSchema>
export type AIGenerateTitleInput = z.infer<typeof AIGenerateTitleSchema>
export type AIGenerateOutlineInput = z.infer<typeof AIGenerateOutlineSchema>
export type AIGenerateExcerptInput = z.infer<typeof AIGenerateExcerptSchema>
export type AIGenerateKeywordsInput = z.infer<typeof AIGenerateKeywordsSchema>
