import { OpenAI } from 'openai'
import { SkillAnalyzer } from './skillAnalyzer'
import { prisma } from '../prisma'

export interface SkillGap {
  missingSkill: string
  importance: number
  relevance: number
  timeToAcquire: string
  prerequisites: string[]
  resources: LearningResource[]
}

export interface LearningResource {
  title: string
  type: 'course' | 'book' | 'tutorial' | 'documentation'
  provider: string
  url: string
  duration: string
  cost: string
  rating: number
}

export interface LearningPath {
  gaps: SkillGap[]
  estimatedTimeToCompletion: string
  recommendedOrder: string[]
  totalCost: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export class SkillGapAnalyzer {
  private static openai = new OpenAI()

  static async analyzeSkillGap(
    userSkills: { name: string; proficiencyLevel: string }[],
    jobSkills: { name: string; proficiencyLevel: string; importance: number }[]
  ): Promise<LearningPath> {
    // Compare user skills with job requirements
    const gaps: SkillGap[] = []
    const userSkillMap = new Map(userSkills.map(s => [s.name.toLowerCase(), s]))

    for (const jobSkill of jobSkills) {
      const userSkill = userSkillMap.get(jobSkill.name.toLowerCase())
      
      if (!userSkill || this.needsImprovement(userSkill.proficiencyLevel, jobSkill.proficiencyLevel)) {
        const gap = await this.analyzeGap(jobSkill, userSkill)
        gaps.push(gap)
      }
    }

    // Sort gaps by importance and create learning path
    gaps.sort((a, b) => b.importance - a.importance)
    
    const learningPath = await this.generateLearningPath(gaps)
    return learningPath
  }

  private static needsImprovement(userLevel: string, requiredLevel: string): boolean {
    const levels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT']
    return levels.indexOf(userLevel) < levels.indexOf(requiredLevel)
  }

  private static async analyzeGap(
    jobSkill: { name: string; proficiencyLevel: string; importance: number },
    userSkill?: { name: string; proficiencyLevel: string }
  ): Promise<SkillGap> {
    // Get skill details from database
    const skillData = await prisma.skill.findFirst({
      where: { name: jobSkill.name.toLowerCase() },
      include: { marketDemand: true }
    })

    // Use OpenAI to analyze learning requirements
    const prompt = `Analyze the learning requirements for ${jobSkill.name} skill:
    Current level: ${userSkill?.proficiencyLevel || 'NONE'}
    Required level: ${jobSkill.proficiencyLevel}
    
    Please provide:
    1. Estimated time to acquire
    2. Prerequisites
    3. Best learning resources (courses, books, tutorials)
    4. Learning difficulty
    
    Format as JSON with these fields:
    {
      "timeToAcquire": "string",
      "prerequisites": ["string"],
      "resources": [{
        "title": "string",
        "type": "course|book|tutorial|documentation",
        "provider": "string",
        "url": "string",
        "duration": "string",
        "cost": "string",
        "rating": number
      }]
    }`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a skilled career advisor and learning path expert.' },
        { role: 'user', content: prompt }
      ]
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')

    return {
      missingSkill: jobSkill.name,
      importance: jobSkill.importance,
      relevance: skillData?.marketDemand?.score || 0.5,
      timeToAcquire: analysis.timeToAcquire,
      prerequisites: analysis.prerequisites,
      resources: analysis.resources
    }
  }

  private static async generateLearningPath(gaps: SkillGap[]): Promise<LearningPath> {
    // Calculate total time and cost
    const totalTime = this.calculateTotalTime(gaps)
    const totalCost = this.calculateTotalCost(gaps)
    
    // Determine optimal learning order
    const recommendedOrder = await this.determineOptimalOrder(gaps)
    
    // Determine overall difficulty
    const difficulty = this.determineOverallDifficulty(gaps)

    return {
      gaps,
      estimatedTimeToCompletion: totalTime,
      recommendedOrder,
      totalCost,
      difficulty
    }
  }

  private static calculateTotalTime(gaps: SkillGap[]): string {
    // Convert individual times to hours and sum
    const totalHours = gaps.reduce((total, gap) => {
      const time = gap.timeToAcquire
      const hours = this.convertTimeToHours(time)
      return total + hours
    }, 0)

    // Convert back to human-readable format
    if (totalHours < 24) {
      return `${totalHours} hours`
    } else if (totalHours < 168) {
      return `${Math.ceil(totalHours / 24)} days`
    } else {
      return `${Math.ceil(totalHours / 168)} weeks`
    }
  }

  private static convertTimeToHours(timeString: string): number {
    const hours = timeString.toLowerCase()
    if (hours.includes('week')) {
      return parseInt(hours) * 40 // Assuming 40 hours per week
    } else if (hours.includes('day')) {
      return parseInt(hours) * 8 // Assuming 8 hours per day
    } else if (hours.includes('month')) {
      return parseInt(hours) * 160 // Assuming 160 hours per month
    }
    return parseInt(hours) // Already in hours
  }

  private static calculateTotalCost(gaps: SkillGap[]): string {
    let totalCost = 0
    
    gaps.forEach(gap => {
      gap.resources.forEach(resource => {
        const cost = parseInt(resource.cost.replace(/[^0-9]/g, '')) || 0
        totalCost += cost
      })
    })

    return totalCost > 0 ? `$${totalCost}` : 'Free'
  }

  private static async determineOptimalOrder(gaps: SkillGap[]): Promise<string[]> {
    // Create dependency graph
    const graph = new Map<string, Set<string>>()
    gaps.forEach(gap => {
      graph.set(gap.missingSkill, new Set())
      gap.prerequisites.forEach(prereq => {
        const prereqGap = gaps.find(g => g.missingSkill === prereq)
        if (prereqGap) {
          graph.get(gap.missingSkill)?.add(prereq)
        }
      })
    })

    // Topological sort
    const visited = new Set<string>()
    const order: string[] = []

    const visit = (skill: string) => {
      if (visited.has(skill)) return
      visited.add(skill)
      graph.get(skill)?.forEach(prereq => visit(prereq))
      order.push(skill)
    }

    gaps.forEach(gap => visit(gap.missingSkill))
    return order.reverse()
  }

  private static determineOverallDifficulty(gaps: SkillGap[]): 'beginner' | 'intermediate' | 'advanced' {
    const avgImportance = gaps.reduce((sum, gap) => sum + gap.importance, 0) / gaps.length
    if (avgImportance < 0.4) return 'beginner'
    if (avgImportance < 0.7) return 'intermediate'
    return 'advanced'
  }
}
