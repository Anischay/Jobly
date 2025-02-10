'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaBriefcase, FaBuilding, FaUsers, FaChartLine, FaEnvelope, FaBell, FaCog, FaSearch, FaFilter, FaSort } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'
import { CandidateCard } from '@/components/CandidateCard'
import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function DashboardPage() {
  const { type } = useParams()
  const { trackInteraction, trackFeatureUsage } = useAnalytics()
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      location: 'San Francisco',
      salary: '$120k - $180k',
      type: 'Full-time',
      experience: '5+ years',
      logo: '/companies/techcorp.png',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      postedAt: '2 days ago',
      description: 'Join our innovative team building the next generation of cloud solutions.',
      requirements: [
        'Strong experience with React and Node.js',
        'Experience with cloud platforms (AWS preferred)',
        'Understanding of CI/CD practices',
        'Excellent problem-solving skills'
      ],
      responsibilities: [
        'Design and implement scalable web applications',
        'Work with cross-functional teams',
        'Mentor junior developers',
        'Contribute to technical architecture'
      ],
      benefits: [
        'Competitive salary',
        'Remote work options',
        'Health insurance',
        'Stock options'
      ],
      culture: {
        values: [
          'Innovation',
          'Collaboration',
          'Growth mindset'
        ],
        perks: [
          'Flexible hours',
          'Learning budget',
          'Team events'
        ]
      }
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'DesignLabs',
      location: 'Remote',
      salary: '$90k - $140k',
      type: 'Full-time',
      experience: '3+ years',
      logo: '/companies/designlabs.png',
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      postedAt: '3 days ago',
      description: 'Shape the future of digital products with our world-class design team.',
      requirements: [
        'Strong portfolio showcasing UI/UX work',
        'Experience with design systems',
        'Understanding of user research',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Design user interfaces for web and mobile',
        'Create and maintain design systems',
        'Conduct user research',
        'Collaborate with developers'
      ],
      benefits: [
        'Competitive salary',
        'Remote work',
        'Health benefits',
        'Design tools stipend'
      ],
      culture: {
        values: [
          'Creativity',
          'User focus',
          'Collaboration'
        ],
        perks: [
          'Flexible schedule',
          'Learning opportunities',
          'Design conferences'
        ]
      }
    }
  ]

  const mockCandidates = [
    {
      name: 'Alex Thompson',
      title: 'Senior Full Stack Developer',
      description: 'Passionate developer with 6+ years of experience building scalable web applications.',
      experience: '6+ years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
      matchScore: 95
    }
  ]

  const stats = [
    { label: 'Active Jobs', value: 8, icon: FaBriefcase },
    { label: 'Total Applicants', value: 124, icon: FaUsers },
    { label: 'Interviews Scheduled', value: 12, icon: FaChartLine }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'salary'>('relevance')
  const [filters, setFilters] = useState({
    jobType: 'all',
    experience: 'all',
    location: 'all',
    salary: 'all'
  })

  // Track search interactions
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(async () => {
        await trackInteraction({
          eventType: 'search',
          targetType: type as string,
          metadata: { query: searchQuery }
        })

        await trackFeatureUsage({
          featureId: 'search',
          successRate: 100,
          timeSpent: 0
        })
      }, 1000) // Debounce search tracking

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, type, trackInteraction, trackFeatureUsage])

  // Track filter changes
  const handleFilterChange = async (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))

    await trackInteraction({
      eventType: 'filter',
      targetType: type as string,
      metadata: { filterType, value }
    })

    await trackFeatureUsage({
      featureId: 'filter',
      successRate: 100,
      timeSpent: 0
    })
  }

  // Track sort changes
  const handleSortChange = async (value: typeof sortBy) => {
    setSortBy(value)

    await trackInteraction({
      eventType: 'filter',
      targetType: type as string,
      metadata: { filterType: 'sort', value }
    })

    await trackFeatureUsage({
      featureId: 'sort',
      successRate: 100,
      timeSpent: 0
    })
  }

  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    console.log(`Swiped ${direction} on ${type} ${id}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </span>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Filter</span>
                <FaFilter className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Sort</span>
                <FaSort className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Any Experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="us">United States</option>
                    <option value="europe">Europe</option>
                  </select>
                </div>
                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Salary Range</label>
                  <select
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Any Salary</option>
                    <option value="0-50">$0 - $50k</option>
                    <option value="50-100">$50k - $100k</option>
                    <option value="100-150">$100k - $150k</option>
                    <option value="150+">$150k+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content - Job/Candidate Listings */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {type === 'jobs' ? (
                  mockJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      featured={job.id === '1'} 
                      onSwipe={(direction) => handleSwipe(direction, job.id)}
                    />
                  ))
                ) : (
                  mockCandidates.map((candidate) => (
                    <CandidateCard 
                      key={candidate.name}
                      name={candidate.name}
                      title={candidate.title}
                      description={candidate.description}
                      experience={candidate.experience}
                      skills={candidate.skills}
                      matchScore={candidate.matchScore}
                      onClick={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 