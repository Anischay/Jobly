'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBriefcase, FaSearch, FaExchangeAlt } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'
import { ProfileCard } from '@/components/ProfileCard'
import { CulturalMatch } from '@/components/CulturalMatch'
import { RoleExplorer } from '@/components/RoleExplorer'

type ViewMode = 'recruiter' | 'jobSeeker'

export default function DemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('jobSeeker')
  const [showCulturalMatch, setShowCulturalMatch] = useState(false)
  const [showRoleExplorer, setShowRoleExplorer] = useState(false)

  const handleSwitch = () => {
    setViewMode(prev => prev === 'recruiter' ? 'jobSeeker' : 'recruiter')
  }

  const handleSwipe = (id: string, direction: 'LEFT' | 'RIGHT', reason?: string) => {
    console.log(`Swiped ${direction} on ${id}${reason ? ` with reason: ${reason}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Demo Mode</h1>
            <button
              onClick={handleSwitch}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaExchangeAlt />
              Switch View
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Indicator */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-8">
          {viewMode === 'recruiter' ? (
            <>
              <FaBriefcase className="text-blue-500" />
              Recruiter View
            </>
          ) : (
            <>
              <FaSearch className="text-blue-500" />
              Job Seeker View
            </>
          )}
        </div>

        {/* Feature Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCulturalMatch(true)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            Take Cultural Match Quiz
          </button>
          <button
            onClick={() => setShowRoleExplorer(true)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            Explore Career Paths
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {viewMode === 'recruiter' ? (
              <motion.div
                key="recruiter"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative h-[600px]"
              >
                <ProfileCard
                  profile={{
                    id: '1',
                    name: 'Alex Thompson',
                    title: 'Senior Full Stack Developer',
                    bio: 'Passionate developer with 6+ years of experience building scalable web applications.',
                    location: 'San Francisco, CA',
                    videoUrl: '/videos/alex-intro.mp4',
                    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
                    resumeUrl: '/resumes/alex_thompson_resume.pdf',
                    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
                    projects: [],
                    experience: [
                      {
                        title: 'Senior Developer',
                        company: 'TechCorp',
                        duration: '2020-Present',
                        description: 'Leading development team'
                      }
                    ],
                    education: 'BS Computer Science, Stanford',
                    links: {
                      github: 'https://github.com',
                      linkedin: 'https://linkedin.com'
                    }
                  }}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            ) : (
              <motion.div
                key="jobSeeker"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative h-[600px]"
              >
                <JobCard
                  job={{
                    id: '1',
                    title: 'Senior Full Stack Developer',
                    company: 'TechCorp Inc.',
                    location: 'San Francisco, CA',
                    type: 'FULL_TIME',
                    description: 'We are looking for a senior developer to join our team and help build scalable applications.',
                    requirements: 'Experience with React, Node.js, and cloud platforms.',
                    salary: '$150k - $200k',
                    companyLogo: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop'
                  }}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feature Modals */}
      {showCulturalMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CulturalMatch
              onComplete={(results) => {
                console.log('Cultural match results:', results)
                setShowCulturalMatch(false)
              }}
            />
          </div>
        </div>
      )}

      {showRoleExplorer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RoleExplorer
              currentSkills={[
                { name: 'React', level: 'advanced' },
                { name: 'Python', level: 'intermediate' },
                { name: 'AWS', level: 'beginner' }
              ]}
              onRoleSelect={(role) => {
                console.log('Selected role:', role)
                setShowRoleExplorer(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 