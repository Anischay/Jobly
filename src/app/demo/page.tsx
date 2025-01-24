'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaBriefcase, FaSearch, FaArrowLeft } from 'react-icons/fa'

export default function DemoPage() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleRoleSelect = (role: 'recruiter' | 'jobseeker') => {
    const path = role === 'recruiter' ? '/demo/candidates' : '/demo/jobs'
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              Back to Home
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Demo Mode
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Choose Your Perspective
          </h1>
          <p className="text-gray-400">
            Experience Jobly from different viewpoints. Select a role to explore the platform's features and functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleSelect('recruiter')}
            className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all"
          >
            <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <FaBriefcase className="text-3xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Recruiter View</h2>
            <p className="text-gray-400 text-sm">
              Browse candidate profiles, evaluate talent, and find your next team member
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['AI Matching', 'Smart Filters', 'Quick Connect'].map((feature) => (
                <span key={feature} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleSelect('jobseeker')}
            className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all"
          >
            <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Job Seeker View</h2>
            <p className="text-gray-400 text-sm">
              Discover opportunities, explore companies, and find your dream role
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Smart Matching', 'Company Insights', 'Quick Apply'].map((feature) => (
                <span key={feature} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  )
} 