'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-secondary/10">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Find Your Perfect Match
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          AI-Powered Recruitment Platform
        </motion.p>
        <motion.button
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Early Access
        </motion.button>
      </div>
    </section>
  )
} 