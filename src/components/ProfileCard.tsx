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
  FaLightbulb
} from 'react-icons/fa'

export interface ProfileCardProps {
  id: string
  name: string
  title: string
  location: string
  imageUrl: string
  videoUrl?: string
  bio: string
  skills: string[]
  projects: {
    id: string
    title: string
    description: string
    technologies: string[]
    imageUrl: string
    liveUrl: string
    verified: boolean
  }[]
  certifications: {
    id: string
    name: string
    issuer: string
    date: string
    verified: boolean
  }[]
  experience: {
    id: string
    role: string
    company: string
    location: string
    duration: string
    description: string
    achievements: string[]
    technologies: string[]
    verified: boolean
  }[]
  education: {
    degree: string
    institution: string
    year: string
    achievements: string[]
  }[]
  resumeUrl?: string
  socialLinks: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
  onSwipe: (direction: 'left' | 'right', reason?: string) => void
}

export default function ProfileCard({
  name,
  title,
  location,
  imageUrl,
  videoUrl,
  bio,
  skills = [],
  projects = [],
  certifications = [],
  experience = [],
  education = [],
  resumeUrl,
  socialLinks = {},
  onSwipe
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'story' | 'portfolio' | 'experience' | 'culture'>('story')
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interestReason, setInterestReason] = useState('')
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'story', icon: FaHeart, label: 'About Me' },
    { id: 'portfolio', icon: FaLightbulb, label: 'Creative Work' },
    { id: 'experience', icon: FaBriefcase, label: 'Experience' },
    { id: 'culture', icon: FaHandshake, label: 'Values & Culture' }
  ]

  const handleShowInterest = () => {
    if (interestReason.trim()) {
      onSwipe('right', interestReason)
      setShowInterestModal(false)
      setInterestReason('')
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const yThreshold = 50 // minimum distance to trigger action
    
    if (isExpanded) {
      if (info.offset.y > yThreshold) {
        setIsExpanded(false)
      }
    } else {
      if (info.offset.y < -yThreshold) {
        setIsExpanded(true)
      }
    }

    setDragDirection(null)
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 0) {
      setDragDirection('down')
    } else if (info.offset.y < 0) {
      setDragDirection('up')
    }
  }

  return (
    <motion.div 
      ref={cardRef}
      layout
      drag={isExpanded ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden mx-auto transition-all duration-500 ease-in-out ${
        isExpanded 
          ? 'fixed inset-x-0 bottom-0 rounded-b-none md:relative md:rounded-xl md:w-full md:max-w-4xl' 
          : 'w-full max-w-md'
      }`}
      style={{
        height: isExpanded 
          ? 'calc(100vh - env(safe-area-inset-top))' 
          : '580px',
        maxHeight: isExpanded 
          ? '100vh' 
          : '580px',
        zIndex: isExpanded ? 50 : 1,
        y: dragDirection === 'down' ? 0 : dragDirection === 'up' ? 0 : undefined
      }}
    >
      {/* Drag Handle for Mobile */}
      {isExpanded && (
        <motion.div 
          className="md:hidden w-full flex justify-center p-2 cursor-grab active:cursor-grabbing"
          animate={{ opacity: dragDirection ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative h-full flex flex-col">
        {/* Header Section */}
        <div className={`relative ${isExpanded ? 'h-24' : 'h-56'} shrink-0 transition-all duration-500`}>
          <div className="absolute inset-0">
            <img 
              src={imageUrl} 
              alt={name} 
              className={`w-full h-full object-cover ${isExpanded ? 'object-top' : 'object-center'}`}
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
            <h2 className={`${isExpanded ? 'text-lg' : 'text-2xl'} font-bold text-white mb-1`}>{name}</h2>
            <div className="flex items-center gap-4">
              <p className="text-purple-400 font-medium text-sm">{title}</p>
              <div className="flex items-center text-gray-400 text-sm">
                <FaMapMarkerAlt className="mr-1" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-800 shrink-0">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id as typeof activeSection)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-6">
            {!isExpanded && (
              <>
                <div className="space-y-3 mb-4">
                  {experience[0] && (
                    <div className="flex items-start gap-2">
                      <FaBriefcase className="text-purple-400 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{experience[0].role}</p>
                        <p className="text-gray-400 text-sm truncate">{experience[0].company}</p>
                      </div>
                    </div>
                  )}
                  {education[0] && (
                    <div className="flex items-start gap-2">
                      <FaGraduationCap className="text-purple-400 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{education[0].degree}</p>
                        <p className="text-gray-400 text-sm truncate">{education[0].institution}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full text-sm">
                      +{skills.length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800"
              >
                {/* Content with Grid Layout */}
                <div className="p-4 md:p-6 overflow-y-auto" style={{ 
                  maxHeight: isExpanded 
                    ? 'calc(100vh - 32px - 48px - 80px)' // header height + navigation height + footer height
                    : undefined 
                }}>
                  <div className="space-y-6">
                    {activeSection === 'story' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">About Me</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">{bio}</p>
                        
                        {resumeUrl && (
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-white mb-3">Resume</h3>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <FaGraduationCap className="text-purple-400 text-xl" />
                                  </div>
                                  <div>
                                    <h4 className="text-white font-medium">Professional Resume</h4>
                                    <p className="text-gray-400 text-sm">PDF Format • Updated Recently</p>
                                  </div>
                                </div>
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                                >
                                  Download Resume
                                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <h3 className="text-xl font-semibold text-white mb-3">Skills & Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map(skill => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === 'portfolio' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Creative Work</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-max gap-4">
                          {/* GitHub Stats Card */}
                          <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <FaGithub className="text-2xl text-white" />
                              <h4 className="text-white font-medium">GitHub Activity</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Contributions</span>
                                <span className="text-purple-400 font-medium">1,234</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Repositories</span>
                                <span className="text-purple-400 font-medium">45</span>
                              </div>
                              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 w-3/4" />
                              </div>
                            </div>
                          </div>

                          {/* Skills Endorsement Card */}
                          <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <FaCertificate className="text-2xl text-white" />
                              <h4 className="text-white font-medium">Top Skills</h4>
                            </div>
                            <div className="space-y-3">
                              {skills.slice(0, 3).map(skill => (
                                <div key={skill} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-400">{skill}</span>
                                    <span className="text-purple-400 font-medium">95%</span>
                                  </div>
                                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400" 
                                      style={{ width: '95%' }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          {projects.map(project => (
                            <div
                              key={project.id}
                              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 col-span-full"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="aspect-video">
                                  <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-4 flex flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="text-white font-medium">{project.title}</h4>
                                      {project.verified && (
                                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {project.technologies.map(tech => (
                                        <span
                                          key={tech}
                                          className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                  >
                                    View Project
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === 'experience' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Experience</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {experience.map(exp => (
                            <div
                              key={exp.id}
                              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-white font-medium">{exp.role}</h4>
                                  <p className="text-purple-400">{exp.company}</p>
                                  <p className="text-gray-500 text-sm">{exp.duration}</p>
                                </div>
                                {exp.verified && (
                                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm mt-2">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === 'culture' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Values & Culture</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h4 className="text-white font-medium mb-2">Work Style</h4>
                            <p className="text-gray-300 text-sm">Collaborative, detail-oriented, and focused on delivering high-quality solutions.</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h4 className="text-white font-medium mb-2">Learning Approach</h4>
                            <p className="text-gray-300 text-sm">Continuous learner, always seeking to expand knowledge and skills.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Links - Always visible at the bottom of content */}
                    <div className="flex justify-center gap-6 mt-8 pb-4">
                      {socialLinks?.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          <FaLinkedin size={20} />
                        </a>
                      )}
                      {socialLinks?.github && (
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          <FaGithub size={20} />
                        </a>
                      )}
                      {socialLinks?.portfolio && (
                        <a
                          href={socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          <FaGlobe size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-4">
          {!isExpanded && (
            <div className="px-6 mb-3">
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-colors"
              >
                View Full Profile <FaChevronUp size={12} />
              </button>
            </div>
          )}

          <div className="p-6 pt-3">
            <div className="flex gap-3">
              <button
                onClick={() => onSwipe('left')}
                className="flex-1 py-2.5 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
              >
                Pass
              </button>
              <button
                onClick={() => setShowInterestModal(true)}
                className="flex-1 py-2.5 bg-green-500/10 text-green-400 rounded-lg font-medium hover:bg-green-500/20 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoVisible && videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video">
              <video
                src={videoUrl}
                autoPlay
                controls
                className="w-full h-full rounded-lg"
              />
              <button
                onClick={() => setIsVideoVisible(false)}
                className="absolute top-4 right-4 p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                placeholder="Share what caught your attention..."
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