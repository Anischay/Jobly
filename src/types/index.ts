export interface Profile {
  id: string
  name: string
  title: string
  location: string
  bio: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  workStyle: 'remote' | 'hybrid' | 'onsite'
  values: string[]
  projects?: Project[]
  certifications?: Certification[]
  imageUrl?: string
  fallbackImageUrl?: string
  videoUrl?: string
  resumeUrl?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    portfolio?: string
    twitter?: string
    dribbble?: string
  }
  companyLinks?: {
    website?: string
    linkedin?: string
  }
  isCompanyProfile?: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requiredSkills: string[]
  requiredExperience: number
  workStyle: 'remote' | 'hybrid' | 'onsite'
  companyValues: string[]
  salary?: {
    min: number
    max: number
    currency: string
  }
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  duration: string
  description: string
  achievements: string[]
  technologies: string[]
  verified?: boolean
}

export interface Education {
  degree: string
  institution: string
  year: string
  achievements: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  fallbackImageUrl?: string
  liveUrl?: string
  verified?: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  achievements?: string[]
  verified?: boolean
}

export interface MatchScore {
  overall: number
  skillMatch: number
  experienceMatch: number
  culturalFit: number
  locationFit: number
  details?: {
    matchedSkills: string[]
    missingSkills: string[]
    strengthAreas: string[]
    improvementAreas: string[]
  }
} 
