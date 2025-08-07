import OpenAI from 'openai'
import type { 
  AIGenerateInput, 
  AIImproveContentInput, 
  AIGenerateTitleInput,
  AIGenerateOutlineInput,
  AIGenerateExcerptInput,
  AIGenerateKeywordsInput
} from '@/lib/schemas/ai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class OpenAIService {
  static async generateContent(input: AIGenerateInput): Promise<{
    content: string
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }> {
    try {
      const systemPrompt = this.getSystemPrompt(input.type, input.tone)
      const userPrompt = this.buildUserPrompt(input)

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      return {
        content,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate content with AI')
    }
  }

  static async generateTitle(input: AIGenerateTitleInput): Promise<string[]> {
    const prompt = `
Generate 5 engaging blog post titles based on this content. 

Content preview: ${input.content.slice(0, 500)}...

Requirements:
- Tone: ${input.tone}
- Maximum length: ${input.maxLength} characters
- Include these keywords if provided: ${input.keywords?.join(', ') || 'N/A'}
- Make them SEO-friendly and clickable

Return only the titles, one per line.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert copywriter and SEO specialist.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Failed to generate titles')

    return content.split('\n').filter(title => title.trim().length > 0)
  }

  static async generateOutline(input: AIGenerateOutlineInput): Promise<{
    title: string
    sections: Array<{
      heading: string
      subpoints: string[]
    }>
  }> {
    const prompt = `
Create a detailed blog post outline for the topic: "${input.topic}"

Requirements:
- Target audience: ${input.targetAudience || 'General audience'}
- Tone: ${input.tone}
- Depth level: ${input.depth}
- Number of main sections: ${input.sections}

Return a JSON object with:
- title: A compelling blog post title
- sections: Array of objects with "heading" and "subpoints" (3-5 bullet points each)

Make it comprehensive and engaging.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert content strategist. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Failed to generate outline')

    try {
      return JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse outline JSON:', error)
      throw new Error('Invalid outline format generated')
    }
  }

  static async generateExcerpt(input: AIGenerateExcerptInput): Promise<string> {
    const prompt = `
Write a compelling excerpt for this blog post:

Title: ${input.title}
Content preview: ${input.content.slice(0, 800)}...

Requirements:
- Maximum ${input.maxLength} characters
- Hook the reader immediately
- Include the main benefit or value proposition
- Make it SEO-friendly

Return only the excerpt text.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert copywriter specializing in compelling excerpts.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Failed to generate excerpt')

    return content.trim()
  }

  static async generateKeywords(input: AIGenerateKeywordsInput): Promise<string[]> {
    const prompt = `
Generate SEO keywords for this blog post:

Title: ${input.title}
Content preview: ${input.content.slice(0, 1000)}...
Industry: ${input.industry || 'General'}
Target audience: ${input.targetAudience || 'General audience'}

Requirements:
- Maximum ${input.maxKeywords} keywords
- Mix of short-tail and long-tail keywords
- Focus on search intent and relevance
- Include primary and secondary keywords

Return only the keywords as a comma-separated list.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an SEO expert specializing in keyword research.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.5,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Failed to generate keywords')

    return content.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
  }

  static async improveContent(input: AIImproveContentInput): Promise<string> {
    const prompt = `
Improve this content for ${input.improvementType}:

${input.content}

${input.instructions ? `Additional instructions: ${input.instructions}` : ''}

Requirements based on improvement type:
- grammar: Fix grammar, spelling, and punctuation errors
- seo: Optimize for search engines while maintaining readability
- readability: Improve clarity, flow, and sentence structure
- engagement: Make it more engaging and compelling
- structure: Better organize and format the content

Return the improved content only.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert content editor and SEO specialist.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Failed to improve content')

    return content.trim()
  }

  private static getSystemPrompt(type: string, tone: string): string {
    const basePrompt = `You are an expert content creator and copywriter. Write in a ${tone} tone.`
    
    switch (type) {
      case 'OUTLINE':
        return `${basePrompt} Create detailed, well-structured outlines for blog posts.`
      case 'CONTENT':
        return `${basePrompt} Write comprehensive, engaging blog content that provides real value.`
      case 'TITLE':
        return `${basePrompt} Create compelling, SEO-friendly titles that drive clicks.`
      case 'EXCERPT':
        return `${basePrompt} Write compelling excerpts that hook readers immediately.`
      case 'SEO_KEYWORDS':
        return `${basePrompt} You are also an SEO expert. Generate relevant, high-impact keywords.`
      case 'IMPROVEMENT':
        return `${basePrompt} You are also an editor. Improve content while maintaining its voice.`
      default:
        return basePrompt
    }
  }

  private static buildUserPrompt(input: AIGenerateInput): string {
    let prompt = `${input.prompt}\n\n`
    
    if (input.context) {
      prompt += `Context: ${input.context}\n\n`
    }
    
    if (input.targetAudience) {
      prompt += `Target audience: ${input.targetAudience}\n\n`
    }
    
    if (input.keywords && input.keywords.length > 0) {
      prompt += `Keywords to include: ${input.keywords.join(', ')}\n\n`
    }

    return prompt
  }
}

export default OpenAIService
