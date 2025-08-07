import { z } from 'zod'

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.date().optional(),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  keywords: z.array(z.string()).max(10, 'Maximum 10 keywords allowed').default([]),
  readTime: z.number().min(0).default(0),
  aiGenerated: z.boolean().default(false),
  aiPrompt: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
})

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string().min(1, 'Post ID is required'),
})

export const PublishPostSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  publishedAt: z.date().optional(),
})

export const PostQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title', 'views']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>
export type PublishPostInput = z.infer<typeof PublishPostSchema>
export type PostQueryInput = z.infer<typeof PostQuerySchema>
