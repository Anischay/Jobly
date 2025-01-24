'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as 'CANDIDATE' | 'EMPLOYER'

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Failed to sign in')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    setIsLoading(true)
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-blue-400 hover:text-blue-300">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
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
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="role" className="sr-only">I am a...</label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                >
                  <option value="">I am a...</option>
                  <option value="CANDIDATE">Job Seeker</option>
                  <option value="EMPLOYER">Employer</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 