import { OpenAI } from 'openai'
import { prisma } from '../prisma'
import { SkillGapAnalyzer } from './skillGapAnalyzer'
import { MarketDemandAggregator } from '../services/marketDemandAggregator'
import { JobListing, Skill, UserSkill, User, Profile } from '@prisma/client'

type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

interface MatchScore {
  total: number
  breakdown: {
    skillMatch: number
    proficiencyMatch: number
    marketAlignment: number
    learningPotential: number
    experienceMatch: number
  }
  gapAnalysis: {
    missingSkills: Array<{
      name: string
      importance: number
      timeToAcquire: string
    }>
    timeToReachIdeal: string
    suggestedLearningPath: string[]
  }
  matchDetails: string[]
}

interface JobRequirements {
  title: string
  description: string
  skills: Array<{
    name: string
    required: boolean
    proficiencyLevel: ProficiencyLevel
    importance: number
  }>
  experience?: {
    years: number
    level: string
  }
}

interface CandidateProfile {
  skills: Array<{
    name: string
    proficiencyLevel: ProficiencyLevel
    yearsOfExperience: number
  }>
  experience?: {
    totalYears: number
    relevantYears: number
  }
  learningSpeed?: number
  adaptabilityScore?: number
}

interface MarketInfo {
  score: number
  trend: 'RISING' | 'STABLE' | 'DECLINING'
  jobCount: number
  avgSalary: number
}

export class SmartMatcher {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  private static readonly WEIGHTS = {
    REQUIRED_SKILLS: 0.4,
    PREFERRED_SKILLS: 0.2,
    PROFICIENCY: 0.15,
    MARKET_ALIGNMENT: 0.1,
    LEARNING_POTENTIAL: 0.1,
    EXPERIENCE: 0.05
  } as const

  private static readonly PROFICIENCY_LEVELS: Record<ProficiencyLevel, number> = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    EXPERT: 3
  } as const

  private static readonly DIFFICULTY_LEVELS: Record<DifficultyLevel, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
  } as const

  static async calculateMatchScore(
    jobId: string,
    candidateId: string
  ): Promise<MatchScore> {
    try {
      // Fetch job and candidate data
      const [job, candidate] = await Promise.all([
        this.getJobRequirements(jobId),
        this.getCandidateProfile(candidateId)
      ])

      // Calculate individual score components
      const [
        skillMatchScore,
        proficiencyScore,
        marketAlignmentScore,
        learningPotentialScore,
        experienceScore,
        gapAnalysis
      ] = await Promise.all([
        this.calculateSkillMatch(job.skills, candidate.skills),
        this.calculateProficiencyMatch(job.skills, candidate.skills),
        this.calculateMarketAlignment(job.skills, candidate.skills),
        this.calculateLearningPotential(job, candidate),
        this.calculateExperienceMatch(job.experience, candidate.experience),
        this.analyzeSkillGaps(job, candidate)
      ])

      // Calculate total score with weighted components
      const total =
        skillMatchScore * this.WEIGHTS.REQUIRED_SKILLS +
        proficiencyScore * this.WEIGHTS.PROFICIENCY +
        marketAlignmentScore * this.WEIGHTS.MARKET_ALIGNMENT +
        learningPotentialScore * this.WEIGHTS.LEARNING_POTENTIAL +
        experienceScore * this.WEIGHTS.EXPERIENCE

      // Generate match details
      const matchDetails = await this.generateMatchInsights(
        job,
        candidate,
        {
          skillMatch: skillMatchScore,
          proficiencyMatch: proficiencyScore,
          marketAlignment: marketAlignmentScore,
          learningPotential: learningPotentialScore,
          experienceMatch: experienceScore
        },
        gapAnalysis
      )

      return {
        total,
        breakdown: {
          skillMatch: skillMatchScore,
          proficiencyMatch: proficiencyScore,
          marketAlignment: marketAlignmentScore,
          learningPotential: learningPotentialScore,
          experienceMatch: experienceScore
        },
        gapAnalysis,
        matchDetails
      }
    } catch (error) {
      console.error('Error calculating match score:', error)
      throw error
    }
  }

  private static async getJobRequirements(jobId: string): Promise<JobRequirements> {
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!job) {
      throw new Error(`Job not found: ${jobId}`)
    }

    return {
      title: job.title,
      description: job.description,
      skills: job.skills.map(s => ({
        name: s.skill.name,
        required: s.required,
        proficiencyLevel: s.proficiencyLevel as ProficiencyLevel,
        importance: s.importance
      })),
      experience: job.requirements ? {
        years: parseInt(job.requirements.match(/(\d+)\s+years?/)?.[1] || '0'),
        level: job.requirements
      } : undefined
    }
  }

  private static async getCandidateProfile(candidateId: string): Promise<CandidateProfile> {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        profile: true
      }
    })

    if (!candidate) {
      throw new Error(`Candidate not found: ${candidateId}`)
    }

    return {
      skills: candidate.skills.map(s => ({
        name: s.skill.name,
        proficiencyLevel: s.proficiencyLevel as ProficiencyLevel,
        yearsOfExperience: s.yearsOfExperience
      })),
      experience: candidate.profile ? {
        totalYears: candidate.profile.totalYearsOfExperience,
        relevantYears: candidate.profile.relevantYearsOfExperience
      } : undefined,
      learningSpeed: candidate.profile?.learningSpeed,
      adaptabilityScore: candidate.profile?.adaptabilityScore
    }
  }

  private static async calculateSkillMatch(
    jobSkills: JobRequirements['skills'],
    candidateSkills: CandidateProfile['skills']
  ): Promise<number> {
    const candidateSkillMap = new Map(
      candidateSkills.map(s => [s.name.toLowerCase(), s])
    )

    const requiredSkills = jobSkills.filter(s => s.required)
    const preferredSkills = jobSkills.filter(s => !s.required)

    // Calculate required skills match
    const requiredMatches = requiredSkills.reduce((score, skill) => {
      return score + (candidateSkillMap.has(skill.name.toLowerCase()) ? skill.importance : 0)
    }, 0)
    const requiredTotal = requiredSkills.reduce((total, skill) => total + skill.importance, 0)
    const requiredScore = requiredTotal > 0 ? requiredMatches / requiredTotal : 1

    // Calculate preferred skills match
    const preferredMatches = preferredSkills.reduce((score, skill) => {
      return score + (candidateSkillMap.has(skill.name.toLowerCase()) ? skill.importance : 0)
    }, 0)
    const preferredTotal = preferredSkills.reduce((total, skill) => total + skill.importance, 0)
    const preferredScore = preferredTotal > 0 ? preferredMatches / preferredTotal : 1

    return (
      requiredScore * this.WEIGHTS.REQUIRED_SKILLS +
      preferredScore * this.WEIGHTS.PREFERRED_SKILLS
    ) / (this.WEIGHTS.REQUIRED_SKILLS + this.WEIGHTS.PREFERRED_SKILLS)
  }

  private static async calculateProficiencyMatch(
    jobSkills: JobRequirements['skills'],
    candidateSkills: CandidateProfile['skills']
  ): Promise<number> {
    const candidateSkillMap = new Map(
      candidateSkills.map(s => [s.name.toLowerCase(), s])
    )

    let totalScore = 0
    let totalWeight = 0

    jobSkills.forEach(jobSkill => {
      const candidateSkill = candidateSkillMap.get(jobSkill.name.toLowerCase())
      if (candidateSkill) {
        const requiredLevel = this.PROFICIENCY_LEVELS[jobSkill.proficiencyLevel]
        const candidateLevel = this.PROFICIENCY_LEVELS[candidateSkill.proficiencyLevel]
        
        const levelDiff = candidateLevel - requiredLevel
        const score = levelDiff >= 0 ? 1 : Math.max(0, 1 + levelDiff * 0.5)
        
        totalScore += score * jobSkill.importance
        totalWeight += jobSkill.importance
      }
    })

    return totalWeight > 0 ? totalScore / totalWeight : 0
  }

  private static async calculateMarketAlignment(
    jobSkills: JobRequirements['skills'],
    candidateSkills: CandidateProfile['skills']
  ): Promise<number> {
    try {
      // Get market data for all skills
      const [jobMarketData, candidateMarketData] = await Promise.all([
        Promise.all(
          jobSkills.map(async skill => {
            try {
              return {
                skill: skill.name.toLowerCase(),
                data: await MarketDemandAggregator.aggregateMarketData(skill.name)
              }
            } catch (error) {
              console.error(`Error fetching market data for ${skill.name}:`, error)
              return null
            }
          })
        ),
        Promise.all(
          candidateSkills.map(async skill => {
            try {
              return {
                skill: skill.name.toLowerCase(),
                data: await MarketDemandAggregator.aggregateMarketData(skill.name)
              }
            } catch (error) {
              console.error(`Error fetching market data for ${skill.name}:`, error)
              return null
            }
          })
        )
      ])

      // Filter out failed requests
      const validJobData = jobMarketData.filter((d): d is NonNullable<typeof d> => d !== null)
      const validCandidateData = candidateMarketData.filter((d): d is NonNullable<typeof d> => d !== null)

      // Calculate market alignment score
      let alignmentScore = 0
      let totalWeight = 0

      // Score based on job requirements alignment
      validJobData.forEach(({ skill, data }) => {
        const jobSkill = jobSkills.find(s => s.name.toLowerCase() === skill)
        if (!jobSkill) return

        const candidateHasSkill = candidateSkills.some(s => s.name.toLowerCase() === skill)
        if (candidateHasSkill) {
          const trendMultiplier = 
            data.trend === 'RISING' ? 1.2 :
            data.trend === 'STABLE' ? 1.0 :
            0.8

          const demandMultiplier =
            data.demandLevel === 'HIGH' ? 1.2 :
            data.demandLevel === 'MEDIUM' ? 1.0 :
            0.8

          const skillScore = data.score * trendMultiplier * demandMultiplier
          alignmentScore += skillScore * jobSkill.importance
          totalWeight += jobSkill.importance
        }
      })

      // Score based on candidate's additional skills
      validCandidateData.forEach(({ skill, data }) => {
        if (!jobSkills.some(s => s.name.toLowerCase() === skill)) {
          const trendMultiplier = 
            data.trend === 'RISING' ? 0.5 : // Bonus for having rising skills
            data.trend === 'STABLE' ? 0.3 :
            0.1

          const demandMultiplier =
            data.demandLevel === 'HIGH' ? 0.5 :
            data.demandLevel === 'MEDIUM' ? 0.3 :
            0.1

          alignmentScore += data.score * trendMultiplier * demandMultiplier
          totalWeight += 0.5 // Lower weight for additional skills
        }
      })

      return totalWeight > 0 ? Math.min(1, alignmentScore / totalWeight) : 0
    } catch (error) {
      console.error('Error calculating market alignment:', error)
      return 0
    }
  }

  private static async calculateLearningPotential(
    job: JobRequirements,
    candidate: CandidateProfile
  ): Promise<number> {
    try {
      // Get skill gaps
      const gaps = await SkillGapAnalyzer.analyzeSkillGap(
        candidate.skills,
        job.skills
      )

      // Calculate base difficulty factor
      const learningDifficulty = this.DIFFICULTY_LEVELS[gaps.difficulty]
      
      // Get candidate's learning factors
      const adaptabilityFactor = candidate.adaptabilityScore || 0.5
      const learningSpeedFactor = candidate.learningSpeed || 0.5

      // Calculate skill overlap ratio
      const candidateSkillSet = new Set(candidate.skills.map(s => s.name.toLowerCase()))
      const jobSkillSet = new Set(job.skills.map(s => s.name.toLowerCase()))
      const overlapCount = [...jobSkillSet].filter(s => candidateSkillSet.has(s)).length
      const overlapRatio = overlapCount / jobSkillSet.size

      // Calculate skill progression
      const skillProgression = candidate.skills.reduce((acc, skill) => {
        const proficiencyLevel = this.PROFICIENCY_LEVELS[skill.proficiencyLevel]
        return acc + (proficiencyLevel * skill.yearsOfExperience)
      }, 0) / candidate.skills.length

      // Calculate related skills factor
      const relatedSkillsBonus = await this.calculateRelatedSkillsBonus(
        candidate.skills,
        gaps.gaps.map(g => g.missingSkill)
      )

      // Calculate final potential score
      const baseScore = (adaptabilityFactor + learningSpeedFactor) / 2
      const difficultyAdjustment = 1 / Math.max(1, learningDifficulty)
      const progressionBonus = Math.min(0.2, skillProgression * 0.05)
      const overlapBonus = overlapRatio * 0.2
      const relatedBonus = relatedSkillsBonus * 0.2

      const finalScore = (
        baseScore * 0.4 +
        difficultyAdjustment * 0.2 +
        progressionBonus +
        overlapBonus +
        relatedBonus
      )

      return Math.min(1, Math.max(0, finalScore))
    } catch (error) {
      console.error('Error calculating learning potential:', error)
      return 0.5
    }
  }

  private static async calculateRelatedSkillsBonus(
    candidateSkills: CandidateProfile['skills'],
    missingSkills: string[]
  ): Promise<number> {
    try {
      const prompt = `Analyze how the candidate's existing skills relate to the missing skills they need to learn.

Existing Skills:
${candidateSkills.map(s => `- ${s.name} (${s.proficiencyLevel})`).join('\n')}

Missing Skills:
${missingSkills.map(s => `- ${s}`).join('\n')}

Rate the relationship between existing and missing skills on a scale of 0-1, where:
0 = No relationship (completely different domains)
1 = Strong relationship (highly transferable skills)

Return only the numerical score.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in skill analysis and learning pathways.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 10
      })

      const score = parseFloat(response.choices[0].message.content || '0.5')
      return isNaN(score) ? 0.5 : Math.min(1, Math.max(0, score))
    } catch (error) {
      console.error('Error calculating related skills bonus:', error)
      return 0.5
    }
  }

  private static async calculateExperienceMatch(
    jobExperience?: JobRequirements['experience'],
    candidateExperience?: CandidateProfile['experience']
  ): Promise<number> {
    if (!jobExperience || !candidateExperience) {
      return 0.5 // Neutral score if experience data is missing
    }

    const yearsMatch = Math.min(
      1,
      candidateExperience.relevantYears / Math.max(1, jobExperience.years)
    )

    return yearsMatch
  }

  private static async analyzeSkillGaps(
    job: JobRequirements,
    candidate: CandidateProfile
  ): Promise<MatchScore['gapAnalysis']> {
    try {
      const gaps = await SkillGapAnalyzer.analyzeSkillGap(
        candidate.skills,
        job.skills
      )

      return {
        missingSkills: gaps.gaps.map(gap => ({
          name: gap.missingSkill,
          importance: gap.importance,
          timeToAcquire: gap.timeToAcquire
        })),
        timeToReachIdeal: gaps.estimatedTimeToCompletion,
        suggestedLearningPath: gaps.recommendedOrder
      }
    } catch (error) {
      console.error('Error analyzing skill gaps:', error)
      return {
        missingSkills: [],
        timeToReachIdeal: 'Unknown',
        suggestedLearningPath: []
      }
    }
  }

  private static async generateMatchInsights(
    job: JobRequirements,
    candidate: CandidateProfile,
    scores: MatchScore['breakdown'],
    gaps: MatchScore['gapAnalysis']
  ): Promise<string[]> {
    try {
      const prompt = `Analyze this job match and provide key insights:
      Job Title: ${job.title}
      
      Match Scores:
      - Skill Match: ${(scores.skillMatch * 100).toFixed(1)}%
      - Proficiency Match: ${(scores.proficiencyMatch * 100).toFixed(1)}%
      - Market Alignment: ${(scores.marketAlignment * 100).toFixed(1)}%
      - Learning Potential: ${(scores.learningPotential * 100).toFixed(1)}%
      - Experience Match: ${(scores.experienceMatch * 100).toFixed(1)}%
      
      Skill Gaps:
      ${gaps.missingSkills.map(s => `- ${s.name} (${s.timeToAcquire} to learn)`).join('\n')}
      
      Provide 3-5 key insights about this match, focusing on:
      1. Overall match quality
      2. Key strengths
      3. Areas for improvement
      4. Development potential
      
      Format as a JSON array of strings.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor and job matching specialist.'
          },
          { role: 'user', content: prompt }
        ]
      })

      return JSON.parse(response.choices[0].message.content || '[]')
    } catch (error) {
      console.error('Error generating match insights:', error)
      return [
        'Unable to generate detailed insights due to an error.',
        'Please review the match scores and skill gaps manually.'
      ]
    }
  }
}
