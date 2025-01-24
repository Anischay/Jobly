'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Job } from '@/types'
import { FaBriefcase, FaMapMarkerAlt, FaCode, FaUsers, FaClock } from 'react-icons/fa'

const WORK_STYLES = ['remote', 'hybrid', 'onsite'] as const
const COMPANY_VALUES = [
  'innovation', 'teamwork', 'growth-mindset', 'user-focused',
  'work-life-balance', 'diversity', 'continuous-learning', 'excellence'
]

export default function CreateJobPage() {
  const [job, setJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    description: '',
    requiredSkills: [],
    requiredExperience: 0,
    workStyle: 'hybrid',
    companyValues: [],
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    }
  })

  const [skillInput, setSkillInput] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleAddSkill = () => {
    if (skillInput.trim() && !job.requiredSkills?.includes(skillInput.trim())) {
      setJob(prev => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setJob(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter(s => s !== skill)
    }))
  }

  const handleValueToggle = (value: string) => {
    setJob(prev => ({
      ...prev,
      companyValues: prev.companyValues?.includes(value)
        ? prev.companyValues.filter(v => v !== value)
        : [...(prev.companyValues || []), value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement job posting submission
    console.log('Submitting job:', job)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create Job Posting</h1>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: previewMode ? 0 : 1, x: previewMode ? -20 : 0 }}
            className={`space-y-6 ${previewMode ? 'hidden lg:block' : ''}`}
            onSubmit={handleSubmit}
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={job.title}
                  onChange={e => setJob(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. Senior Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={job.company}
                  onChange={e => setJob(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. TechCorp Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={job.location}
                  onChange={e => setJob(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            {/* Work Style */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Work Style</h2>
              <div className="flex gap-4">
                {WORK_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setJob(prev => ({ ...prev, workStyle: style }))}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      job.workStyle === style
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Add a required skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Company Values */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Company Values</h2>
              <div className="flex flex-wrap gap-2">
                {COMPANY_VALUES.map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleValueToggle(value)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      job.companyValues?.includes(value)
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {value.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <textarea
                value={job.description}
                onChange={e => setJob(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-40 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Post Job
              </button>
            </div>
          </motion.form>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: previewMode ? 1 : 0, x: previewMode ? 0 : 20 }}
            className={`bg-gray-800 rounded-xl p-6 ${previewMode ? '' : 'hidden lg:block'}`}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{job.title || 'Job Title'}</h2>
                <div className="flex items-center gap-4 text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <FaBriefcase className="text-purple-400" />
                    {job.company || 'Company Name'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-purple-400" />
                    {job.location || 'Location'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-purple-400" />
                    {job.workStyle?.charAt(0).toUpperCase() + job.workStyle?.slice(1) || 'Work Style'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Company Values</h3>
                <div className="flex flex-wrap gap-2">
                  {job.companyValues?.map(value => (
                    <span
                      key={value}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {value.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {job.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 