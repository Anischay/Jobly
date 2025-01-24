'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SetupWizard } from '@/components/SetupWizard'
import { FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function EarlyAccessPage() {
  const [showSetup, setShowSetup] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleStartSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignUp) {
      // Register new user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: userType === 'candidate' ? 'CANDIDATE' : 'EMPLOYER',
        }),
      })

      if (res.ok) {
        // After registration, sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          setShowSetup(true)
        } else {
          console.error('Sign in failed:', result?.error)
        }
      } else {
        const data = await res.json()
        console.error('Registration failed:', data.message)
      }
    } else {
      // Sign in existing user
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        console.error('Sign in failed:', result?.error)
      }
    }
  }

  const handleGoogleSignIn = () => {
    if (!userType) return;
    signIn('google', { 
      callbackUrl: '/dashboard',
      state: userType === 'recruiter' ? 'EMPLOYER' : 'CANDIDATE'
    })
  }

  const handleBack = () => {
    if (showSetup) {
      setShowSetup(false)
    } else {
      setUserType(null)
    }
  }

  const handleComplete = (data: any) => {
    console.log('Setup completed:', data)
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
          <form onSubmit={handleStartSetup} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
            >
              {isSignUp ? 'Get Early Access' : 'Sign In'}
            </button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Google
          </button>
          
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