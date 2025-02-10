'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SetupWizard } from '@/components/SetupWizard'
import { FaGoogle, FaGithub, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSignIn, useSignUp } from "@clerk/nextjs";

export default function EarlyAccessPage() {
  const [showSetup, setShowSetup] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

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

  const handleOAuthSignIn = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!isSignInLoaded || !userType) return;
    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/auth/callback',
        redirectUrlComplete: `/dashboard/${userType}`
      });
    } catch (err) {
      console.error("OAuth error:", err);
      setError("Failed to authenticate with provider");
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      if (isSignUp) {
        if (!isSignUpLoaded) return;
        
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: name?.split(' ')[0],
          lastName: name?.split(' ')[1] || '',
        });

        if (result.status === "complete") {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          handleStartSetup();
        } else {
          console.error("Sign up error:", result);
          setError("Failed to sign up");
        }
      } else {
        if (!isSignInLoaded) return;
        
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          router.push("/dashboard");
        } else {
          console.error("Sign in error:", result);
          setError("Invalid email or password");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
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
              onClick={() => handleOAuthSignIn('oauth_google')}
              disabled={isLoading || !isSignInLoaded}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span className="ml-2">Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignIn('oauth_github')}
              disabled={isLoading || !isSignInLoaded}
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Choose a password"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || (!isSignInLoaded && !isSignUpLoaded)}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-400 hover:text-purple-300"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
} 