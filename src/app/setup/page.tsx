'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SetupWizard } from '@/components/SetupWizard'
import { motion } from 'framer-motion'

export default function SetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(
    searchParams.get('type') as 'candidate' | 'recruiter' | null
  )

  const handleComplete = (data: any) => {
    // Here you would typically send the data to your backend
    console.log('Setup completed:', data)
    // Redirect to the appropriate dashboard
    router.push(`/dashboard/${userType}`)
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Path
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('candidate')}
              className="p-6 bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">I'm a Candidate</h2>
              <p className="text-gray-400">
                Looking for exciting job opportunities and want to showcase your skills
              </p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('recruiter')}
              className="p-6 bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">I'm a Recruiter</h2>
              <p className="text-gray-400">
                Looking to find and hire talented professionals for your company
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return <SetupWizard type={userType} onComplete={handleComplete} />
} 