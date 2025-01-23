'use client'

import { motion } from 'framer-motion'
import { FaUserCircle, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaStar, FaArrowRight } from 'react-icons/fa'

interface CandidateCardProps {
  candidate: {
    name: string
    title: string
    location: string
    experience: string
    education: string
    avatar?: string
    skills: string[]
    rating?: number
    availability?: string
    bio?: string
    achievements?: string[]
  }
  featured?: boolean
}

export const CandidateCard = ({ candidate, featured = false }: CandidateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
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
        {candidate.avatar ? (
          <motion.img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover"
            whileHover={{ scale: 1.1 }}
          />
        ) : (
          <motion.div
            className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <FaUserCircle className="text-4xl text-purple-400" />
          </motion.div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <motion.h3 
                className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                {candidate.name}
              </motion.h3>
              <p className="text-purple-200/80">{candidate.title}</p>
            </div>
            
            {candidate.rating && (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-medium">{candidate.rating}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-purple-400" />
              {candidate.location}
            </div>
            <div className="flex items-center gap-1">
              <FaBriefcase className="text-purple-400" />
              {candidate.experience}
            </div>
            <div className="flex items-center gap-1">
              <FaGraduationCap className="text-purple-400" />
              {candidate.education}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {candidate.skills.map((skill, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {candidate.bio && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {candidate.bio}
            </p>
          )}

          {candidate.achievements && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Key Achievements</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {candidate.achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="line-clamp-1">{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            {candidate.availability && (
              <span className="text-sm text-emerald-400">
                Available {candidate.availability}
              </span>
            )}
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Profile
              <FaArrowRight className="text-xs" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 