'use server'

import { prisma } from '@/lib/prisma'
import { OpenAIService } from '@/lib/services/openai'
import {
  AIGenerateSchema,
  AIImproveContentSchema,
  AIGenerateTitleSchema,
  AIGenerateOutlineSchema,
  AIGenerateExcerptSchema,
  AIGenerateKeywordsSchema,
  type AIGenerateInput,
  type AIImproveContentInput,
  type AIGenerateTitleInput,
  type AIGenerateOutlineInput,
  type AIGenerateExcerptInput,
  type AIGenerateKeywordsInput
} from '@/lib/schemas/ai'

export async function generateAIContent(input: AIGenerateInput) {
  try {
    const validatedData = AIGenerateSchema.parse(input)
    
    // TODO: Get actual user ID from session
    const userId = 'temp-user-id' // Replace with actual auth
    
    const result = await OpenAIService.generateContent(validatedData)
    
    // Save the AI generation to database for tracking
    await prisma.aIGeneration.create({
      data: {
        type: validatedData.type,
        prompt: validatedData.prompt,
        response: result.content,
        model: 'gpt-4-turbo-preview',
        tokens: result.usage?.totalTokens,
        cost: result.usage?.totalTokens ? (result.usage.totalTokens * 0.00003) : null, // Rough estimate
        userId,
        postId: validatedData.postId,
      }
    })
    
    return { success: true, data: result.content }
  } catch (error) {
    console.error('Error generating AI content:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate content' 
    }
  }
}

export async function generateTitles(input: AIGenerateTitleInput) {
  try {
    const validatedData = AIGenerateTitleSchema.parse(input)
    
    const titles = await OpenAIService.generateTitle(validatedData)
    
    return { success: true, data: titles }
  } catch (error) {
    console.error('Error generating titles:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate titles' 
    }
  }
}

export async function generateOutline(input: AIGenerateOutlineInput) {
  try {
    const validatedData = AIGenerateOutlineSchema.parse(input)
    
    // TODO: Get actual user ID from session
    const userId = 'temp-user-id'
    
    const outline = await OpenAIService.generateOutline(validatedData)
    
    // Save the outline generation
    await prisma.aIGeneration.create({
      data: {
        type: 'OUTLINE',
        prompt: `Topic: ${validatedData.topic}, Audience: ${validatedData.targetAudience || 'General'}, Tone: ${validatedData.tone}`,
        response: JSON.stringify(outline),
        model: 'gpt-4-turbo-preview',
        userId,
      }
    })
    
    return { success: true, data: outline }
  } catch (error) {
    console.error('Error generating outline:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate outline' 
    }
  }
}

export async function generateExcerpt(input: AIGenerateExcerptInput) {
  try {
    const validatedData = AIGenerateExcerptSchema.parse(input)
    
    const excerpt = await OpenAIService.generateExcerpt(validatedData)
    
    return { success: true, data: excerpt }
  } catch (error) {
    console.error('Error generating excerpt:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate excerpt' 
    }
  }
}

export async function generateKeywords(input: AIGenerateKeywordsInput) {
  try {
    const validatedData = AIGenerateKeywordsSchema.parse(input)
    
    const keywords = await OpenAIService.generateKeywords(validatedData)
    
    return { success: true, data: keywords }
  } catch (error) {
    console.error('Error generating keywords:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate keywords' 
    }
  }
}

export async function improveContent(input: AIImproveContentInput) {
  try {
    const validatedData = AIImproveContentSchema.parse(input)
    
    // TODO: Get actual user ID from session
    const userId = 'temp-user-id'
    
    const improvedContent = await OpenAIService.improveContent(validatedData)
    
    // Save the improvement to database
    await prisma.aIGeneration.create({
      data: {
        type: 'IMPROVEMENT',
        prompt: `Improve for: ${validatedData.improvementType}. Instructions: ${validatedData.instructions || 'None'}`,
        response: improvedContent,
        model: 'gpt-4-turbo-preview',
        userId,
      }
    })
    
    return { success: true, data: improvedContent }
  } catch (error) {
    console.error('Error improving content:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to improve content' 
    }
  }
}

export async function getAIGenerations(userId?: string, limit: number = 10) {
  try {
    // TODO: Get actual user ID from session if not provided
    const actualUserId = userId || 'temp-user-id'
    
    const generations = await prisma.aIGeneration.findMany({
      where: {
        userId: actualUserId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    })
    
    return { success: true, data: generations }
  } catch (error) {
    console.error('Error fetching AI generations:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch AI generations' 
    }
  }
}
