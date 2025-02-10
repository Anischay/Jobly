import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface SkillSuggestion {
  name: string
  category: string
  relevance: number // 0-1
  reasoning: string
  proficiencyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  marketDemand?: {
    trend: 'RISING' | 'STABLE' | 'DECLINING'
    score: number // 0-1
  }
}

export interface SkillAnalysis {
  suggestedSkills: SkillSuggestion[]
  missingCriticalSkills: SkillSuggestion[]
  skillGaps: {
    category: string
    description: string
    suggestedSkills: SkillSuggestion[]
  }[]
}

export class SkillAnalyzer {
  private static async getSkillEmbedding(skillName: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: skillName,
      encoding_format: "float"
    })
    return response.data[0].embedding
  }

  private static async getTextEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float"
    })
    return response.data[0].embedding
  }

  static async analyzeJobDescription(description: string): Promise<SkillAnalysis> {
    try {
      // Get embedding for the job description
      const jobEmbedding = await this.getTextEmbedding(description)

      // Get all skills from the database
      const allSkills = await prisma.skill.findMany({
        include: {
          skillCategory: true
        }
      })

      // Use GPT-4 to analyze the job description
      const analysisPrompt = `
      Analyze this job description and suggest relevant skills:
      "${description}"

      Consider:
      1. Technical skills directly mentioned
      2. Implied skills based on job requirements
      3. Complementary skills that would be valuable
      4. Required proficiency levels
      5. Current market demand for these skills

      Format your response as JSON with this structure:
      {
        "suggestedSkills": [
          {
            "name": "skill name",
            "category": "skill category",
            "relevance": 0-1 score,
            "reasoning": "why this skill is relevant",
            "proficiencyLevel": "BEGINNER|INTERMEDIATE|EXPERT",
            "marketDemand": {
              "trend": "RISING|STABLE|DECLINING",
              "score": 0-1 score
            }
          }
        ],
        "missingCriticalSkills": [...],
        "skillGaps": [
          {
            "category": "category name",
            "description": "gap description",
            "suggestedSkills": [...]
          }
        ]
      }
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a technical recruiter and skill analysis expert. Analyze job descriptions and suggest relevant skills."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" }
      })

      const analysis = JSON.parse(completion.choices[0].message.content) as SkillAnalysis

      // Enhance suggestions with semantic similarity
      for (const suggestion of analysis.suggestedSkills) {
        const skillEmbedding = await this.getSkillEmbedding(suggestion.name)
        
        // Find similar skills in our database
        const similarSkills = allSkills.map(skill => ({
          skill,
          similarity: this.cosineSimilarity(skillEmbedding, jobEmbedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)

        // If we find a very similar skill in our database, use that instead
        const bestMatch = similarSkills[0]
        if (bestMatch && bestMatch.similarity > 0.85) {
          suggestion.name = bestMatch.skill.name
          suggestion.category = bestMatch.skill.skillCategory?.name || suggestion.category
        }
      }

      return analysis

    } catch (error) {
      console.error('Error analyzing job description:', error)
      throw new Error('Failed to analyze job description')
    }
  }

  static async suggestRelatedSkills(skillNames: string[]): Promise<SkillSuggestion[]> {
    try {
      const prompt = `
      Given these skills: ${skillNames.join(', ')}

      Suggest complementary skills that would enhance a candidate's profile. Consider:
      1. Common skill combinations in the industry
      2. Skills that would provide a competitive advantage
      3. Emerging technologies in related areas
      4. Skills that would enable career growth

      Format your response as JSON array with the same structure as suggestedSkills.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a technical career advisor. Suggest complementary skills that would enhance a candidate's profile."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })

      const suggestions = JSON.parse(completion.choices[0].message.content).suggestedSkills as SkillSuggestion[]
      return suggestions

    } catch (error) {
      console.error('Error suggesting related skills:', error)
      throw new Error('Failed to suggest related skills')
    }
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }
}
