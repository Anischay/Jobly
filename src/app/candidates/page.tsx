'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProfileCard from '@/components/ProfileCard'
import { MatchScoreCard } from '@/components/MatchScoreCard'
import { calculateSkillMatch, calculateExperienceMatch, calculateCulturalFit, calculateOverallMatch } from '@/lib/matching'
import { Profile, MatchScore } from '@/types'

// Sample job requirements for matching
const CURRENT_JOB = {
  requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  requiredExperience: 5,
  workStyle: 'hybrid',
  companyValues: ['innovation', 'teamwork', 'growth-mindset', 'user-focused']
}

// Enhanced sample profiles
const SAMPLE_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    bio: 'Passionate developer with 6+ years of experience building scalable web applications.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    videoUrl: '/videos/alex-intro.mp4',
    resumeUrl: '/resumes/alex_thompson_resume.pdf',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
    workStyle: 'hybrid',
    values: ['innovation', 'quality', 'teamwork', 'continuous-learning'],
    experience: [
      {
        id: 'exp1',
        role: 'Senior Developer',
        company: 'TechCorp',
        location: 'San Francisco',
        duration: '2020 - Present',
        description: 'Leading development of cloud-native applications',
        achievements: [
          'Led team of 5 developers',
          'Reduced deployment time by 50%',
          'Implemented microservices architecture'
        ],
        technologies: ['React', 'Node.js', 'AWS'],
        verified: true
      }
    ],
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'Stanford University',
        year: '2016',
        achievements: ['Graduated with Honors', 'Senior Project Award']
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce platform with real-time inventory.',
        technologies: ['React', 'Node.js', 'AWS'],
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/alexthompson/ecommerce',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
        verified: true
      }
    ],
    socialLinks: {
      github: 'https://github.com/alexthompson',
      linkedin: 'https://linkedin.com/in/alexthompson',
      portfolio: 'https://alexthompson.dev'
    }
  }
  // Add more profiles as needed
]

export default function CandidatesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [matchScores, setMatchScores] = useState<Record<string, MatchScore>>({})

  // Calculate match scores for all profiles
  const calculateMatchScores = (profile: Profile): MatchScore => {
    const skillMatch = calculateSkillMatch(profile.skills, CURRENT_JOB.requiredSkills)
    
    // Calculate years of experience (simplified)
    const yearsOfExperience = profile.experience.reduce((total, exp) => {
      const years = parseInt(exp.duration.split(' - ')[1] || new Date().getFullYear().toString()) - 
                   parseInt(exp.duration.split(' - ')[0])
      return total + years
    }, 0)
    
    const experienceMatch = calculateExperienceMatch(yearsOfExperience, CURRENT_JOB.requiredExperience)
    const culturalFit = calculateCulturalFit(profile.values, CURRENT_JOB.companyValues, profile.workStyle, CURRENT_JOB.workStyle)
    
    // Calculate location fit (simplified)
    const locationFit = profile.location.includes('San Francisco') ? 100 : 70 // Example logic

    const matchScore: MatchScore = {
      overall: 0,
      skillMatch,
      experienceMatch,
      culturalFit,
      locationFit,
      details: {
        matchedSkills: profile.skills.filter(skill => 
          CURRENT_JOB.requiredSkills.includes(skill)
        ),
        missingSkills: CURRENT_JOB.requiredSkills.filter(skill => 
          !profile.skills.includes(skill)
        ),
        strengthAreas: profile.experience[0]?.achievements || [],
        improvementAreas: []
      }
    }

    matchScore.overall = calculateOverallMatch(matchScore)
    return matchScore
  }

  // Calculate and cache match scores if not already calculated
  const getMatchScore = (profile: Profile): MatchScore => {
    if (!matchScores[profile.id]) {
      const scores = calculateMatchScores(profile)
      setMatchScores(prev => ({ ...prev, [profile.id]: scores }))
      return scores
    }
    return matchScores[profile.id]
  }

  const sortedProfiles = [...SAMPLE_PROFILES].sort((a, b) => {
    const scoreA = getMatchScore(a)
    const scoreB = getMatchScore(b)
    return scoreB.overall - scoreA.overall
  })

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < sortedProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Your Next Hire</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profiles Column */}
          <div className="lg:col-span-2">
            <div className="relative h-[600px]">
              {sortedProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    opacity: index === currentIndex ? 1 : 0,
                    pointerEvents: index === currentIndex ? 'auto' : 'none',
                    transform: `scale(${index === currentIndex ? 1 : 0.9})`,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <ProfileCard
                    {...profile}
                    onSwipe={handleSwipe}
                    onClick={() => handleProfileSelect(profile)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Match Score Column */}
          <div className="lg:col-span-1">
            {selectedProfile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MatchScoreCard 
                  score={getMatchScore(selectedProfile)}
                  className="sticky top-8"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 