import { prisma } from '../prisma'
import { OpenAI } from 'openai'
import axios from 'axios'

interface MarketData {
  trend: 'RISING' | 'STABLE' | 'DECLINING'
  score: number
  jobCount: number
  avgSalary: number
  sources: string[]
  lastUpdated: Date
}

export class MarketDemandAggregator {
  private static openai = new OpenAI()
  private static readonly DATA_SOURCES = {
    GITHUB: 'https://api.github.com/search/repositories',
    STACKOVERFLOW: 'https://api.stackexchange.com/2.3/tags',
    LINKEDIN: process.env.LINKEDIN_API_URL,
    INDEED: process.env.INDEED_API_URL
  }

  static async aggregateMarketData(skillName: string): Promise<MarketData> {
    const [
      githubData,
      stackoverflowData,
      linkedinData,
      indeedData,
      aiAnalysis
    ] = await Promise.all([
      this.getGithubTrends(skillName),
      this.getStackOverflowTrends(skillName),
      this.getLinkedInTrends(skillName),
      this.getIndeedTrends(skillName),
      this.getAIMarketAnalysis(skillName)
    ])

    // Combine and normalize data
    const combinedScore = this.calculateCombinedScore({
      github: githubData,
      stackoverflow: stackoverflowData,
      linkedin: linkedinData,
      indeed: indeedData,
      ai: aiAnalysis
    })

    // Store the aggregated data
    await this.storeMarketData(skillName, combinedScore)

    return combinedScore
  }

  private static async getGithubTrends(skillName: string) {
    try {
      const response = await axios.get(`${this.DATA_SOURCES.GITHUB}`, {
        params: {
          q: skillName,
          sort: 'stars',
          order: 'desc'
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })

      return {
        score: this.normalizeScore(response.data.total_count),
        trend: this.analyzeTrend(response.data.items),
        source: 'github'
      }
    } catch (error) {
      console.error('Error fetching GitHub trends:', error)
      return null
    }
  }

  private static async getStackOverflowTrends(skillName: string) {
    try {
      const response = await axios.get(`${this.DATA_SOURCES.STACKOVERFLOW}/${skillName}/info`, {
        params: {
          site: 'stackoverflow'
        }
      })

      return {
        score: this.normalizeScore(response.data.items[0]?.count || 0),
        trend: this.analyzeTrend(response.data.items),
        source: 'stackoverflow'
      }
    } catch (error) {
      console.error('Error fetching Stack Overflow trends:', error)
      return null
    }
  }

  private static async getLinkedInTrends(skillName: string) {
    if (!process.env.LINKEDIN_API_URL) return null

    try {
      const response = await axios.get(`${this.DATA_SOURCES.LINKEDIN}/skills`, {
        params: { skill: skillName },
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`
        }
      })

      return {
        score: this.normalizeScore(response.data.jobCount),
        trend: response.data.trend,
        source: 'linkedin'
      }
    } catch (error) {
      console.error('Error fetching LinkedIn trends:', error)
      return null
    }
  }

  private static async getIndeedTrends(skillName: string) {
    if (!process.env.INDEED_API_URL) return null

    try {
      const response = await axios.get(`${this.DATA_SOURCES.INDEED}/trends`, {
        params: { q: skillName },
        headers: {
          Authorization: `Bearer ${process.env.INDEED_API_KEY}`
        }
      })

      return {
        score: this.normalizeScore(response.data.jobCount),
        trend: response.data.trend,
        avgSalary: response.data.averageSalary,
        source: 'indeed'
      }
    } catch (error) {
      console.error('Error fetching Indeed trends:', error)
      return null
    }
  }

  private static async getAIMarketAnalysis(skillName: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a market research expert analyzing technology skill trends.'
          },
          {
            role: 'user',
            content: `Analyze the current market demand and future outlook for ${skillName} skill. 
            Consider:
            1. Industry adoption
            2. Job market demand
            3. Future growth potential
            4. Technology maturity
            
            Return JSON format:
            {
              "score": number (0-1),
              "trend": "RISING" | "STABLE" | "DECLINING",
              "confidence": number (0-1)
            }`
          }
        ]
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      return {
        score: analysis.score,
        trend: analysis.trend,
        confidence: analysis.confidence,
        source: 'ai'
      }
    } catch (error) {
      console.error('Error getting AI market analysis:', error)
      return null
    }
  }

  private static normalizeScore(value: number): number {
    // Implement min-max normalization based on historical data
    return Math.min(Math.max(value / 10000, 0), 1)
  }

  private static analyzeTrend(data: any[]): 'RISING' | 'STABLE' | 'DECLINING' {
    // Implement trend analysis based on historical data points
    return 'STABLE'
  }

  private static calculateCombinedScore(sources: {
    github: any
    stackoverflow: any
    linkedin: any
    indeed: any
    ai: any
  }): MarketData {
    const validSources = Object.entries(sources).filter(([_, data]) => data !== null)
    
    if (validSources.length === 0) {
      throw new Error('No valid data sources available')
    }

    // Calculate weighted average score
    const weights = {
      github: 0.2,
      stackoverflow: 0.2,
      linkedin: 0.25,
      indeed: 0.25,
      ai: 0.1
    }

    let totalScore = 0
    let totalWeight = 0
    let jobCount = 0
    let avgSalary = 0
    let salaryCount = 0
    const trends = new Map<string, number>()

    validSources.forEach(([source, data]) => {
      if (data.score !== undefined) {
        totalScore += data.score * weights[source as keyof typeof weights]
        totalWeight += weights[source as keyof typeof weights]
      }

      if (data.trend) {
        trends.set(data.trend, (trends.get(data.trend) || 0) + 1)
      }

      if (source === 'indeed' || source === 'linkedin') {
        if (data.jobCount) jobCount += data.jobCount
        if (data.avgSalary) {
          avgSalary += data.avgSalary
          salaryCount++
        }
      }
    })

    // Determine overall trend
    let maxTrendCount = 0
    let dominantTrend: MarketData['trend'] = 'STABLE'
    trends.forEach((count, trend) => {
      if (count > maxTrendCount) {
        maxTrendCount = count
        dominantTrend = trend as MarketData['trend']
      }
    })

    return {
      trend: dominantTrend,
      score: totalScore / totalWeight,
      jobCount,
      avgSalary: salaryCount > 0 ? avgSalary / salaryCount : 0,
      sources: validSources.map(([source]) => source),
      lastUpdated: new Date()
    }
  }

  private static async storeMarketData(skillName: string, data: MarketData) {
    const skill = await prisma.skill.findFirst({
      where: { name: skillName.toLowerCase() }
    })

    if (!skill) return

    await prisma.skillMarketDemand.upsert({
      where: { skillId: skill.id },
      create: {
        skillId: skill.id,
        trend: data.trend,
        score: data.score,
        jobCount: data.jobCount,
        avgSalary: data.avgSalary,
        sources: data.sources,
        lastUpdated: data.lastUpdated
      },
      update: {
        trend: data.trend,
        score: data.score,
        jobCount: data.jobCount,
        avgSalary: data.avgSalary,
        sources: data.sources,
        lastUpdated: data.lastUpdated
      }
    })
  }
}
