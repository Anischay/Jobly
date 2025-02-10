'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'

interface Skill {
  skill: {
    id: string;
    name: string;
    category: string;
  };
  importance: number;
  required: boolean;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function JobsPage() {
  const router = useRouter()
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [swipedJobs, setSwipedJobs] = useState<{[key: string]: 'left' | 'right'}>({})
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setError(error instanceof Error ? error.message : 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleSwipe = (direction: 'left' | 'right', reason?: string) => {
    if (!jobs.length) return

    const currentJob = jobs[currentJobIndex]
    
    // Record the swipe
    setSwipedJobs(prev => ({
      ...prev,
      [currentJob.id]: direction
    }))

    // Log the action
    console.log(`Swiped ${direction} on job ${currentJob.id}${reason ? ` with reason: ${reason}` : ''}`)

    // Move to next job
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Jobs Found</h2>
          <p className="text-gray-400 mb-8">There are no job postings available at the moment.</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back Home
            </button>
            <button
              onClick={() => router.push('/jobs/post')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentJobIndex >= jobs.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No More Jobs</h2>
          <p className="text-gray-400 mb-8">You've viewed all available jobs.</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back Home
            </button>
            <button
              onClick={() => {
                setCurrentJobIndex(0)
                setSwipedJobs({})
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentJob = jobs[currentJobIndex]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div className="text-gray-400">
              Job {currentJobIndex + 1} of {jobs.length}
            </div>
          </div>
        </div>
      </div>

      {/* Job Card Section */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <JobCard 
            job={{
              ...currentJob,
              companyInfo: {
                name: currentJob.company,
                size: 'Unknown',
                industry: 'Unknown',
                description: '',
                culture: []
              },
              imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
              responsibilities: currentJob.description.split('\n').filter(Boolean),
              benefits: [],
              requirements: currentJob.requirements.split('\n').filter(Boolean)
            }} 
            onSwipe={handleSwipe} 
          />
        </div>
      </div>
    </div>
  )
}