'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUserTie, FaBriefcase, FaLightbulb, FaHandshake, FaArrowRight } from 'react-icons/fa'
import { LearnMoreModal } from './LearnMoreModal'

const MatchingSystem = () => {
  const [activeModal, setActiveModal] = useState<number | null>(null)

  const steps = [
    {
      icon: <FaUserTie className="text-2xl text-purple-400" />,
      title: "Create Your Profile",
      description: "Build your professional profile with skills, experience, and aspirations.",
      content: {
        sections: [
          {
            title: "Rich Profile Creation",
            description: "Create a comprehensive professional profile that stands out.",
            items: [
              "Add detailed work experience and achievements",
              "Showcase technical skills with proficiency levels",
              "Upload portfolio projects with live demos",
              "Include video introductions for personal touch",
              "Link GitHub and LinkedIn profiles for verification"
            ]
          },
          {
            title: "Skill Assessment",
            description: "Validate your expertise through our comprehensive assessment system.",
            items: [
              "Take skill-specific technical assessments",
              "Get verified skill badges",
              "Complete coding challenges",
              "Display GitHub contributions",
              "Receive peer endorsements"
            ]
          }
        ]
      }
    },
    {
      icon: <FaBriefcase className="text-2xl text-purple-400" />,
      title: "AI-Powered Matching",
      description: "Our algorithm analyzes profiles to find the perfect matches.",
      content: {
        sections: [
          {
            title: "Smart Matching Algorithm",
            description: "Our AI goes beyond traditional keyword matching.",
            items: [
              "Deep learning-based skill analysis",
              "Experience level compatibility check",
              "Project history evaluation",
              "Cultural fit assessment",
              "Work style preference matching"
            ]
          },
          {
            title: "Real-time Updates",
            description: "Stay informed with instant match notifications.",
            items: [
              "Instant match alerts",
              "Match strength indicators",
              "Compatibility scores",
              "Match quality feedback",
              "Personalized recommendations"
            ]
          }
        ]
      }
    },
    {
      icon: <FaLightbulb className="text-2xl text-purple-400" />,
      title: "Smart Recommendations",
      description: "Receive personalized job or candidate recommendations.",
      content: {
        sections: [
          {
            title: "Intelligent Recommendations",
            description: "Get curated matches based on multiple factors.",
            items: [
              "Skill-based job suggestions",
              "Company culture alignment",
              "Career growth potential",
              "Location and work style preferences",
              "Salary range matching"
            ]
          },
          {
            title: "Learning Opportunities",
            description: "Discover paths to enhance your profile.",
            items: [
              "Skill gap analysis",
              "Learning resource recommendations",
              "Career path suggestions",
              "Industry trend insights",
              "Certification recommendations"
            ]
          }
        ]
      }
    },
    {
      icon: <FaHandshake className="text-2xl text-purple-400" />,
      title: "Connect & Collaborate",
      description: "Engage directly with matches and schedule interviews.",
      content: {
        sections: [
          {
            title: "Seamless Communication",
            description: "Connect effortlessly with your matches.",
            items: [
              "In-app messaging system",
              "Video interview platform",
              "Calendar integration",
              "Coffee/lunch meeting scheduling",
              "Document sharing"
            ]
          },
          {
            title: "Progress Tracking",
            description: "Monitor your connections and interviews.",
            items: [
              "Application status tracking",
              "Interview pipeline view",
              "Follow-up reminders",
              "Meeting history",
              "Feedback collection"
            ]
          }
        ]
      }
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
          className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Revolutionizing Job Search
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Experience a new way of connecting talent with opportunities
        </motion.p>

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
              <motion.button
                onClick={() => setActiveModal(index)}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-purple-400 font-medium mt-4 group-hover:opacity-100 transition-opacity text-sm"
              >
                Learn more
                <FaArrowRight className="text-xs" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learn More Modal */}
      {activeModal !== null && (
        <LearnMoreModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={steps[activeModal].title}
          content={steps[activeModal].content}
        />
      )}
    </section>
  )
}

export default MatchingSystem 