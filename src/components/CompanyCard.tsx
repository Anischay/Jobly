'use client'

import { motion } from 'framer-motion'
import { FaBriefcase } from 'react-icons/fa'

interface CompanyCardProps {
  name: string
  title: string
  description: string
  location: string
  companySize: string
  activeJobs: number
  totalHires: number
  onClick?: () => void
  className?: string
}

export function CompanyCard({
  name,
  title,
  description,
  location,
  companySize,
  activeJobs,
  totalHires,
  onClick,
  className = ''
}: CompanyCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors text-left h-[280px] w-full ${className}`}
    >
      <div className="flex items-start gap-3 h-full">
        <div className="p-2.5 bg-purple-500/10 rounded-lg shrink-0">
          <FaBriefcase className="text-purple-400 text-lg" />
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
                <p className="text-xs text-gray-400">{location}</p>
                <p className="text-xs text-gray-400">{companySize} employees</p>
              </div>
              <div className="flex gap-2 text-xs">
                <div className="bg-gray-900/50 px-2.5 py-1 rounded-lg">
                  <span className="text-purple-400 font-medium">{activeJobs}</span>
                  <span className="text-gray-400 ml-1">Active Jobs</span>
                </div>
                <div className="bg-gray-900/50 px-2.5 py-1 rounded-lg">
                  <span className="text-purple-400 font-medium">{totalHires}</span>
                  <span className="text-gray-400 ml-1">Total Hires</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
} 