'use client'

import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'

interface CandidateCardProps {
  name: string
  title: string
  description: string
  experience: string
  skills: string[]
  matchScore?: number
  onClick?: () => void
  className?: string
}

export function CandidateCard({
  name,
  title,
  description,
  experience,
  skills,
  matchScore,
  onClick,
  className = ''
}: CandidateCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors text-left h-[280px] w-full ${className}`}
    >
      <div className="flex items-start gap-3 h-full">
        <div className="p-2.5 bg-purple-500/10 rounded-lg shrink-0">
          <FaUser className="text-purple-400 text-lg" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1.5">{name}</h3>
            <p className="text-gray-400 text-sm mb-3">{description}</p>
          </div>
          <div className="flex-1 bg-gray-800/50 rounded-lg p-3.5">
            <div className="space-y-2.5">
              <p className="text-sm text-white font-medium">{title}</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">{experience}</p>
              </div>
              <div className="space-y-2">
                {matchScore && (
                  <div className="bg-gray-900/50 px-2.5 py-1 rounded-lg inline-flex items-center text-xs">
                    <span className="text-purple-400 font-medium">{matchScore}%</span>
                    <span className="text-gray-400 ml-1">Match Score</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="px-1.5 py-0.5 bg-gray-900/50 text-gray-400 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
} 