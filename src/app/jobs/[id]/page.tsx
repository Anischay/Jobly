'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/types'
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign,
  FaCode,
  FaUsers,
  FaChartLine,
  FaBuilding
} from 'react-icons/fa'
import Link from 'next/link'
import JobApplicationForm from '@/components/JobApplicationForm'

// Sample job data (will be replaced with API call)
const JOB_DATA: Job = {
  id: '1',
  title: 'Senior Full Stack Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  description: `We are looking for a senior full stack developer to join our growing team. You will be responsible for:

• Building scalable web applications using modern technologies
• Leading technical architecture decisions
• Mentoring junior developers
• Collaborating with product and design teams

Our tech stack includes React, Node.js, TypeScript, and AWS. We value clean code, test-driven development, and continuous learning.`,
  requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
  requiredExperience: 5,
  workStyle: 'hybrid',
  companyValues: ['innovation', 'teamwork', 'growth-mindset', 'user-focused'],
  salary: {
    min: 120000,
    max: 180000,
    currency: 'USD'
  }
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const job = JOB_DATA // In production, fetch job by params.id

  const sections = [
    {
      icon: FaBriefcase,
      title: 'Role Overview',
      content: job.description
    },
    {
      icon: FaCode,
      title: 'Required Skills',
      content: (
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map(skill => (
            <span
              key={skill}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )
    },
    {
      icon: FaChartLine,
      title: 'Experience',
      content: `${job.requiredExperience}+ years of professional experience`
    },
    {
      icon: FaUsers,
      title: 'Company Values',
      content: (
        <div className="flex flex-wrap gap-2">
          {job.companyValues.map(value => (
            <span
              key={value}
              className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
            >
              {value.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          ))}
        </div>
      )
    }
  ]

  const handleApply = () => {
    setShowApplicationForm(true)
  }

  const handleApplicationSubmit = async (formData: any) => {
    // TODO: Implement application submission
    console.log('Submitting application:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/jobs"
              className="text-gray-400 hover:text-white mb-4 inline-block"
            >
              ← Back to Jobs
            </Link>
            
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-gray-400">
                    <span className="flex items-center gap-2">
                      <FaBuilding className="text-purple-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-purple-400" />
                      {job.workStyle.charAt(0).toUpperCase() + job.workStyle.slice(1)}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-2">
                        <FaDollarSign className="text-purple-400" />
                        ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} / year
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleApply}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="text-2xl text-purple-400" />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                
                <div className="text-gray-300 space-y-4">
                  {typeof section.content === 'string' ? (
                    section.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    section.content
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Apply Button (Bottom) */}
          <div className="mt-8 text-center">
            <button
              onClick={handleApply}
              className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && (
          <JobApplicationForm
            jobId={job.id}
            jobTitle={job.title}
            onClose={() => setShowApplicationForm(false)}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </AnimatePresence>
    </>
  )
} 