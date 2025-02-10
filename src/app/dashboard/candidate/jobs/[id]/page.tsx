'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaMapMarkerAlt, FaDollarSign, FaClock, FaBriefcase,
  FaBuilding, FaUsers, FaChartLine, FaAtom, FaBrain,
  FaArrowLeft, FaCheckCircle, FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function JobDetails({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (!params.id || params.id === 'undefined') {
        setError('Invalid job ID')
        setIsLoading(false)
        return
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <Link
          href="/dashboard/candidate/jobs"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Return to Job Search
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-400 mb-4" />
        <div className="text-gray-400">Loading job details...</div>
      </div>
    )
  }

  // Mock data - Will be replaced with API call using params.id
  const job = {
    id: params.id,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
    posted: '2 days ago',
    matchScore: 95,
    description: `We're looking for a Senior Frontend Developer to join our innovative team. You'll be responsible for architecting and implementing high-performance web applications using cutting-edge technologies.

The ideal candidate has a deep understanding of modern JavaScript frameworks, particularly React and Next.js, and a passion for creating exceptional user experiences.`,
    requirements: [
      '5+ years React experience',
      'TypeScript expertise',
      'Next.js proficiency',
      'Strong UI/UX skills',
      'Experience with state management',
      'Testing best practices'
    ],
    benefits: [
      'Remote work options',
      'Comprehensive health insurance',
      '401k with matching',
      'Stock options',
      'Learning budget',
      'Flexible hours'
    ],
    companyInfo: {
      size: '50-200 employees',
      industry: 'Technology',
      founded: 2018,
      website: 'https://techcorp.example.com'
    },
    matchAnalysis: {
      overall: 95,
      categories: [
        {
          name: 'Technical Skills',
          score: 98,
          matches: [
            { skill: 'React', strength: 100, required: true },
            { skill: 'TypeScript', strength: 95, required: true },
            { skill: 'Next.js', strength: 98, required: true },
            { skill: 'Testing', strength: 92, required: false }
          ]
        },
        {
          name: 'Experience Level',
          score: 94,
          matches: [
            { skill: 'Years of Experience', strength: 94, required: true },
            { skill: 'Leadership', strength: 96, required: false }
          ]
        },
        {
          name: 'Culture Fit',
          score: 92,
          matches: [
            { skill: 'Remote Work', strength: 95, required: false },
            { skill: 'Team Collaboration', strength: 90, required: true }
          ]
        }
      ],
      quantumFactors: [
        {
          name: 'Skill Vector Alignment',
          description: 'Multi-dimensional analysis of skill requirements',
          score: 96
        },
        {
          name: 'Career Trajectory',
          description: 'Predicted career growth alignment',
          score: 94
        },
        {
          name: 'Team Dynamics',
          description: 'Team composition and work style compatibility',
          score: 92
        }
      ]
    }
  }

  const handleApply = () => {
    // Will be implemented with actual application logic
    router.push(`/dashboard/candidate/jobs/${params.id}/apply`)
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/dashboard/candidate/jobs"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
          <div className="flex items-center text-gray-400">
            <FaBuilding className="mr-2" />
            {job.company}
          </div>
        </div>
        <div className="text-center bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
          <div className="text-3xl font-bold text-purple-400">{job.matchScore}%</div>
          <div className="text-sm text-gray-400">Match Score</div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-xl flex items-center">
          <FaMapMarkerAlt className="text-gray-400 mr-3" />
          <div>
            <div className="text-sm text-gray-400">Location</div>
            <div className="text-white">{job.location}</div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl flex items-center">
          <FaDollarSign className="text-gray-400 mr-3" />
          <div>
            <div className="text-sm text-gray-400">Salary Range</div>
            <div className="text-white">{job.salary}</div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl flex items-center">
          <FaClock className="text-gray-400 mr-3" />
          <div>
            <div className="text-sm text-gray-400">Job Type</div>
            <div className="text-white">{job.type}</div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl flex items-center">
          <FaUsers className="text-gray-400 mr-3" />
          <div>
            <div className="text-sm text-gray-400">Company Size</div>
            <div className="text-white">{job.companyInfo.size}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {['overview', 'match analysis', 'company'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 relative ${
                activeTab === tab
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-400 whitespace-pre-line">{job.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded-xl flex items-center"
                  >
                    <FaCheckCircle className="text-purple-400 mr-3" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'match analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Quantum Match Factors */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Quantum Match Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {job.matchAnalysis.quantumFactors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center mb-4">
                      {index === 0 && <FaAtom className="text-purple-400 mr-3" />}
                      {index === 1 && <FaChartLine className="text-blue-400 mr-3" />}
                      {index === 2 && <FaBrain className="text-pink-400 mr-3" />}
                      <h3 className="text-lg font-medium text-white">{factor.name}</h3>
                    </div>
                    <p className="text-gray-400 mb-4">{factor.description}</p>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-purple-400">{factor.score}%</div>
                    </div>
                    <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detailed Category Analysis */}
            <div className="space-y-6">
              {job.matchAnalysis.categories.map((category, index) => (
                <div key={index} className="p-6 bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{category.name}</h3>
                    <div className="text-xl font-bold text-purple-400">{category.score}%</div>
                  </div>
                  <div className="space-y-4">
                    {category.matches.map((match, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-gray-300">{match.skill}</span>
                            {match.required && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                                Required
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400">{match.strength}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${match.strength}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'company' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About {job.company}</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-400">
                    <FaUsers className="mr-3" />
                    <span>Company Size: {job.companyInfo.size}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaBriefcase className="mr-3" />
                    <span>Industry: {job.companyInfo.industry}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaBuilding className="mr-3" />
                    <span>Founded: {job.companyInfo.founded}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Company Culture</h2>
                <div className="space-y-4">
                  {job.matchAnalysis.categories
                    .find(c => c.name === 'Culture Fit')
                    ?.matches.map((match, index) => (
                      <div key={index} className="flex items-center text-gray-400">
                        {match.strength >= 90 ? (
                          <FaCheckCircle className="text-green-400 mr-3" />
                        ) : (
                          <FaExclamationCircle className="text-yellow-400 mr-3" />
                        )}
                        <span>{match.skill}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Button */}
      <div className="sticky bottom-8 flex justify-center">
        <motion.button
          onClick={handleApply}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
        >
          Apply Now
        </motion.button>
      </div>
    </div>
  )
} 