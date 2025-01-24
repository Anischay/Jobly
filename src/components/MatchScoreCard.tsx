'use client'

import { motion } from 'framer-motion'
import { FaStar, FaCode, FaBriefcase, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'
import { MatchScore } from '@/types'

interface MatchScoreCardProps {
  score: MatchScore
  className?: string
}

export function MatchScoreCard({ score, className = '' }: MatchScoreCardProps) {
  const scoreCategories = [
    { 
      label: 'Skills Match', 
      value: score.skillMatch,
      icon: FaCode,
      color: 'from-blue-500 to-cyan-500',
      details: score.details?.matchedSkills.length ? 
        `Matched ${score.details.matchedSkills.length} required skills` : undefined
    },
    { 
      label: 'Experience', 
      value: score.experienceMatch,
      icon: FaBriefcase,
      color: 'from-purple-500 to-pink-500',
      details: score.details?.strengthAreas.length ?
        `Strong in ${score.details.strengthAreas.join(', ')}` : undefined
    },
    { 
      label: 'Cultural Fit', 
      value: score.culturalFit,
      icon: FaUsers,
      color: 'from-green-500 to-emerald-500',
      details: 'Based on values and work style'
    },
    { 
      label: 'Location', 
      value: score.locationFit,
      icon: FaMapMarkerAlt,
      color: 'from-orange-500 to-yellow-500'
    }
  ]

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 ${className}`}>
      {/* Overall Score */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="text-xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {Math.round(score.overall)}%
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Overall Match</h3>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar 
                key={star}
                className={`w-4 h-4 ${
                  star <= score.overall / 20 
                    ? 'text-yellow-500' 
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Score Categories */}
      <div className="space-y-4">
        {scoreCategories.map((category, index) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <category.icon className="text-gray-400" />
                <span className="text-sm text-gray-300">{category.label}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {Math.round(category.value)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.value}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${category.color}`}
              />
            </div>
            {category.details && (
              <p className="text-xs text-gray-400 mt-1">{category.details}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Improvement Areas */}
      {score.details?.improvementAreas.length ? (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Areas for Growth</h4>
          <ul className="space-y-1">
            {score.details.improvementAreas.map((area) => (
              <li key={area} className="text-sm text-gray-500">
                • {area}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
} 