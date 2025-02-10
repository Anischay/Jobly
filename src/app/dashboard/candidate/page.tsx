'use client'

import { motion } from 'framer-motion'
import { 
  FaBriefcase, FaChartLine, FaLightbulb, FaBrain,
  FaAtom, FaNetworkWired, FaDna, FaArrowRight
} from 'react-icons/fa'

export default function CandidateDashboard() {
  // Mock data - This will be replaced with real quantum matching data
  const matchingStats = {
    matchScore: 92,
    potentialMatches: 156,
    appliedJobs: 12,
    viewedBy: 45,
    skillAlignment: 88,
    cultureFit: 94,
  }

  const quantumFeatures = [
    {
      title: 'Quantum State Analysis',
      description: 'Multi-dimensional skill vector analysis using quantum-inspired algorithms',
      icon: FaAtom,
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Neural Pattern Recognition',
      description: 'Advanced pattern matching using neural networks for job compatibility',
      icon: FaBrain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Quantum Entanglement Matching',
      description: 'Correlating multiple job parameters simultaneously for optimal matches',
      icon: FaNetworkWired,
      color: 'from-pink-500 to-red-500'
    },
    {
      title: 'Adaptive Learning System',
      description: 'Self-improving algorithm that learns from successful placements',
      icon: FaDna,
      color: 'from-red-500 to-orange-500'
    }
  ]

  const recentMatches = [
    {
      company: 'TechCorp',
      role: 'Senior Frontend Developer',
      matchScore: 95,
      salary: '$120k - $150k',
      location: 'San Francisco, CA',
    },
    {
      company: 'InnovateLabs',
      role: 'Full Stack Engineer',
      matchScore: 92,
      salary: '$100k - $130k',
      location: 'Remote',
    },
    {
      company: 'DataDynamics',
      role: 'React Developer',
      matchScore: 88,
      salary: '$90k - $120k',
      location: 'New York, NY',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Your quantum-powered job matching dashboard</p>
        </div>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          Update Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Quantum Match Score</h3>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <FaLightbulb className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold text-white">{matchingStats.matchScore}%</div>
            <div className="text-green-400 text-sm">+5% this week</div>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              style={{ width: `${matchingStats.matchScore}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Potential Matches</h3>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FaBriefcase className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold text-white">{matchingStats.potentialMatches}</div>
            <div className="text-green-400 text-sm">12 new today</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Profile Views</h3>
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold text-white">{matchingStats.viewedBy}</div>
            <div className="text-green-400 text-sm">+28% this week</div>
          </div>
        </motion.div>
      </div>

      {/* Quantum Features */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quantum-Powered Matching</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quantumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Matches */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Matches</h2>
        <div className="space-y-4">
          {recentMatches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-medium text-white">{match.role}</h3>
                <p className="text-gray-400">{match.company} • {match.location}</p>
                <p className="text-gray-500 text-sm mt-1">{match.salary}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{match.matchScore}%</div>
                  <div className="text-xs text-gray-400">Match</div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 