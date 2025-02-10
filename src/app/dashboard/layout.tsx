'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaHome, 
  FaSearch, 
  FaRegFileAlt, 
  FaGraduationCap, 
  FaHandshake, 
  FaUser,
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaChartLine
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isLoading, checkAuth, logout } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  // Default navigation items
  const navItems = [
    { label: 'Dashboard', icon: FaHome, href: '/dashboard' },
    { label: 'Analytics', icon: FaChartLine, href: '/dashboard/analytics' },
    { label: 'Jobs', icon: FaBriefcase, href: '/dashboard/jobs' },
    { label: 'Candidates', icon: FaUsers, href: '/dashboard/candidates' }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 h-screen w-64 bg-gray-800 p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-8">
            <span className="text-2xl font-bold text-white">Jobly</span>
          </div>

          {/* Navigation Items */}
          <div className="flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  pathname === item.href
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={() => logout()}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <FaUser className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
} 