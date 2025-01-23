'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { CompanyCard } from '@/components/CompanyCard'
import { CandidateCard } from '@/components/CandidateCard'

export default function DemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              Back to Home
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Demo Mode
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Choose Your Perspective
          </h1>
          <p className="text-gray-400">
            Experience Jobly from different viewpoints. Select a role to explore the platform's features and functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyCard
            name="Recruiter View"
            title="Demo Profile"
            description="Experience talent acquisition"
            location="San Francisco, CA"
            companySize="50-200"
            activeJobs={12}
            totalHires={45}
            onClick={() => router.push('/demo/candidates')}
          />

          <CandidateCard
            name="Job Seeker View"
            title="Demo Profile"
            description="Explore opportunities"
            experience="8+ years Experience"
            skills={['React', 'Node.js', 'TypeScript', 'AWS']}
            matchScore={95}
            onClick={() => router.push('/demo/jobs')}
          />
        </div>
      </div>
    </div>
  )
} 