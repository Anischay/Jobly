import { Profile as PrismaProfile, JobListing as PrismaJobListing } from '@prisma/client'

// Types for job and profile data
interface Job extends PrismaJobListing {
  requiredSkills?: string[]
  culturalValues?: string[]
  benefits?: string[]
  requiredExperience?: string
  workStyle?: string
}

interface Profile extends PrismaProfile {
  preferredWorkStyle?: string
}

export interface MatchScore {
  overallScore: number
  skillMatch: number
  experienceMatch: number
  cultureFit: number
  matchedSkills: string[]
  missingSkills: string[]
  locationMatch: boolean
  workStyleMatch: boolean
}

export class MatchingService {
  async calculateMatchScore(profile: Profile, job: Job): Promise<MatchScore> {
    // Parse string arrays
    const profileSkills = JSON.parse(profile.skills || '[]') as string[]
    const jobSkills = JSON.parse(job.requirements || '[]') as string[]
    
    // Calculate skill match
    const matchedSkills = jobSkills.filter(skill => 
      profileSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    )
    
    const missingSkills = jobSkills.filter(skill =>
      !profileSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    )
    
    const skillMatch = jobSkills.length > 0 
      ? (matchedSkills.length / jobSkills.length) * 100
      : 100

    // Calculate experience match (convert string to number)
    const profileExp = parseInt(profile.experience || '0', 10)
    const jobExp = parseInt(job.requirements || '0', 10)
    const experienceMatch = profileExp >= jobExp
      ? 100
      : (profileExp / jobExp) * 100

    // Calculate location and work style match
    const locationMatch = profile.location?.toLowerCase() === job.location?.toLowerCase()
    const workStyleMatch = profile.preferredWorkStyle === job.type

    // Calculate culture fit (simplified version)
    const cultureFit = ((locationMatch ? 1 : 0.5) + (workStyleMatch ? 1 : 0.5)) * 50

    // Calculate overall score with weighted components
    const overallScore = Math.round(
      (skillMatch * 0.4) +
      (experienceMatch * 0.3) +
      (cultureFit * 0.3)
    )

    return {
      overallScore,
      skillMatch: Math.round(skillMatch),
      experienceMatch: Math.round(experienceMatch),
      cultureFit: Math.round(cultureFit),
      matchedSkills,
      missingSkills,
      locationMatch,
      workStyleMatch
    }
  }

  // Get job recommendations for a candidate
  async getJobRecommendations(profile: Profile, jobs: Job[]): Promise<Array<Job & { matchScore: MatchScore }>> {
    const matches = await Promise.all(
      jobs.map(async job => ({
        ...job,
        matchScore: await this.calculateMatchScore(profile, job)
      }))
    )

    // Sort by match score and return top matches
    return matches
      .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore)
      .filter(match => match.matchScore.overallScore > 0.3) // Only return reasonable matches
  }
}

export function calculateMatchScore(job: Job, profile: Profile): number {
  try {
    // Parse string arrays
    const profileSkills = JSON.parse(profile.skills || '[]') as string[]
    const jobSkills = JSON.parse(job.requirements || '[]') as string[]

    // Calculate skill match
    const matchedSkills = jobSkills.filter(skill => 
      profileSkills.some(profileSkill => 
        profileSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    const skillMatchScore = jobSkills.length ? (matchedSkills.length / jobSkills.length) * 100 : 0

    // Calculate overall match score
    return Math.round(skillMatchScore)
  } catch (error) {
    console.error('Error calculating match score:', error)
    return 0
  }
} 
