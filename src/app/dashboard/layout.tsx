'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaHome, FaBriefcase, FaUser, FaUsers, FaChartBar, 
  FaCog, FaSignOutAlt, FaBell, FaSearch, FaRegFileAlt,
  FaHandshake, FaGraduationCap, FaLightbulb
} from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, checkAuth, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const candidateNavItems = [
    { label: 'Dashboard', icon: FaHome, href: '/dashboard/candidate' },
    { label: 'Job Search', icon: FaSearch, href: '/dashboard/candidate/jobs' },
    { label: 'My Applications', icon: FaRegFileAlt, href: '/dashboard/candidate/applications' },
    { label: 'Skill Assessment', icon: FaGraduationCap, href: '/dashboard/candidate/skills' },
    { label: 'Matches', icon: FaHandshake, href: '/dashboard/candidate/matches' },
    { label: 'Profile', icon: FaUser, href: '/dashboard/candidate/profile' },
  ]

  const employerNavItems = [
    { label: 'Dashboard', icon: FaHome, href: '/dashboard/employer' },
    { label: 'Post Jobs', icon: FaBriefcase, href: '/dashboard/employer/jobs/post' },
    { label: 'Manage Jobs', icon: FaRegFileAlt, href: '/dashboard/employer/jobs' },
    { label: 'Candidates', icon: FaUsers, href: '/dashboard/employer/candidates' },
    { label: 'Analytics', icon: FaChartBar, href: '/dashboard/employer/analytics' },
    { label: 'Company Profile', icon: FaUser, href: '/dashboard/employer/profile' },
  ]

  const navItems = user?.role === 'CANDIDATE' ? candidateNavItems : employerNavItems

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4">
            <Link 
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              Jobly
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                  <span className="ml-3">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="mt-4 w-full flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="ml-3">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white">
              <FaBell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <FaCog className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 