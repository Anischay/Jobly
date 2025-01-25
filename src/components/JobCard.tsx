'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaMapMarkerAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaTasks,
  FaGraduationCap,
  FaUsers,
  FaTimes,
  FaCheck,
  FaStar,
  FaLaptopCode,
  FaArrowRight
} from 'react-icons/fa'

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
    }
    imageUrl?: string
  }
  featured?: boolean
  onSwipe: (direction: 'left' | 'right', reason?: string) => void
}

export const JobCard = ({ job, featured = false, onSwipe }: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'details' | 'company'>('overview')
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interestReason, setInterestReason] = useState('')

  const sections = [
    { id: 'overview', icon: FaBriefcase, label: 'Overview' },
    { id: 'details', icon: FaTasks, label: 'Details' },
    { id: 'company', icon: FaBuilding, label: 'Company' }
  ]

  const handleShowInterest = () => {
    if (interestReason.trim()) {
      onSwipe('right', interestReason)
      setShowInterestModal(false)
      setInterestReason('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      layout
      className={`relative p-6 rounded-xl border ${
        featured 
          ? 'bg-gradient-to-b from-purple-500/10 to-blue-500/10 border-purple-400/30' 
          : 'bg-gray-900/50 border-gray-800/50'
      } backdrop-blur-sm group cursor-pointer transform-gpu hover:shadow-2xl hover:shadow-purple-500/10`}
    >
      {featured && (
        <div className="absolute -top-3 -right-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          >
            Featured
          </motion.div>
        </div>
      )}

      <div className="flex items-start gap-4">
        {job.logo ? (
          <motion.img
            src={job.logo}
            alt={job.company}
            className="w-16 h-16 rounded-lg object-cover"
            whileHover={{ scale: 1.1 }}
          />
        ) : (
          <motion.div
            className="w-16 h-16 bg-purple-500/10 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <FaBuilding className="text-3xl text-purple-400" />
          </motion.div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <motion.h3 
                className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                {job.title}
              </motion.h3>
              <p className="text-purple-200/80">{job.company}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {job.rating && (
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white font-medium">{job.rating}</span>
                </div>
              )}
              {job.applicants && (
                <div className="flex items-center gap-1 text-sm text-purple-300">
                  <FaUsers className="text-purple-400" />
                  {job.applicants} applicants
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-purple-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <FaDollarSign className="text-purple-400" />
              {job.salary}
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-purple-400" />
              {job.type}
            </div>
            {job.experience && (
              <div className="flex items-center gap-1">
                <FaBriefcase className="text-purple-400" />
                {job.experience}
              </div>
            )}
            {job.teamSize && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-purple-400" />
                {job.teamSize}
              </div>
            )}
            {job.workStyle && (
              <div className="flex items-center gap-1">
                <FaLaptopCode className="text-purple-400" />
                {job.workStyle}
              </div>
            )}
          </div>

          {job.skills && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          )}

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          {job.requirements && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Key Requirements</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {job.requirements.slice(0, 2).map((req, index) => (
                  <li key={index} className="line-clamp-1">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.techStack && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {onSwipe && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => onSwipe('left')}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
              <button
                onClick={() => setShowInterestModal(true)}
                className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <FaCheck className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Why are you interested?</h3>
            <textarea
              value={interestReason}
              onChange={(e) => setInterestReason(e.target.value)}
              className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 mb-4"
              placeholder="Share why you're interested in this position..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowInterestModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleShowInterest}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                disabled={!interestReason.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
} 