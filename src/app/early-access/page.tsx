'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SetupWizard } from '@/components/SetupWizard'
import { FaGoogle, FaGithub, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function EarlyAccessPage() {
  const [showSetup, setShowSetup] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
    router.push(`/dashboard/${userType}`)
  }

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    setIsLoading(true)
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (isSignUp) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            name, 
            role: userType?.toUpperCase() 
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        // Sign in after registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Failed to sign in')
        }

        handleStartSetup()
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong')
        setIsLoading(false)
      }
    } else {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError('Invalid email or password')
          setIsLoading(false)
          return
        }

        router.push('/dashboard')
      } catch (error) {
        setError('Something went wrong')
        setIsLoading(false)
      }
    }
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
          {isSignUp ? 'Get Early Access' : 'Welcome Back'}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6"
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span className="ml-2">Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaGithub className="w-5 h-5" />
              <span className="ml-2">GitHub</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
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
                name="email"
                required
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
                name="password"
                required
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
              >
                {isLoading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (isSignUp ? 'Get Early Access' : 'Sign In')}
              </motion.button>
            </div>
          </form>

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