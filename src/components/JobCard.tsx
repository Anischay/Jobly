'use client'

import { motion, useAnimation, PanInfo } from 'framer-motion'
import { useState } from 'react'
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaChevronDown, FaChevronUp, FaBuilding, FaRegClock, FaCheck, FaTimes, FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa'

type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE'

interface CompanyProject {
  title: string
  description: string
  technologies: string[]
  impact?: string
}

interface CompanyCulture {
  values: string[]
  perks: string[]
  workStyle: string
  teamSize?: string
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  description: string
  requirements: string
  responsibilities: string[]
  salary?: string
  companyLogo?: string
  projects?: CompanyProject[]
  culture?: CompanyCulture
  benefits?: string[]
}

interface JobCardProps {
  job: Job
  onSwipe: (jobId: string, direction: 'LEFT' | 'RIGHT', reason?: string) => void
}

export function JobCard({ job, onSwipe }: JobCardProps) {
  const controls = useAnimation()
  const [exitX, setExitX] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'culture'>('overview')
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = async (_event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 150) {
      const direction = offset > 0 ? 'RIGHT' : 'LEFT'
      setExitX(direction === 'LEFT' ? -500 : 500)
      await controls.start({ x: direction === 'LEFT' ? -500 : 500 })
      onSwipe(job.id, direction)
    } else {
      controls.start({ x: 0 })
    }
    setIsDragging(false)
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      exit={{ x: exitX }}
      className={`w-full max-w-md cursor-grab active:cursor-grabbing mx-auto transition-all duration-500 ${expanded ? 'h-[85vh]' : 'h-[480px]'}`}
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group h-full">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-opacity group-hover:opacity-100 opacity-50" />

        <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-purple-400/20 overflow-hidden h-full flex flex-col">
          {/* Header Section */}
          <div className={`relative transition-all duration-500 ${expanded ? 'h-36' : 'h-48'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBuilding className="text-6xl text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
              <p className="text-lg text-purple-200/90">{job.company}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-purple-100/80">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-purple-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaRegClock className="text-purple-400" />
                  <span>{job.type.replace('_', ' ')}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-purple-400" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-purple-400/20">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeSection === 'overview'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-purple-200/60 hover:text-purple-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('projects')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeSection === 'projects'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-purple-200/60 hover:text-purple-200'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveSection('culture')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeSection === 'culture'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-purple-200/60 hover:text-purple-200'
              }`}
            >
              Culture
            </button>
          </div>

          {/* Content Section */}
          <motion.div
            className={`flex-1 overflow-hidden transition-all duration-500 ${
              expanded ? 'max-h-[calc(85vh-13rem)]' : 'max-h-[180px]'
            }`}
          >
            <div className="p-6">
              {activeSection === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                    <p className={`text-purple-100/80 ${expanded ? '' : 'line-clamp-3'}`}>{job.description}</p>
                  </div>
                  {expanded && (
                    <>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Key Responsibilities</h4>
                        <ul className="list-disc list-inside text-purple-100/80 space-y-1">
                          {job.responsibilities?.map((resp, index) => (
                            <li key={index}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Requirements</h4>
                        <p className="text-purple-100/80">{job.requirements}</p>
                      </div>
                      {job.benefits && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Benefits</h4>
                          <ul className="list-disc list-inside text-purple-100/80 space-y-1">
                            {job.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeSection === 'projects' && job.projects && (
                <div className="space-y-4">
                  {(expanded ? job.projects : job.projects.slice(0, 1)).map((project, index) => (
                    <div key={index} className="p-4 bg-purple-500/5 rounded-xl border border-purple-400/10">
                      <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
                      <p className={`text-purple-100/80 mb-3 ${expanded ? '' : 'line-clamp-2'}`}>{project.description}</p>
                      {expanded && project.impact && (
                        <p className="text-purple-200/90 mb-3">
                          <span className="font-medium">Impact:</span> {project.impact}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-purple-500/10 text-purple-200 rounded-full text-xs border border-purple-400/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!expanded && job.projects.length > 1 && (
                    <p className="text-purple-200/60 text-sm text-center mt-2">
                      +{job.projects.length - 1} more projects
                    </p>
                  )}
                </div>
              )}

              {activeSection === 'culture' && job.culture && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FaLightbulb className="text-purple-400 text-xl" />
                      <h4 className="text-lg font-semibold text-white">Company Values</h4>
                    </div>
                    <ul className="list-disc list-inside text-purple-100/80 space-y-1">
                      {(expanded ? job.culture.values : job.culture.values.slice(0, 2)).map((value, index) => (
                        <li key={index}>{value}</li>
                      ))}
                    </ul>
                    {!expanded && job.culture.values.length > 2 && (
                      <p className="text-purple-200/60 text-sm mt-1">
                        +{job.culture.values.length - 2} more values
                      </p>
                    )}
                  </div>
                  {expanded && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaHandshake className="text-purple-400 text-xl" />
                          <h4 className="text-lg font-semibold text-white">Perks & Benefits</h4>
                        </div>
                        <ul className="list-disc list-inside text-purple-100/80 space-y-1">
                          {job.culture.perks.map((perk, index) => (
                            <li key={index}>{perk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaUsers className="text-purple-400 text-xl" />
                          <h4 className="text-lg font-semibold text-white">Work Style</h4>
                        </div>
                        <p className="text-purple-100/80">{job.culture.workStyle}</p>
                        {job.culture.teamSize && (
                          <p className="text-purple-200/90 mt-2">
                            <span className="font-medium">Team Size:</span> {job.culture.teamSize}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-900/50 border-t border-purple-400/20">
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDragEnd(null, { offset: { x: -200 }, velocity: { x: -500 } } as PanInfo)}
                className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center text-xl"
              >
                <FaTimes />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpanded(!expanded)}
                className="px-6 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium border border-purple-400/30"
              >
                {expanded ? (
                  <>
                    <FaChevronUp className="inline-block mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown className="inline-block mr-2" />
                    Show More
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDragEnd(null, { offset: { x: 200 }, velocity: { x: 500 } } as PanInfo)}
                className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center text-xl"
              >
                <FaCheck />
              </motion.button>
            </div>
          </div>

          {/* Swipe Indicators */}
          {isDragging && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 text-4xl"
              >
                <FaTimes />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-4xl"
              >
                <FaCheck />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
} 