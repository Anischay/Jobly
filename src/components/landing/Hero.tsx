'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Find Your Perfect Match
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          AI-Powered Recruitment Platform
        </motion.p>
        <motion.button
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Get Early Access
        </motion.button>
      </div>
    </motion.section>
  )
} 