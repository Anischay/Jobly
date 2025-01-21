'use client'

import { useEffect, useState } from 'react'
import { JobCard } from '@/components/JobCard'
import { AnimatePresence } from 'framer-motion'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  description: string
  requirements: string
  salary?: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?test=true', {
        cache: 'no-store'
      })
      const data = await response.json()
      setJobs(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setLoading(false)
    }
  }

  const handleSwipe = async (jobId: string, direction: 'LEFT' | 'RIGHT') => {
    // In test mode, just move to the next card without recording the swipe
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading jobs...</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No more jobs available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Find Your Next Job</h1>
        
        <div className="relative h-[600px]">
          <AnimatePresence>
            {jobs.slice(currentIndex).map((job, index) => (
              <div key={job.id} className="absolute inset-0" style={{ zIndex: jobs.length - index }}>
                <JobCard
                  job={job}
                  onSwipe={handleSwipe}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center text-gray-500">
          {jobs.length - currentIndex} jobs remaining
        </div>
      </div>
    </div>
  )
} 