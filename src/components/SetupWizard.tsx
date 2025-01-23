'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaBriefcase, FaGraduationCap, FaCode, FaBuilding, FaUsers, FaLaptopCode, FaHandshake, FaHeart } from 'react-icons/fa'
import { IconType } from 'react-icons'

type UserType = 'candidate' | 'recruiter'

interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select'
  required?: boolean
  options?: string[]
}

interface FormData {
  [key: string]: string
}

interface SetupWizardProps {
  type: UserType
  onComplete: (data: FormData) => void
}

interface Step {
  title: string
  icon: IconType
  fields: FormField[]
}

export const SetupWizard = ({ type, onComplete }: SetupWizardProps) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})

  const candidateSteps: Step[] = [
    {
      title: 'Basic Information',
      icon: FaUser,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'title', label: 'Professional Title', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'bio', label: 'Professional Summary', type: 'textarea', required: true },
      ]
    },
    {
      title: 'Experience',
      icon: FaBriefcase,
      fields: [
        { name: 'experience', label: 'Years of Experience', type: 'text', required: true },
        { name: 'currentRole', label: 'Current Role', type: 'text', required: true },
        { name: 'achievements', label: 'Key Achievements (comma separated)', type: 'textarea', required: true },
      ]
    },
    {
      title: 'Education',
      icon: FaGraduationCap,
      fields: [
        { name: 'education', label: 'Highest Education', type: 'text', required: true },
        { name: 'certifications', label: 'Certifications (comma separated)', type: 'textarea' },
      ]
    },
    {
      title: 'Skills & Expertise',
      icon: FaCode,
      fields: [
        { name: 'skills', label: 'Skills (comma separated)', type: 'textarea', required: true },
        { name: 'languages', label: 'Programming Languages', type: 'textarea' },
        { name: 'tools', label: 'Tools & Technologies', type: 'textarea' },
      ]
    },
    {
      title: 'Preferences',
      icon: FaHeart,
      fields: [
        { name: 'workStyle', label: 'Preferred Work Style', type: 'select', options: ['Remote', 'Hybrid', 'On-site'], required: true },
        { name: 'jobType', label: 'Job Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Freelance'], required: true },
        { name: 'salary', label: 'Expected Salary Range', type: 'text', required: true },
      ]
    }
  ]

  const recruiterSteps: Step[] = [
    {
      title: 'Company Information',
      icon: FaBuilding,
      fields: [
        { name: 'companyName', label: 'Company Name', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'about', label: 'About Company', type: 'textarea', required: true },
      ]
    },
    {
      title: 'Team & Culture',
      icon: FaUsers,
      fields: [
        { name: 'teamSize', label: 'Team Size', type: 'text', required: true },
        { name: 'values', label: 'Company Values (comma separated)', type: 'textarea', required: true },
        { name: 'perks', label: 'Benefits & Perks (comma separated)', type: 'textarea', required: true },
      ]
    },
    {
      title: 'Work Environment',
      icon: FaLaptopCode,
      fields: [
        { name: 'workStyle', label: 'Work Style', type: 'select', options: ['Remote', 'Hybrid', 'On-site'], required: true },
        { name: 'techStack', label: 'Tech Stack (comma separated)', type: 'textarea', required: true },
        { name: 'tools', label: 'Tools & Platforms', type: 'textarea', required: true },
      ]
    },
    {
      title: 'Hiring Preferences',
      icon: FaHandshake,
      fields: [
        { name: 'hiringProcess', label: 'Hiring Process', type: 'textarea', required: true },
        { name: 'requirements', label: 'General Requirements', type: 'textarea', required: true },
        { name: 'culture', label: 'Cultural Fit Indicators', type: 'textarea', required: true },
      ]
    }
  ]

  const steps = type === 'candidate' ? candidateSteps : recruiterSteps
  const currentStep = steps[step - 1]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    const requiredFields = currentStep.fields.filter(f => f.required).map(f => f.name)
    return requiredFields.every(field => formData[field]?.trim())
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i + 1 === step
                      ? 'bg-purple-500'
                      : i + 1 < step
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="text-white" />
                </motion.div>
                <div className="text-xs mt-2 text-gray-400">{s.title}</div>
              </div>
            )
          })}
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-800 rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {currentStep.title}
            </h2>

            <div className="space-y-4">
              {currentStep.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:border-purple-500"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className={`px-6 py-2 rounded-lg ${
                  step === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                disabled={step === 1}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-lg ${
                  isStepValid()
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step === steps.length ? 'Complete' : 'Next'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 