'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLightbulb, FaArrowRight } from 'react-icons/fa'

interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

interface Role {
  title: string
  description: string
  matchScore: number
  requiredSkills: string[]
  learningPath: string[]
}

interface RoleExplorerProps {
  currentSkills: Skill[]
  onRoleSelect: (role: Role) => void
}

// Sample alternative roles based on skills
const ALTERNATIVE_ROLES: Record<string, Role[]> = {
  'React': [
    {
      title: 'UI/UX Developer',
      description: 'Bridge the gap between design and development by creating beautiful, intuitive interfaces.',
      matchScore: 85,
      requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Design Tools'],
      learningPath: ['Learn Design Principles', 'Master Figma', 'Study User Psychology']
    },
    {
      title: 'Mobile App Developer',
      description: 'Apply your React knowledge to mobile development with React Native.',
      matchScore: 80,
      requiredSkills: ['React Native', 'Mobile UI Design', 'API Integration'],
      learningPath: ['Learn React Native', 'Mobile Design Patterns', 'App Store Deployment']
    }
  ],
  'Python': [
    {
      title: 'Data Scientist',
      description: 'Use your programming skills to analyze data and derive insights.',
      matchScore: 75,
      requiredSkills: ['Statistics', 'Machine Learning', 'Data Visualization'],
      learningPath: ['Learn Statistics', 'Master Python Libraries', 'Study ML Algorithms']
    },
    {
      title: 'DevOps Engineer',
      description: 'Leverage Python for automation and infrastructure management.',
      matchScore: 70,
      requiredSkills: ['Linux', 'Docker', 'CI/CD'],
      learningPath: ['Learn Linux', 'Master Docker', 'Study Cloud Platforms']
    }
  ]
}

export function RoleExplorer({ currentSkills, onRoleSelect }: RoleExplorerProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const getAlternativeRoles = () => {
    if (!selectedSkill) return []
    return ALTERNATIVE_ROLES[selectedSkill] || []
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaLightbulb className="text-yellow-500 text-2xl" />
        <h2 className="text-2xl font-bold">Explore New Career Paths</h2>
      </div>

      {/* Skills Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Select your strongest skill:</h3>
        <div className="flex flex-wrap gap-3">
          {currentSkills.map((skill) => (
            <motion.button
              key={skill.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSkill(skill.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSkill === skill.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill.name}
              <span className="ml-2 text-xs opacity-75">
                ({skill.level})
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Alternative Roles */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">
            Alternative Roles Based on {selectedSkill}:
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {getAlternativeRoles().map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer"
                onClick={() => onRoleSelect(role)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{role.title}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {role.matchScore}% Match
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium mb-1">Required Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {role.requiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowExplanation(true)
                    }}
                    className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-600"
                  >
                    View Learning Path
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Learning Path Modal */}
      {showExplanation && selectedSkill && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowExplanation(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Your Learning Path</h3>
            <div className="space-y-4">
              {getAlternativeRoles()[0]?.learningPath.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExplanation(false)}
              className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
} 