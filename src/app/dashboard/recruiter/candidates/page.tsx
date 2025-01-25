'use client'

import { useState, useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import ProfileCard from '@/components/ProfileCard'

export default function CandidateRecommendationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch profile recommendations
      const response = await fetch('/api/profiles/recommendations?test=true&role=recruiter')
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      
      const data = await response.json()
      setRecommendations(prev => [...prev, ...data])
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to load candidate recommendations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= recommendations.length) return

    const currentProfile = recommendations[currentIndex]

    try {
      console.log('Recording swipe:', { direction, profileId: currentProfile.id })
      // Record the swipe
      await fetch('/api/profiles/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: currentProfile.id,
          direction,
          test: true // For testing
        })
      })

      // Move to next profile
      setCurrentIndex(prev => prev + 1)

      // If we're running low on recommendations, fetch more
      if (currentIndex >= recommendations.length - 3) {
        fetchRecommendations()
      }
    } catch (err) {
      console.error('Failed to record swipe:', err)
    }
  }

  console.log('Render state:', { loading, error, recommendations, currentIndex })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Find Your Next Hire
        </h1>

        <div className="flex flex-col items-center">
          {currentIndex < recommendations.length ? (
            <div className="w-full max-w-md">
              <ProfileCard
                {...recommendations[currentIndex]}
                onSwipe={handleSwipe}
              />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No More Candidates</h2>
              <p className="text-gray-400 mb-8">Check back later for more recommendations</p>
              <button
                onClick={fetchRecommendations}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 