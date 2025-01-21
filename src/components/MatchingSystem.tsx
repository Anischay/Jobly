'use client'

import { motion } from 'framer-motion'
import { FaBrain, FaUserAstronaut, FaNetworkWired } from 'react-icons/fa'

const matchingSteps = [
  {
    icon: <FaUserAstronaut className="text-purple-400 text-3xl" />,
    title: "AI Profile Analysis",
    description: "Advanced AI analyzes your skills, experience, and personality traits to create a comprehensive digital profile."
  },
  {
    icon: <FaBrain className="text-purple-400 text-3xl" />,
    title: "Quantum-Inspired Matching",
    description: "Our neural network processes millions of data points using quantum-inspired algorithms to identify perfect career matches based on multiple dimensions."
  },
  {
    icon: <FaNetworkWired className="text-purple-400 text-3xl" />,
    title: "Cultural Alignment",
    description: "Quantum-inspired algorithms evaluate cultural fit and team dynamics for long-term success."
  }
]

export default function MatchingSystem() {
  return (
    <div className="relative py-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20" />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-12"
        >
          Quantum Matching Technology
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {matchingSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Card Background with consistent sizing */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-blue-500/10 rounded-2xl transform transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10 rounded-2xl" />
              
              {/* Card Content */}
              <div className="relative p-8 rounded-2xl border border-purple-400/20 h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-purple-200/80">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-colors">
            Experience the Demo
          </button>
        </motion.div>
      </div>
    </div>
  )
} 