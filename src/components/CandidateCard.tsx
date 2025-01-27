'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaGlobe, 
  FaChevronDown, 
  FaChevronUp, 
  FaPlay, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCertificate,
  FaCode,
  FaHeart,
  FaHandshake,
  FaLightbulb,
  FaCalendarAlt,
  FaChevronRight,
  FaTimes,
  FaCoffee,
  FaUtensils
} from 'react-icons/fa'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useEffect } from 'react'

export interface CandidateCardProps {
  id: string
  name: string
  title: string
  location: string
  imageUrl: string
  fallbackImageUrl?: string
  videoUrl?: string
  about: string
  experience: {
    role: string
    company: string
    duration: string
    description: string
    achievements: string[]
    technologies: string[]
    verified: boolean
  }[]
  skills: string[]
  projects: {
    id: string
    title: string
    description: string
    technologies: string[]
    imageUrl: string
    fallbackImageUrl?: string
    liveUrl: string
    verified: boolean
  }[]
  values: string[]
  githubStats?: {
    contributions: number
    repositories: number
    topLanguages: { name: string; percentage: number }[]
  }
  socialLinks?: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
  matchScore?: number
  onSwipe: (direction: 'left' | 'right' | 'up') => void
}

export const CandidateCard = ({
  id,
  name,
  title,
  location,
  imageUrl,
  fallbackImageUrl,
  videoUrl,
  about,
  experience,
  skills,
  projects,
  values,
  githubStats,
  socialLinks,
  matchScore,
  onSwipe
}: CandidateCardProps) => {
  const { trackInteraction, trackFeatureUsage } = useAnalytics()
  const startTime = useRef(Date.now())
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'about' | 'portfolio' | 'experience' | 'values'>('about')
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [projectImageErrors, setProjectImageErrors] = useState<{[key: string]: boolean}>({})
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteType, setInviteType] = useState<'coffee' | 'lunch'>('coffee')
  const [preferredTime, setPreferredTime] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [message, setMessage] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | 'up' | null>(null)
  const dragConstraintsRef = useRef(null)

  useEffect(() => {
    return () => {
      const timeSpent = (Date.now() - startTime.current) / 1000
      trackFeatureUsage({
        featureId: 'candidate_card_view',
        successRate: 100,
        timeSpent
      })
    }
  }, [trackFeatureUsage])

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    await trackInteraction({
      eventType: 'swipe',
      targetId: id,
      targetType: 'candidate',
      metadata: { 
        direction,
        ...(direction === 'up' && {
          inviteType,
          preferredTime,
          preferredLocation,
          message
        })
      }
    })

    await trackFeatureUsage({
      featureId: direction === 'up' ? 'candidate_invite' : 'candidate_swipe',
      successRate: 100,
      timeSpent: 0
    })

    if (direction === 'up') {
      setShowInviteModal(true)
    } else {
      onSwipe(direction)
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const xThreshold = 100
    const yThreshold = -100

    if (info.offset.y < yThreshold && Math.abs(info.offset.x) < Math.abs(info.offset.y)) {
      onSwipe('up')
    } else if (info.offset.x > xThreshold) {
      onSwipe('right')
    } else if (info.offset.x < -xThreshold) {
      onSwipe('left')
    }
    setDragDirection(null)
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const xOffset = info.offset.x
    const yOffset = info.offset.y

    if (Math.abs(yOffset) > Math.abs(xOffset) && yOffset < 0) {
      setDragDirection('up')
    } else if (Math.abs(xOffset) > Math.abs(yOffset)) {
      setDragDirection(xOffset > 0 ? 'right' : 'left')
    }
  }

  const sections = [
    { id: 'about', label: 'About Me', icon: FaHeart },
    { id: 'portfolio', label: 'Creative Work', icon: FaCode },
    { id: 'experience', label: 'Experience', icon: FaHandshake },
    { id: 'values', label: 'Values & Culture', icon: FaLightbulb }
  ]

  return (
    <motion.div 
      ref={dragConstraintsRef}
      className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden mx-auto relative"
      drag
      dragConstraints={dragConstraintsRef}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={{
        scale: dragDirection ? 0.95 : 1,
        rotate: dragDirection === 'left' ? -5 : dragDirection === 'right' ? 5 : 0,
        x: dragDirection === 'left' ? -50 : dragDirection === 'right' ? 50 : 0,
        y: dragDirection === 'up' ? -50 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Swipe Indicators */}
      <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-200 pointer-events-none
        ${dragDirection === 'left' ? 'from-red-500/20 opacity-100' : 'opacity-0'}
        ${dragDirection === 'right' ? 'from-green-500/20 opacity-100' : ''}
        ${dragDirection === 'up' ? 'from-purple-500/20 opacity-100' : ''}`}
      />

      {/* Header Section */}
      <div className={`relative ${isExpanded ? 'h-40' : 'h-56'} transition-all duration-300`}>
        <div className="absolute inset-0">
          <img 
            src={imageError ? fallbackImageUrl : imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          {videoUrl && !isExpanded && (
            <button
              onClick={() => setIsVideoVisible(true)}
              className="absolute bottom-4 right-4 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors group"
            >
              <FaPlay size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
          <div className="flex items-center gap-4">
            <p className="text-purple-400 font-medium">{title}</p>
            <div className="flex items-center text-gray-400">
              <FaMapMarkerAlt className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
          {matchScore && (
            <div className="mt-2 inline-flex items-center bg-purple-500/10 px-2 py-1 rounded-full">
              <span className="text-purple-400 font-semibold text-sm">{matchScore}% Match</span>
            </div>
          )}
        </div>
      </div>

      {!isExpanded ? (
        <>
          <div className="p-4">
            <p className="text-gray-300 leading-relaxed line-clamp-3">{about}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full text-sm">
                  +{skills.length - 4} more
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
            <div className="flex overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as typeof activeSection)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <section.icon className="text-lg" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-6">
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About Me</h3>
                  <p className="text-gray-300 leading-relaxed">{about}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
                    <div className="flex gap-4">
                      {socialLinks.github && (
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaGithub size={20} />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaLinkedin size={20} />
                        </a>
                      )}
                      {socialLinks.portfolio && (
                        <a
                          href={socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaGlobe size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'portfolio' && (
              <div className="space-y-6">
                {/* GitHub Stats */}
                {githubStats && (
                  <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaGithub className="text-2xl text-white" />
                      <h4 className="text-white font-medium">GitHub Activity</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Contributions</span>
                        <span className="text-purple-400 font-medium">{githubStats.contributions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Repositories</span>
                        <span className="text-purple-400 font-medium">{githubStats.repositories}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Top Languages</span>
                        </div>
                        {githubStats.topLanguages.map((lang, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">{lang.name}</span>
                              <span className="text-purple-400">{lang.percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${lang.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Featured Projects</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <div 
                        key={project.id}
                        className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700"
                      >
                        {project.imageUrl && (
                          <div className="relative h-48">
                            <img
                              src={projectImageErrors[project.id] ? project.fallbackImageUrl : project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={() => setProjectImageErrors(prev => ({ ...prev, [project.id]: true }))}
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h5 className="text-white font-medium mb-2">{project.title}</h5>
                          <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                            >
                              View Project <FaChevronRight size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 p-4"
                  >
                    <h4 className="text-white font-medium mb-1">{exp.role}</h4>
                    <p className="text-purple-400 text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-400 text-sm mb-3">{exp.duration}</p>
                    <p className="text-gray-300 text-sm mb-4">{exp.description}</p>
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-purple-400 mt-1">•</span>
                          <span className="text-gray-300">{achievement}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'values' && (
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 p-4"
                  >
                    <p className="text-gray-300">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <button
            onClick={() => handleSwipe('left')}
            className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg font-medium hover:bg-green-500/20 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative bg-gray-900 rounded-xl overflow-hidden max-w-3xl w-full aspect-video">
              <button
                onClick={() => setIsVideoVisible(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
              >
                <FaTimes size={24} />
              </button>
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative bg-gray-900 rounded-xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Invite {name} for a Meet</h3>
              <div className="space-y-4">
                {/* Invite Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setInviteType('coffee')}
                    className={`p-4 rounded-lg border ${
                      inviteType === 'coffee'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    } transition-colors`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaCoffee size={24} />
                      <span>Coffee Chat</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setInviteType('lunch')}
                    className={`p-4 rounded-lg border ${
                      inviteType === 'lunch'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    } transition-colors`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaUtensils size={24} />
                      <span>Lunch Meet</span>
                    </div>
                  </button>
                </div>

                {/* Time Preference */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a time...</option>
                    <option value="morning">Morning (9 AM - 11 AM)</option>
                    <option value="lunch">Lunch (12 PM - 2 PM)</option>
                    <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                  </select>
                </div>

                {/* Location Preference */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Preferred Location</label>
                  <input
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="Enter area or specific place"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    className="w-full h-24 px-4 py-2 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onSwipe('up')
                      setShowInviteModal(false)
                      setPreferredTime('')
                      setPreferredLocation('')
                      setMessage('')
                    }}
                    disabled={!preferredTime || !preferredLocation}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  )
} 