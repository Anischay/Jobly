'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Job } from '@/types'
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaClock, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaCheck,
  FaStar,
  FaKeyboard
} from 'react-icons/fa'
import Link from 'next/link'
import { calculateSkillMatch, calculateExperienceMatch, calculateCulturalFit, calculateOverallMatch } from '@/lib/matching'

// Mock user profile for matching (will be replaced with actual user data)
const USER_PROFILE = {
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
  experience: 4,
  workStyle: 'hybrid',
  values: ['innovation', 'teamwork', 'growth-mindset']
}

// Sample jobs data (will be replaced with API call)
const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for a senior developer to join our team...',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    requiredExperience: 5,
    workStyle: 'hybrid',
    companyValues: ['innovation', 'teamwork', 'growth-mindset'],
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    }
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignLab',
    location: 'Remote',
    description: 'Join our design team to create beautiful user experiences...',
    requiredSkills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
    requiredExperience: 3,
    workStyle: 'remote',
    companyValues: ['creativity', 'user-focused', 'innovation'],
    salary: {
      min: 90000,
      max: 140000,
      currency: 'USD'
    }
  }
]

const WORK_STYLES = ['All', 'Remote', 'Hybrid', 'Onsite']
const EXPERIENCE_LEVELS = ['All', '0-2 years', '3-5 years', '5+ years']

export default function JobsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedWorkStyle, setSelectedWorkStyle] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [showKeyboardHints, setShowKeyboardHints] = useState(false)

  const filteredJobs = SAMPLE_JOBS.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesWorkStyle = 
      selectedWorkStyle === 'All' || 
      job.workStyle === selectedWorkStyle.toLowerCase()

    const matchesExperience = selectedExperience === 'All' || (
      selectedExperience === '0-2 years' && job.requiredExperience <= 2 ||
      selectedExperience === '3-5 years' && job.requiredExperience > 2 && job.requiredExperience <= 5 ||
      selectedExperience === '5+ years' && job.requiredExperience > 5
    )

    return matchesSearch && matchesWorkStyle && matchesExperience
  })

  const calculateMatchScore = (job: Job) => {
    const skillMatch = calculateSkillMatch(USER_PROFILE.skills, job.requiredSkills)
    const experienceMatch = calculateExperienceMatch(USER_PROFILE.experience, job.requiredExperience)
    const culturalFit = calculateCulturalFit(USER_PROFILE.values, job.companyValues, USER_PROFILE.workStyle, job.workStyle)
    
    return {
      overall: calculateOverallMatch({ skillMatch, experienceMatch, culturalFit, locationFit: 100 }),
      skillMatch,
      experienceMatch,
      culturalFit
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentIndex >= filteredJobs.length) return

      switch (e.key) {
        case 'ArrowLeft':
          handleAction('skip')
          vibrate('short')
          break
        case 'ArrowRight':
          handleAction('connect')
          vibrate('short')
          break
        case 'h':
        case '?':
          setShowKeyboardHints(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, filteredJobs.length])

  // Haptic feedback function
  const vibrate = (pattern: 'short' | 'long' | 'error') => {
    if (!window.navigator.vibrate) return

    switch (pattern) {
      case 'short':
        window.navigator.vibrate(50)
        break
      case 'long':
        window.navigator.vibrate(100)
        break
      case 'error':
        window.navigator.vibrate([50, 30, 50])
        break
    }
  }

  const handleAction = (action: 'skip' | 'connect') => {
    const job = filteredJobs[currentIndex]
    console.log(`${action} job:`, job)
    
    // Animate card exit
    if (cardRef.current) {
      const exitX = action === 'skip' ? -400 : 400
      cardRef.current.style.transform = `translateX(${exitX}px) rotate(${exitX * 0.1}deg)`
      cardRef.current.style.transition = 'transform 0.5s'
    }

    // Haptic feedback
    vibrate(action === 'connect' ? 'long' : 'short')

    // Delay index update for animation
    setTimeout(() => setCurrentIndex(prev => prev + 1), 500)
  }

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragStart({ x: info.point.x, y: info.point.y })
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const deltaX = info.point.x - dragStart.x
    const deltaY = info.point.y - dragStart.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 100) {
        handleAction(deltaX > 0 ? 'connect' : 'skip')
      } else {
        // Not enough drag distance - vibrate error
        vibrate('error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Find Your Next Job</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowKeyboardHints(!showKeyboardHints)}
              className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 flex items-center gap-2"
              title="Show keyboard shortcuts"
            >
              <FaKeyboard />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 flex items-center gap-2"
            >
              <FaFilter />
              Filters
            </button>
            <Link
              href="/jobs/saved"
              className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600"
            >
              Saved Jobs
            </Link>
            <Link
              href="/jobs/create"
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>

        {/* Keyboard Shortcuts Modal */}
        <AnimatePresence>
          {showKeyboardHints && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setShowKeyboardHints(false)}
            >
              <motion.div
                className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Skip Job</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">←</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Connect with Job</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">→</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Show/Hide Keyboard Shortcuts</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">H</kbd>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0 }}
          className="overflow-hidden mb-8"
        >
          <div className="space-y-4 py-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, company, or keywords"
                className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Work Style Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Work Style</h3>
              <div className="flex flex-wrap gap-2">
                {WORK_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedWorkStyle(style)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedWorkStyle === style
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Experience Level</h3>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedExperience(level)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedExperience === level
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card Stack */}
        <div className="relative h-[600px] max-w-2xl mx-auto">
          <AnimatePresence>
            {currentIndex < filteredJobs.length ? (
              filteredJobs.slice(currentIndex).map((job, index) => {
                const matchScore = calculateMatchScore(job)
                
                return (
                  <motion.div
                    key={job.id}
                    ref={index === 0 ? cardRef : null}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ 
                      scale: 1 - index * 0.05,
                      opacity: 1 - index * 0.2,
                      y: -index * 10
                    }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    drag={index === 0}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{ 
                      zIndex: filteredJobs.length - index,
                      cursor: index === 0 ? 'grab' : 'default'
                    }}
                    className="absolute inset-0"
                  >
                    <div className="bg-gray-800 rounded-xl p-8 h-full">
                      <div className="h-full flex flex-col">
                        {/* Match Score */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">
                          <FaStar />
                          <span className="font-medium">{Math.round(matchScore.overall)}% Match</span>
                        </div>

                        {/* Job Header */}
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                          <div className="flex flex-wrap items-center gap-4 text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaBriefcase className="text-purple-400" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-purple-400" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-purple-400" />
                              {job.workStyle.charAt(0).toUpperCase() + job.workStyle.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">Match Details</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">
                                {Math.round(matchScore.skillMatch)}%
                              </div>
                              <div className="text-sm text-gray-400">Skills</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">
                                {Math.round(matchScore.experienceMatch)}%
                              </div>
                              <div className="text-sm text-gray-400">Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">
                                {Math.round(matchScore.culturalFit)}%
                              </div>
                              <div className="text-sm text-gray-400">Culture Fit</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {job.requiredSkills.map(skill => (
                                <span
                                  key={skill}
                                  className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-300">{job.description}</p>
                          </div>

                          {job.salary && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
                              <p className="text-purple-400 font-medium">
                                ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} / year
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Swipe Hint */}
                        {index === 0 && (
                          <div className="text-center text-sm text-gray-400 mb-4">
                            ← Swipe left to skip • Swipe right to connect →
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-auto">
                          <button
                            onClick={() => handleAction('skip')}
                            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <FaTimes className="text-2xl" />
                          </button>
                          <button
                            onClick={() => handleAction('connect')}
                            className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                          >
                            <FaCheck className="text-2xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-xl mb-4">No more jobs to show</p>
                  <button
                    onClick={() => setCurrentIndex(0)}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="mt-8 text-center text-gray-400">
          {currentIndex < filteredJobs.length ? (
            <p>{filteredJobs.length - currentIndex} jobs remaining</p>
          ) : null}
        </div>
      </div>
    </div>
  )
} 