'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa'

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}

interface FormData {
  fullName: string
  email: string
  phone: string
  resumeUrl: string
  coverLetter: string
  portfolio?: string
  linkedin?: string
  github?: string
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
  onClose,
  onSubmit
}: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
    portfolio: '',
    linkedin: '',
    github: ''
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulate file upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // TODO: Implement actual file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormData(prev => ({ ...prev, resumeUrl: URL.createObjectURL(file) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting application:', error)
      // TODO: Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      title: 'Personal Information',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>
      )
    },
    {
      title: 'Resume & Links',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Resume
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="w-full px-4 py-8 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
              >
                <FaUpload className="text-2xl text-gray-400 mb-2" />
                <span className="text-gray-400">
                  {formData.resumeUrl ? 'Replace resume' : 'Upload your resume'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  PDF, DOC, or DOCX up to 5MB
                </span>
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Portfolio URL (optional)
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="https://your-portfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              LinkedIn URL (optional)
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              GitHub URL (optional)
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="https://github.com/your-username"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Cover Letter',
      fields: (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Why are you interested in this position?
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            className="w-full h-64 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Tell us why you'd be a great fit for this role..."
            required
          />
        </div>
      )
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Apply for {jobTitle}</h2>
            <p className="text-sm text-gray-400 mt-1">Step {step} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-medium mb-4">{steps[step - 1].title}</h3>
            {steps[step - 1].fields}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
            className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (step === steps.length) {
                handleSubmit(new Event('submit') as any)
              } else {
                setStep(prev => prev + 1)
              }
            }}
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Submitting...
              </>
            ) : step === steps.length ? (
              'Submit Application'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
} 