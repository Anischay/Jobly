'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find Your Perfect Match
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AI-Powered Recruitment Platform
        </motion.p>
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Early Access
        </motion.button>
      </div>
    </main>
  )
}
