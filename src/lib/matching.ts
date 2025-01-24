import { Profile, Job, MatchScore } from '@/types'

// Skill weight factors
const SKILL_WEIGHTS = {
  EXACT_MATCH: 1.0,
  SIMILAR_MATCH: 0.7,
  RELATED_MATCH: 0.4
}

// Experience level mapping
const EXPERIENCE_LEVELS = {
  ENTRY: 0,
  JUNIOR: 2,
  MID: 4,
  SENIOR: 6,
  LEAD: 8,
  EXECUTIVE: 10
}

export function calculateSkillMatch(candidateSkills: string[], requiredSkills: string[]): number {
  let totalScore = 0
  let maxPossibleScore = requiredSkills.length

  for (const requiredSkill of requiredSkills) {
    // Check for exact match
    if (candidateSkills.includes(requiredSkill)) {
      totalScore += SKILL_WEIGHTS.EXACT_MATCH
      continue
    }

    // Check for similar matches (e.g., "React" vs "React.js")
    const similarMatch = candidateSkills.some(skill => 
      skill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
      requiredSkill.toLowerCase().includes(skill.toLowerCase())
    )
    if (similarMatch) {
      totalScore += SKILL_WEIGHTS.SIMILAR_MATCH
      continue
    }

    // Check for related skills (e.g., "Node.js" is related to "Express.js")
    const relatedMatch = isRelatedSkill(requiredSkill, candidateSkills)
    if (relatedMatch) {
      totalScore += SKILL_WEIGHTS.RELATED_MATCH
    }
  }

  return (totalScore / maxPossibleScore) * 100
}

export function calculateExperienceMatch(candidateYears: number, requiredYears: number): number {
  const diff = Math.abs(candidateYears - requiredYears)
  if (candidateYears >= requiredYears) {
    return 100 - (diff > 2 ? 10 : 0) // Small penalty for being significantly overqualified
  }
  return Math.max(0, 100 - (diff * 20)) // 20% penalty per year of missing experience
}

export function calculateCulturalFit(
  candidateValues: string[],
  companyValues: string[],
  candidateWorkStyle: string,
  requiredWorkStyle: string
): number {
  const valueMatch = calculateArraySimilarity(candidateValues, companyValues)
  const workStyleMatch = calculateWorkStyleCompatibility(candidateWorkStyle, requiredWorkStyle)
  
  return (valueMatch * 0.6) + (workStyleMatch * 0.4) // Values weighted 60%, work style 40%
}

export function calculateOverallMatch(scores: {
  skillMatch: number,
  experienceMatch: number,
  culturalFit: number,
  locationFit: number
}): number {
  return (
    (scores.skillMatch * 0.35) +      // Skills are 35% of total score
    (scores.experienceMatch * 0.25) +  // Experience is 25% of total score
    (scores.culturalFit * 0.25) +      // Cultural fit is 25% of total score
    (scores.locationFit * 0.15)        // Location preference is 15% of total score
  )
}

// Helper functions
function isRelatedSkill(skill: string, skillSet: string[]): boolean {
  const relatedSkillsMap: Record<string, string[]> = {
    'react': ['javascript', 'typescript', 'frontend', 'web development'],
    'node.js': ['javascript', 'express', 'backend', 'server'],
    'python': ['django', 'flask', 'data science', 'machine learning'],
    // Add more related skill mappings
  }

  const relatedSkills = relatedSkillsMap[skill.toLowerCase()] || []
  return skillSet.some(s => relatedSkills.includes(s.toLowerCase()))
}

function calculateArraySimilarity(arr1: string[], arr2: string[]): number {
  const intersection = arr1.filter(x => arr2.includes(x))
  const union = Array.from(new Set([...arr1, ...arr2]))
  return (intersection.length / union.length) * 100
}

function calculateWorkStyleCompatibility(style1: string, style2: string): number {
  const workStyleCompat: Record<string, Record<string, number>> = {
    'remote': { 'remote': 100, 'hybrid': 80, 'onsite': 60 },
    'hybrid': { 'remote': 80, 'hybrid': 100, 'onsite': 80 },
    'onsite': { 'remote': 60, 'hybrid': 80, 'onsite': 100 }
  }
  return workStyleCompat[style1]?.[style2] || 50
} 