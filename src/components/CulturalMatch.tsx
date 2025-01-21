'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaHeart, FaLightbulb, FaUsers, FaChartLine } from 'react-icons/fa'

interface Question {
  id: string
  text: string
  category: 'values' | 'workStyle' | 'goals'
  options: {
    text: string
    score: number
  }[]
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'How do you prefer to work on projects?',
    category: 'workStyle',
    options: [
      { text: 'Independently with clear goals', score: 1 },
      { text: 'In a collaborative team environment', score: 2 },
      { text: 'Mix of both, depending on the task', score: 3 },
      { text: 'Leading and delegating to others', score: 4 }
    ]
  },
  {
    id: '2',
    text: 'What motivates you most at work?',
    category: 'values',
    options: [
      { text: 'Learning and growth opportunities', score: 1 },
      { text: 'Recognition and rewards', score: 2 },
      { text: 'Making a positive impact', score: 3 },
      { text: 'Building innovative solutions', score: 4 }
    ]
  },
  {
    id: '3',
    text: 'Where do you see yourself in 5 years?',
    category: 'goals',
    options: [
      { text: 'Leading a team or department', score: 1 },
      { text: 'Starting my own venture', score: 2 },
      { text: 'Becoming a subject matter expert', score: 3 },
      { text: 'Contributing to major industry changes', score: 4 }
    ]
  }
]

interface CulturalMatchProps {
  onComplete: (results: {
    values: number
    workStyle: number
    goals: number
    overall: number
  }) => void
}

export function CulturalMatch({ onComplete }: CulturalMatchProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (score: number) => {
    const newAnswers = {
      ...answers,
      [SAMPLE_QUESTIONS[currentQuestion].id]: score
    }
    setAnswers(newAnswers)

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate results
      const results = {
        values: 0,
        workStyle: 0,
        goals: 0,
        overall: 0
      }

      Object.entries(newAnswers).forEach(([questionId, score]) => {
        const question = SAMPLE_QUESTIONS.find(q => q.id === questionId)
        if (question) {
          results[question.category] += score
          results.overall += score
        }
      })

      // Normalize scores to 0-100
      results.overall = (results.overall / (SAMPLE_QUESTIONS.length * 4)) * 100
      results.values = (results.values / 4) * 100
      results.workStyle = (results.workStyle / 4) * 100
      results.goals = (results.goals / 4) * 100

      onComplete(results)
      setShowResults(true)
    }
  }

  const getCategoryIcon = (category: 'values' | 'workStyle' | 'goals') => {
    switch (category) {
      case 'values':
        return <FaHeart className="text-red-500" />
      case 'workStyle':
        return <FaUsers className="text-blue-500" />
      case 'goals':
        return <FaChartLine className="text-green-500" />
      default:
        return <FaLightbulb className="text-yellow-500" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {!showResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center gap-2 mb-6">
            {getCategoryIcon(SAMPLE_QUESTIONS[currentQuestion].category)}
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}
            </h2>
          </div>

          <p className="text-lg mb-6">{SAMPLE_QUESTIONS[currentQuestion].text}</p>

          <div className="space-y-3">
            {SAMPLE_QUESTIONS[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.score)}
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {option.text}
              </motion.button>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%`
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-gray-600">
            Your cultural match profile has been updated. Continue exploring matches!
          </p>
        </motion.div>
      )}
    </div>
  )
} 