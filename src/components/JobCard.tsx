'use client'

import { motion } from 'framer-motion'
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaClock, FaBriefcase, FaArrowRight, FaGraduationCap, FaUsers, FaLaptopCode, FaStar } from 'react-icons/fa'

interface JobCardProps {
  job: {
    title: string
    company: string
    location: string
    salary: string
    type: string
    experience: string
    logo?: string
    skills: string[]
    postedAt: string
    description: string
    requirements?: string[]
    benefits?: string[]
    teamSize?: string
    techStack?: string[]
    workStyle?: string
    rating?: number
    applicants?: number
    culture?: {
      values: string[]
      perks: string[]
    }
  }
  featured?: boolean
}

export const JobCard = ({ job, featured = false }: JobCardProps) => {
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
            <div className="flex items-center gap-1">
              <FaBriefcase className="text-purple-400" />
              {job.experience}
            </div>
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

          {job.culture && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Company Culture</h4>
              <div className="flex flex-wrap gap-2">
                {job.culture.values.slice(0, 3).map((value, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded-full"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Posted {job.postedAt}
            </span>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
              <FaArrowRight className="text-xs" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 