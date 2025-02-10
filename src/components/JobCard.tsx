'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  FaMapMarkerAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaTasks,
  FaUsers,
  FaTimes,
  FaCheck,
  FaStar,
  FaLaptopCode,
  FaHeart,
  FaCode,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaPlay,
  FaCertificate,
  FaHandshake,
  FaLightbulb
} from 'react-icons/fa'
import { useAnalytics } from '@/hooks/useAnalytics'

export interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    type: string
    salary: string
    description: string
    requirements?: string[]
    responsibilities?: string[]
    benefits?: string[]
    experience?: string
    logo?: string
    skills?: string[]
    postedAt?: string
    teamSize?: string
    techStack?: string[]
    workStyle?: string
    rating?: number
    applicants?: number
    companyInfo?: {
      name: string
      size: string
      industry: string
      description: string
      culture: string[]
      githubUrl?: string
      repoCount?: number
      techStack?: string[]
      achievements?: string[]
      verified?: boolean
    }
    imageUrl?: string
    fallbackImageUrl?: string
    videoUrl?: string
    employeeCount: string
    website?: string
    linkedIn?: string
  }
  featured?: boolean
  onSwipe: (direction: 'left' | 'right' | 'up', reason?: string) => void
}

export const JobCard = ({ job, featured = false, onSwipe }: JobCardProps) => {
  const { trackInteraction, trackFeatureUsage } = useAnalytics()
  const startTime = useRef(Date.now())
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'role' | 'company' | 'engineering' | 'benefits'>('role')
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interestReason, setInterestReason] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'role', icon: FaBriefcase, label: 'Role Details' },
    { id: 'company', icon: FaBuilding, label: 'About Company' },
    { id: 'engineering', icon: FaCode, label: 'Engineering' },
    { id: 'benefits', icon: FaHandshake, label: 'Perks & Benefits' }
  ]

  useEffect(() => {
    return () => {
      const timeSpent = (Date.now() - startTime.current) / 1000
      trackFeatureUsage({
        featureId: 'job_card_view',
        successRate: 100,
        timeSpent
      })
    }
  }, [trackFeatureUsage])

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    await trackInteraction({
      eventType: 'swipe',
      targetId: job.id,
      targetType: 'job',
      metadata: { direction }
    })

    await trackFeatureUsage({
      featureId: 'job_swipe',
      successRate: 100,
      timeSpent: 0
    })

    onSwipe(direction)
  }

  const handleShowInterest = () => {
    if (interestReason.trim()) {
      onSwipe('right', interestReason)
      setShowInterestModal(false)
      setInterestReason('')
    }
  }

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden mx-auto"
    >
      {/* Header Section */}
      <div className={`relative ${isExpanded ? 'h-40' : 'h-56'} transition-all duration-300`}>
        <div className="absolute inset-0">
          <img 
            src={job.imageUrl || '/company-placeholder.jpg'} 
            alt={job.company}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
          <div className="flex items-center gap-4">
            <p className="text-purple-400 font-medium">{job.company}</p>
            <div className="flex items-center text-gray-400">
              <FaMapMarkerAlt className="mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-purple-400" />
            <span className="text-gray-400">{job.employeeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-purple-400" />
            <span className="text-gray-400">{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-purple-400" />
            <span className="text-gray-400">{job.salary}</span>
          </div>
        </div>
      </div>

      {!isExpanded ? (
        <>
          <div className="p-4">
            <p className="text-gray-300 leading-relaxed line-clamp-3">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.techStack?.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
              {job.techStack && job.techStack.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full text-sm">
                  +{job.techStack.length - 4} more
                </span>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors"
            >
              View Full Profile <FaChevronDown size={12} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Navigation */}
          <div className="border-b border-gray-800">
            <div className="flex px-4">
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id as typeof activeSection)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeSection === id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-6">
            {activeSection === 'role' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About the Role</h3>
                  <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements?.map((req, index) => (
                      <li key={index} className="flex gap-2 text-gray-300">
                        <FaCheck className="text-purple-400 mt-1 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities?.map((resp, index) => (
                      <li key={index} className="flex gap-2 text-gray-300">
                        <FaCheck className="text-purple-400 mt-1 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <FaClock size={16} />
                      <span className="font-medium">Work Type</span>
                    </div>
                    <p className="text-gray-300">{job.type}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <FaDollarSign size={16} />
                      <span className="font-medium">Salary Range</span>
                    </div>
                    <p className="text-gray-300">{job.salary}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'company' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About {job.company}</h3>
                  <p className="text-gray-300 leading-relaxed">{job.companyInfo?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <FaBuilding size={16} />
                      <span className="font-medium">Company Size</span>
                    </div>
                    <p className="text-gray-300">{job.employeeCount} employees</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <FaUsers size={16} />
                      <span className="font-medium">Team Size</span>
                    </div>
                    <p className="text-gray-300">{job.teamSize}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {job.website && (
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                      <FaGlobe /> Company Website
                    </a>
                  )}
                  {job.linkedIn && (
                    <a
                      href={job.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                      <FaLinkedin /> LinkedIn Page
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'engineering' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.techStack?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {job.companyInfo?.githubUrl && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FaGithub className="text-purple-400" />
                        <h4 className="text-white font-medium">GitHub Organization</h4>
                      </div>
                      <span className="text-gray-400">{job.companyInfo.repoCount} repositories</span>
                    </div>
                    <a
                      href={job.companyInfo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      View Organization →
                    </a>
                  </div>
                )}

                {job.companyInfo?.achievements && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Engineering Achievements</h3>
                    <ul className="space-y-2">
                      {job.companyInfo.achievements.map((achievement, index) => (
                        <li key={index} className="flex gap-2 text-gray-300">
                          <FaStar className="text-purple-400 mt-1 shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'benefits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Benefits & Perks</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {job.benefits?.map((benefit, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex items-start gap-3">
                        <FaCheck className="text-purple-400 mt-1" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {job.companyInfo?.culture && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Company Culture</h3>
                    <div className="space-y-4">
                      {job.companyInfo.culture.map((value, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <p className="text-gray-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="w-full flex items-center justify-center gap-2 p-4 text-gray-400 hover:text-white transition-colors border-t border-gray-800"
          >
            <FaChevronUp size={16} />
          </button>
        </>
      )}

      {/* Footer Actions */}
      <div className="p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent border-t border-gray-800">
        <div className="flex gap-3">
          <button
            onClick={() => handleSwipe('left')}
            className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe('up')}
            className="flex-1 py-2 bg-purple-500/10 text-purple-400 rounded-lg font-medium hover:bg-purple-500/20 transition-colors"
          >
            Coffee Chat
          </button>
          <button
            onClick={() => setShowInterestModal(true)}
            className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg font-medium hover:bg-green-500/20 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Interest Modal */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative bg-gray-900 rounded-xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Why are you interested?</h3>
              <textarea
                value={interestReason}
                onChange={(e) => setInterestReason(e.target.value)}
                placeholder="Share what caught your attention about this role..."
                className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShowInterest}
                  disabled={!interestReason.trim()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Interest
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 