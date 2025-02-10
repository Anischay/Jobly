'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const isAuthenticated = !!user
  const isLoading = !isLoaded

  const logout = async () => {
    await signOut()
    router.push('/auth/sign-in')
  }

  const checkAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/sign-in')
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    checkAuth,
    role: user?.publicMetadata?.role as string
  }
} 