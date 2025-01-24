'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('test') ? (searchParams.get('role') || 'candidate') : 'candidate'

  useEffect(() => {
    router.replace(`/dashboard/${type}?${searchParams.toString()}`)
  }, [router, type, searchParams])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  )
} 