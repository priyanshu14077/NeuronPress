'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { 
  CreatePostSchema, 
  UpdatePostSchema, 
  PublishPostSchema, 
  PostQuerySchema,
  type CreatePostInput,
  type UpdatePostInput,
  type PublishPostInput,
  type PostQueryInput
} from '@/lib/schemas/post'

export async function createPost(input: CreatePostInput) {
  try {
    const validatedData = CreatePostSchema.parse(input)
    
    // TODO: Get actual user ID from session
    const userId = 'temp-user-id' // Replace with actual auth
    
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: userId,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      }
    })

    revalidatePath('/posts')
    revalidatePath('/dashboard')
    
    return { success: true, data: post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create post' 
    }
  }
}

export async function updatePost(input: UpdatePostInput) {
  try {
    const validatedData = UpdatePostSchema.parse(input)
    const { id, ...updateData } = validatedData
    // TODO: Handle categoryIds and tagIds when implementing many-to-many relationships
    
    // TODO: Add authorization check - user can only update their own posts
    
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      }
    })

    revalidatePath('/posts')
    revalidatePath('/dashboard')
    revalidatePath(`/posts/${post.slug}`)
    
    return { success: true, data: post }
  } catch (error) {
    console.error('Error updating post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update post' 
    }
  }
}

export async function publishPost(input: PublishPostInput) {
  try {
    const validatedData = PublishPostSchema.parse(input)
    
    // TODO: Add authorization check
    
    const post = await prisma.post.update({
      where: { id: validatedData.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: validatedData.publishedAt || new Date(),
      },
      include: {
        author: true,
      }
    })

    revalidatePath('/posts')
    revalidatePath('/dashboard')
    
    return { success: true, data: post }
  } catch (error) {
    console.error('Error publishing post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to publish post' 
    }
  }
}

export async function deletePost(id: string) {
  try {
    // TODO: Add authorization check
    
    await prisma.post.delete({
      where: { id }
    })

    revalidatePath('/posts')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete post' 
    }
  }
}

export async function getPosts(input: Partial<PostQueryInput> = {}) {
  try {
    const validatedData = PostQuerySchema.parse(input)
    const { page, limit, search, status, authorId, categoryId, tagId, sortBy, sortOrder } = validatedData
    
    const skip = (page - 1) * limit
    
    const where: Prisma.PostWhereInput = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (authorId) {
      where.authorId = authorId
    }
    
    if (categoryId) {
      where.categories = {
        some: {
          categoryId: categoryId
        }
      }
    }
    
    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId
        }
      }
    }
    
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortBy]: sortOrder
    }
    
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              postLikes: true,
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])
    
    return {
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        }
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch posts' 
    }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            postLikes: true,
          }
        }
      }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1
        }
      }
    })
    
    return { success: true, data: post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch post' 
    }
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    return { success: true, data: post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch post' 
    }
  }
}

export async function generateSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })
    
    if (!existingPost) {
      break
    }
    
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}
