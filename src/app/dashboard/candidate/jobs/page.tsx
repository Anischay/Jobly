'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaSearch, FaFilter, FaMapMarkerAlt, FaDollarSign,
  FaClock, FaBriefcase, FaLightbulb, FaArrowRight
} from 'react-icons/fa'

export default function JobSearch() {
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    jobType: '',
    experience: '',
    matchScore: 80
  })

  // Mock data - Will be replaced with API calls
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      posted: '2 days ago',
      matchScore: 95,
      description: 'Leading frontend development for our next-generation web applications...',
      requirements: ['5+ years React', 'TypeScript', 'Next.js', 'UI/UX expertise'],
      benefits: ['Remote work', 'Health insurance', '401k', 'Stock options']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'InnovateLabs',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Full-time',
      posted: '1 week ago',
      matchScore: 92,
      description: 'Building scalable web applications using modern technologies...',
      requirements: ['3+ years Node.js', 'React', 'PostgreSQL', 'AWS'],
      benefits: ['Flexible hours', 'Learning budget', 'Home office setup']
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'DataDynamics',
      location: 'New York, NY',
      salary: '$90k - $120k',
      type: 'Contract',
      posted: '3 days ago',
      matchScore: 88,
      description: 'Developing responsive web applications with React and Redux...',
      requirements: ['2+ years React', 'Redux', 'REST APIs', 'Testing'],
      benefits: ['Healthcare', 'Gym membership', 'Quarterly bonuses']
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Match</h1>
        <p className="text-gray-400">Our quantum algorithm finds the jobs that align with your skills and aspirations</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-2">
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Any Location</option>
            <option value="remote">Remote</option>
            <option value="sf">San Francisco</option>
            <option value="ny">New York</option>
          </select>
        </div>
        <div className="relative">
          <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.salary}
            onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
          >
            <option value="">Any Salary</option>
            <option value="50k">$50k+</option>
            <option value="100k">$100k+</option>
            <option value="150k">$150k+</option>
          </select>
        </div>
        <div className="relative">
          <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          >
            <option value="">Any Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="relative">
          <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          >
            <option value="">Any Experience</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Match Score Filter */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaLightbulb className="text-purple-400" />
            <h3 className="text-lg font-medium text-white">Minimum Match Score</h3>
          </div>
          <span className="text-purple-400 font-bold">{filters.matchScore}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.matchScore}
          onChange={(e) => setFilters({ ...filters, matchScore: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs
          .filter(job => job.matchScore >= filters.matchScore)
          .map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                  <p className="text-gray-400">{job.company}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{job.matchScore}%</div>
                  <div className="text-xs text-gray-400">Match</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <FaMapMarkerAlt className="mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <FaDollarSign className="mr-2" />
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-400">
                  <FaClock className="mr-2" />
                  {job.type}
                </div>
                <div className="flex items-center text-gray-400">
                  <FaBriefcase className="mr-2" />
                  {job.posted}
                </div>
              </div>

              <p className="text-gray-400 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                  >
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  View Details
                  <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )
} 