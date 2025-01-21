'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Build your professional profile with skills, experience, and preferences.'
  },
  {
    number: '02',
    title: 'AI-Powered Matching',
    description: 'Our algorithms find the perfect matches based on your profile.'
  },
  {
    number: '03',
    title: 'Connect & Interview',
    description: 'Schedule interviews and communicate directly through the platform.'
  },
  {
    number: '04',
    title: 'Land Your Dream Role',
    description: 'Accept offers and start your new journey with confidence.'
  }
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-background/95 to-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-amber-500"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Your journey to the perfect job in four simple steps
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="text-6xl font-bold text-white/10 absolute -top-8 left-0">
                {step.number}
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 