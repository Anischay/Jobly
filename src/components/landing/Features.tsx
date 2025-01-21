'use client'

import { motion } from 'framer-motion'
import { RiAiLine, RiUserSearchLine, RiChatSmileLine, RiBarChartBoxLine } from 'react-icons/ri'

const features = [
  {
    icon: RiAiLine,
    title: 'AI-Powered Matching',
    description: 'Advanced algorithms that understand skills, experience, and cultural fit.'
  },
  {
    icon: RiUserSearchLine,
    title: 'Smart Profiles',
    description: 'Rich, dynamic profiles that showcase your true potential.'
  },
  {
    icon: RiChatSmileLine,
    title: 'Seamless Communication',
    description: 'Built-in chat, video calls, and interview scheduling.'
  },
  {
    icon: RiBarChartBoxLine,
    title: 'Analytics Dashboard',
    description: 'Detailed insights into your recruitment process and matches.'
  }
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            variants={itemVariants}
          >
            Why Choose Jobly?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our platform combines cutting-edge technology with human-centered design
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 