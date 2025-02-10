'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'

// Mock job data
const DEMO_JOBS = [
  {
    id: 'job1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp',
    location: 'San Francisco',
    type: 'FULL_TIME',
    salary: '$120k - $180k',
    description: 'Join our innovative team building the next generation of cloud solutions.',
    requirements: ['5+ years experience', 'React', 'Node.js', 'AWS'],
    matchScore: 95,
    logo: '/companies/techcorp.png'
  },
  {
    id: 'job2',
    title: 'Product Designer',
    company: 'DesignLabs',
    location: 'Remote',
    type: 'FULL_TIME',
    salary: '$90k - $140k',
    description: 'Shape the future of digital products with our world-class design team.',
    requirements: ['3+ years experience', 'Figma', 'UI/UX', 'Design Systems'],
    matchScore: 88,
    logo: '/companies/designlabs.png'
  },
  {
    id: 'job3',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'New York',
    type: 'FULL_TIME',
    salary: '$130k - $170k',
    description: 'Build and maintain our cloud infrastructure serving millions of users.',
    requirements: ['4+ years experience', 'Kubernetes', 'AWS', 'CI/CD'],
    matchScore: 92,
    logo: '/companies/cloudscale.png'
  }
]

export default function DemoJobsPage() {
  const router = useRouter()
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [swipedJobs, setSwipedJobs] = useState<string[]>([])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentJob = DEMO_JOBS[currentJobIndex]
    
    setSwipedJobs(prev => [...prev, currentJob.id])
    
    if (direction === 'right') {
      // Show success message or animation
      console.log('Liked job:', currentJob.title)
    }

    // Move to next job
    if (currentJobIndex < DEMO_JOBS.length - 1) {
      setCurrentJobIndex(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation('/demo')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              Back to Demo
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Job Seeker Demo
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              Find Your Next Role
            </h1>
            <p className="text-gray-400">
              Swipe right on jobs you're interested in, left to pass
            </p>
          </div>

          {currentJobIndex < DEMO_JOBS.length ? (
            <div className="relative">
              <JobCard
                job={DEMO_JOBS[currentJobIndex]}
                onSwipe={handleSwipe}
                featured={true}
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-800/50 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">That's all for now!</h2>
              <p className="text-gray-400 mb-8">
                Ready to see more jobs matched to your profile?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/early-access')}
                className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Join Early Access
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 