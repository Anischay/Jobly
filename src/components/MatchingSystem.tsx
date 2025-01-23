'use client'

import { motion } from 'framer-motion'
import { FaUserTie, FaBriefcase, FaLightbulb, FaHandshake, FaArrowRight } from 'react-icons/fa'

const MatchingSystem = () => {
  const steps = [
    {
      icon: <FaUserTie className="text-2xl text-purple-400" />,
      title: "Create Your Profile",
      description: "Build your professional profile with skills, experience, and aspirations."
    },
    {
      icon: <FaBriefcase className="text-2xl text-purple-400" />,
      title: "AI-Powered Matching",
      description: "Our algorithm analyzes profiles to find the perfect matches."
    },
    {
      icon: <FaLightbulb className="text-2xl text-purple-400" />,
      title: "Smart Recommendations",
      description: "Receive personalized job or candidate recommendations."
    },
    {
      icon: <FaHandshake className="text-2xl text-purple-400" />,
      title: "Connect & Collaborate",
      description: "Engage directly with matches and schedule interviews."
    }
  ]

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0118] to-gray-900/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow min-h-[280px] flex flex-col relative z-10 border border-purple-400/20"
            >
              <div className="flex-1">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors"
                >
                  {step.icon}
                </motion.div>
                <motion.h3
                  whileHover={{ x: 5 }}
                  className="text-xl font-semibold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                >
                  {step.title}
                </motion.h3>
                <p className="text-purple-200/70 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-purple-400 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
              >
                Learn more
                <FaArrowRight className="text-xs" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MatchingSystem 