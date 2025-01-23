'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SetupWizard } from '@/components/SetupWizard'
import { FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function EarlyAccessPage() {
  const [showSetup, setShowSetup] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true) // Default to sign up for early access
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null)
  const router = useRouter()

  const handleStartSetup = () => {
    setShowSetup(true)
  }

  const handleBack = () => {
    if (showSetup) {
      setShowSetup(false)
    } else {
      setUserType(null)
    }
  }

  const handleComplete = (data: any) => {
    // Here you would typically send the data to your backend
    console.log('Setup completed:', data)
    // Redirect to the appropriate dashboard
    router.push(`/dashboard/${userType}`)
  }

  if (showSetup) {
    return (
      <div>
        <button 
          onClick={handleBack}
          className="fixed top-6 left-6 text-white flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <FaArrowLeft /> Back
        </button>
        <SetupWizard type={userType!} onComplete={handleComplete} />
      </div>
    )
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Choose Your Path
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('candidate')}
              className="p-6 bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">I'm a Job Seeker</h2>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <FaArrowLeft /> Back
        </button>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Get Early Access
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4"
        >
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your full name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter your password"
            />
          </div>
          {!isSignUp && (
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Forgot password?
              </a>
            </div>
          )}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartSetup}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
            >
              {isSignUp ? 'Get Early Access' : 'Sign In'}
            </motion.button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartSetup}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <FaGoogle />
              Google
            </motion.button>
          </div>
          <p className="text-center text-gray-400 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-400 hover:text-purple-300"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
} 