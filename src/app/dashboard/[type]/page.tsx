'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUser, FaBriefcase, FaChartLine, FaNetworkWired, 
  FaBrain, FaAtom, FaProjectDiagram, FaUserFriends,
  FaCog, FaBell, FaSignOutAlt, FaSearch, FaRegClock,
  FaRegLightbulb, FaRegCompass, FaRegChartBar, FaCode,
  FaMapMarkerAlt, FaGraduationCap, FaUsers, FaCheckCircle,
  FaExclamationTriangle, FaDownload, FaEdit, FaCopy, FaEllipsisV, FaPlus,
  FaFilter, FaStar, FaEye, FaCalendar, FaClock,
  FaRegSun, FaRegMoon, FaBars, FaTimes
} from 'react-icons/fa'
import { IconType } from 'react-icons'
import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'
import { Toaster, toast } from 'react-hot-toast'

interface NavItem {
  id: string
  label: string
  icon: IconType
}

interface QuantumCard {
  title: string
  value: number
  trend: string
  benchmark: string
  icon: IconType
  description: string
  color: string
  details: { label: string; value: string }[]
}

interface Activity {
  id: number
  type: 'match' | 'insight' | 'alert'
  message: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
  action: {
    label: string
    url: string
  }
  details?: string
}

interface Insight {
  id: number
  title: string
  description: string
  type: string
  action: {
    label: string
    url: string
  }
}

interface DashboardMetrics {
  profileStrength: number
  applicationSuccess: number
  interviewRate: number
  skillMatchScore: number
  upcomingInterviews: number
  savedJobs: number
  profileViews: number
  activePositions: number
  totalApplications: number
  interviewsScheduled: number
  talentPoolSize: number
  candidateMatchRate: number
  timeToHire: number
  offerAcceptanceRate: number
}

interface RecentActivity {
  id: number
  type: 'match' | 'insight' | 'alert'
  message: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
  action: {
    label: string
    url: string
  }
  details?: string
}

// Initial metrics with fixed values
const initialMetrics: DashboardMetrics = {
  profileStrength: 75,
  applicationSuccess: 65,
  interviewRate: 45,
  skillMatchScore: 80,
  upcomingInterviews: 3,
  savedJobs: 12,
  profileViews: 45,
  activePositions: 8,
  totalApplications: 156,
  interviewsScheduled: 5,
  talentPoolSize: 450,
  candidateMatchRate: 85,
  timeToHire: 18,
  offerAcceptanceRate: 92
}

// Separate metrics generation for different roles
const generateMetrics = (isCandidate: boolean): DashboardMetrics => {
  // Only generate random metrics on the client side
  if (typeof window === 'undefined') {
    return initialMetrics
  }

  return {
    profileStrength: Math.round(Math.random() * 100),
    applicationSuccess: Math.round(Math.random() * 100),
    interviewRate: Math.round(Math.random() * 100),
    skillMatchScore: Math.round(Math.random() * 100),
    upcomingInterviews: Math.round(Math.random() * 5),
    savedJobs: Math.round(Math.random() * 20),
    profileViews: Math.round(Math.random() * 100),
    activePositions: Math.round(Math.random() * 10),
    totalApplications: Math.round(Math.random() * 200),
    interviewsScheduled: Math.round(Math.random() * 10),
    talentPoolSize: Math.round(Math.random() * 1000),
    candidateMatchRate: Math.round(Math.random() * 100),
    timeToHire: Math.round(Math.random() * 30),
    offerAcceptanceRate: Math.round(Math.random() * 100)
  }
}

// Role-specific cards
const getMetricCards = (metrics: any, isCandidate: boolean): QuantumCard[] => {
  if (isCandidate) {
    return [
      {
        title: 'Profile Strength',
        value: metrics.profileStrength,
        trend: '+15%',
        benchmark: '75%',
        icon: FaUser,
        description: 'Overall profile completeness and impact',
        color: 'from-purple-500 to-blue-500',
        details: [
          { label: 'Skills Verified', value: '12/15' },
          { label: 'Projects Added', value: '4/5' },
          { label: 'Recommendations', value: '3' }
        ]
      },
      {
        title: 'Application Success',
        value: metrics.applicationSuccess,
        trend: '+8%',
        benchmark: '45%',
        icon: FaBriefcase,
        description: 'Response rate from applications',
        color: 'from-blue-500 to-cyan-500',
        details: [
          { label: 'Applications', value: '24' },
          { label: 'Responses', value: '15' },
          { label: 'Interviews', value: '6' }
        ]
      },
      {
        title: 'Interview Rate',
        value: metrics.interviewRate,
        trend: '+12%',
        benchmark: '30%',
        icon: FaUserFriends,
        description: 'Applications leading to interviews',
        color: 'from-cyan-500 to-green-500',
        details: [
          { label: 'This Month', value: '5' },
          { label: 'Last Month', value: '3' },
          { label: 'Success Rate', value: '80%' }
        ]
      },
      {
        title: 'Skill Match Score',
        value: metrics.skillMatchScore,
        trend: '+5%',
        benchmark: '85%',
        icon: FaCode,
        description: 'Alignment with job requirements',
        color: 'from-green-500 to-yellow-500',
        details: [
          { label: 'Top Skills', value: '8/10' },
          { label: 'Trending', value: '3' },
          { label: 'To Improve', value: '2' }
        ]
      }
    ]
  } else {
    return [
      {
        title: 'Talent Pool',
        value: metrics.talentPoolSize,
        trend: '+25%',
        benchmark: '500',
        icon: FaUsers,
        description: 'Active candidates in your pool',
        color: 'from-purple-500 to-blue-500',
        details: [
          { label: 'New This Week', value: '45' },
          { label: 'Highly Qualified', value: '65%' },
          { label: 'Ready to Interview', value: '28' }
        ]
      },
      {
        title: 'Match Rate',
        value: metrics.candidateMatchRate,
        trend: '+15%',
        benchmark: '75%',
        icon: FaProjectDiagram,
        description: 'Candidate fit accuracy',
        color: 'from-blue-500 to-cyan-500',
        details: [
          { label: 'Perfect Matches', value: '12' },
          { label: 'Good Matches', value: '34' },
          { label: 'Average Score', value: '85%' }
        ]
      },
      {
        title: 'Time to Hire',
        value: metrics.timeToHire,
        trend: '-20%',
        benchmark: '25d',
        icon: FaRegClock,
        description: 'Average days to fill positions',
        color: 'from-cyan-500 to-green-500',
        details: [
          { label: 'Current Average', value: '18d' },
          { label: 'Fastest Hire', value: '5d' },
          { label: 'Open Positions', value: '8' }
        ]
      },
      {
        title: 'Offer Success',
        value: metrics.offerAcceptanceRate,
        trend: '+10%',
        benchmark: '80%',
        icon: FaCheckCircle,
        description: 'Offer acceptance rate',
        color: 'from-green-500 to-yellow-500',
        details: [
          { label: 'Offers Made', value: '15' },
          { label: 'Accepted', value: '12' },
          { label: 'Pending', value: '3' }
        ]
      }
    ]
  }
}

// Role-specific activities
const getRecentActivities = (isCandidate: boolean): Activity[] => {
  if (isCandidate) {
    return [
      {
        id: 1,
        type: 'match',
        message: 'New job match found - Senior Developer at TechCorp',
        timestamp: '2 hours ago',
        priority: 'high',
        action: {
          label: 'View Match',
          url: '/jobs/123'
        },
        details: '95% match with your profile • $120k-150k • Remote'
      },
      {
        id: 2,
        type: 'insight',
        message: 'Your React skills are in high demand - 20% increase',
        timestamp: '4 hours ago',
        priority: 'medium',
        action: {
          label: 'Skill Details',
          url: '/skills'
        },
        details: '15 new jobs in your area • Avg salary up 12%'
      },
      {
        id: 3,
        type: 'alert',
        message: 'Interview scheduled with StartupX for tomorrow',
        timestamp: 'Tomorrow at 2 PM',
        priority: 'high',
        action: {
          label: 'Prepare Now',
          url: '/interviews/456'
        },
        details: 'Senior Frontend Role • Virtual Interview • 60 mins'
      }
    ]
  } else {
    return [
      {
        id: 1,
        type: 'match',
        message: 'New candidate matches for Frontend Developer role',
        timestamp: '1 hour ago',
        priority: 'high',
        action: {
          label: 'Review Matches',
          url: '/candidates'
        },
        details: '5 new matches • 3 highly qualified • 2 ready to interview'
      },
      {
        id: 2,
        type: 'insight',
        message: 'Hiring trend: React Native skills rising in applicants',
        timestamp: '3 hours ago',
        priority: 'medium',
        action: {
          label: 'View Report',
          url: '/insights'
        },
        details: '35% increase in qualified candidates • Market analysis available'
      },
      {
        id: 3,
        type: 'alert',
        message: '5 candidates awaiting interview scheduling',
        timestamp: 'Action needed',
        priority: 'high',
        action: {
          label: 'Schedule Now',
          url: '/schedule'
        },
        details: '2 for Senior Role • 3 for Mid-level • Pending > 48 hours'
      }
    ]
  }
}

// Tab-specific content components
const OverviewTab = ({ metrics, recentActivities, quantumCards, isCandidate }: { 
  metrics: DashboardMetrics
  recentActivities: RecentActivity[]
  quantumCards: QuantumCard[]
  isCandidate: boolean 
}) => {
  return (
    <>
      {/* Strategic Overview Section */}
      <div className="bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-700 mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {isCandidate ? 
                `Welcome back! ${metrics.upcomingInterviews > 0 ? '🎯 You have upcoming interviews' : '👋'}` : 
                `Welcome back! ${metrics.activePositions > 0 ? '🎯 Active positions need attention' : '👋'}`
              }
            </h2>
            <div className="flex items-center gap-4 text-gray-400">
              {isCandidate ? (
                <>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-purple-400" />
                    <span>{metrics.upcomingInterviews} interviews scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-purple-400" />
                    <span>{metrics.savedJobs} saved jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-purple-400" />
                    <span>{metrics.profileViews} profile views this week</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-purple-400" />
                    <span>{metrics.activePositions} active positions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-purple-400" />
                    <span>{metrics.totalApplications} total applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-purple-400" />
                    <span>{metrics.interviewsScheduled} interviews scheduled</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
            {isCandidate ? (
              <>
                <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 flex items-center gap-2">
                  <FaBriefcase className="text-sm" />
                  Quick Apply ({metrics.savedJobs})
                </button>
                <button className="px-4 py-2 bg-blue-500 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2">
                  <FaGraduationCap className="text-sm" />
                  Skill Assessment
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  Post Job
                </button>
                <button className="px-4 py-2 bg-blue-500 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2">
                  <FaCalendar className="text-sm" />
                  Schedule ({metrics.interviewsScheduled})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {isCandidate ? (
          <>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Profile Strength</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  metrics.profileStrength >= 80 ? 'bg-green-500/20 text-green-400' :
                  metrics.profileStrength >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {metrics.profileStrength >= 80 ? 'Excellent' :
                   metrics.profileStrength >= 60 ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-2">{metrics.profileStrength}%</div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${metrics.profileStrength}%` }}
                />
              </div>
              <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                Complete Profile
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Job Matches</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  12 new
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-2">85% match rate</div>
              <p className="text-sm text-gray-400 mb-4">Based on your profile and preferences</p>
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                View Matches
              </button>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Next Interview</h3>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                  Tomorrow
                </span>
              </div>
              <div className="text-lg font-bold text-cyan-400 mb-2">Senior Frontend at TechCorp</div>
              <p className="text-sm text-gray-400 mb-4">2:00 PM PST • Virtual Interview</p>
              <button className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                Prepare Now
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Talent Pipeline</h3>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  25 new
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-2">{metrics.talentPoolSize} candidates</div>
              <p className="text-sm text-gray-400 mb-4">45 new applications today</p>
              <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                Review Pipeline
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Time to Hire</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  metrics.timeToHire <= 20 ? 'bg-green-500/20 text-green-400' :
                  metrics.timeToHire <= 30 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {metrics.timeToHire <= 20 ? 'Excellent' :
                   metrics.timeToHire <= 30 ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-2">{metrics.timeToHire} days</div>
              <p className="text-sm text-gray-400 mb-4">5 days faster than average</p>
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                Optimize Process
              </button>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Offer Success</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  metrics.offerAcceptanceRate >= 80 ? 'bg-green-500/20 text-green-400' :
                  metrics.offerAcceptanceRate >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {metrics.offerAcceptanceRate}% acceptance
                </span>
              </div>
              <div className="text-lg font-bold text-cyan-400 mb-2">3 offers pending</div>
              <p className="text-sm text-gray-400 mb-4">10% above industry average</p>
              <button className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                View Offers
              </button>
            </div>
          </>
        )}
      </div>

      {/* Quantum Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {quantumCards.map((card: any, index: number) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer group relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <card.icon className="text-2xl text-white" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">
                  {typeof card.value === 'number' ? 
                    (card.title === 'Time to Hire' ? `${card.value}d` : `${card.value}${card.title === 'Talent Pool' ? '' : '%'}`) 
                    : card.value}
                </span>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <span className={`text-xs ${card.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {card.trend}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
            </div>
            <h3 className="font-medium mb-1">{card.title}</h3>
            <p className="text-sm text-gray-400">{card.description}</p>
            
            {/* Benchmark Comparison */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-400">Industry Benchmark</span>
                <span className="text-purple-400">{card.benchmark}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${card.color}`}
                  style={{ width: card.benchmark }}
                />
              </div>
            </div>

            {/* Detailed Metrics Tooltip */}
            <div className="absolute inset-0 bg-gray-800 rounded-xl p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <h4 className="font-medium mb-4">Detailed Metrics</h4>
              <div className="space-y-3">
                {card.details.map((detail: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{detail.label}</span>
                    <span className="text-sm font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity and Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <div className="flex items-center gap-4">
              <select className="bg-gray-700 text-sm rounded-lg px-3 py-2 border border-gray-600">
                <option value="all">All Activities</option>
                <option value="high">High Priority</option>
                <option value="matches">Matches</option>
                <option value="alerts">Alerts</option>
              </select>
              <button className="text-sm text-purple-400 hover:text-purple-300">View All</button>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity: Activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'match'
                    ? 'bg-purple-500/20 text-purple-400'
                    : activity.type === 'insight'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {activity.type === 'match' ? (
                    <FaAtom className="text-lg" />
                  ) : activity.type === 'insight' ? (
                    <FaBrain className="text-lg" />
                  ) : (
                    <FaRegLightbulb className="text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-300">{activity.message}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activity.priority === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.priority === 'high' ? 'High Priority' : 'Info'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
                    >
                      {activity.action.label}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Role-specific Analytics Panel */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {isCandidate ? (
            <>
              <h2 className="text-xl font-bold mb-6">Career Analytics</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Profile Completion</span>
                    <span className="text-purple-400">{metrics.profileStrength}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.profileStrength}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Add your recent projects to improve your profile
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Application Success Rate</span>
                    <span className="text-blue-400">{metrics.applicationSuccess}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.applicationSuccess}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    15% higher than similar profiles
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Top Skills in Demand</h3>
                    <button className="text-xs text-purple-400 hover:text-purple-300">View All</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">React</span>
                      <span className="text-green-400 text-xs">+25%</span>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">TypeScript</span>
                      <span className="text-green-400 text-xs">+18%</span>
                      <span className="text-xs text-gray-500">high demand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">Node.js</span>
                      <span className="text-green-400 text-xs">+15%</span>
                      <span className="text-xs text-gray-500">trending</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Upcoming Interviews</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">Frontend Developer</div>
                          <div className="text-xs text-gray-400">TechCorp</div>
                        </div>
                        <span className="text-xs text-purple-400">Tomorrow, 2 PM</span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 text-sm text-purple-400 hover:text-purple-300 bg-purple-500/10 rounded-lg">
                      Prepare for Interview
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6">Hiring Analytics</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Time to Fill</span>
                    <span className="text-purple-400">{metrics.timeToHire} days</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.timeToHire / 30) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    5 days faster than industry average
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Offer Acceptance Rate</span>
                    <span className="text-blue-400">{metrics.offerAcceptanceRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.offerAcceptanceRate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    10% improvement from last quarter
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Pipeline Health</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm font-medium">Active Jobs</div>
                      <div className="text-2xl font-bold text-purple-400">12</div>
                      <div className="text-xs text-gray-500">+3 this week</div>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm font-medium">Total Candidates</div>
                      <div className="text-2xl font-bold text-blue-400">{metrics.talentPoolSize}</div>
                      <div className="text-xs text-gray-500">+25 new matches</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Priority Actions</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">Review Candidates</div>
                          <div className="text-xs text-gray-400">8 new applications</div>
                        </div>
                        <span className="text-xs text-yellow-400">High Priority</span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 text-sm text-purple-400 hover:text-purple-300 bg-purple-500/10 rounded-lg">
                      View All Tasks
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const JobMatchesTab = ({ isCandidate }: { isCandidate: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    location: 'all',
    experience: 'all',
    workStyle: 'all'
  })
  const [sortBy, setSortBy] = useState(isCandidate ? 'match' : 'date')
  const [showFilters, setShowFilters] = useState(false)

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: isCandidate ? 'Recommended' : 'Active',
      match: 95,
      applicants: 45,
      qualified: 12,
      interviewed: 5,
      salary: '$120k - $150k',
      location: 'San Francisco, CA',
      workStyle: 'Hybrid',
      experience: '5+ years',
      posted: '2024-03-15',
      deadline: '2024-04-15',
      requirements: ['React', 'TypeScript', 'Node.js'],
      description: 'Leading frontend development for our core products...',
      benefits: ['Health Insurance', '401k', 'Remote Work Options', 'Learning Budget']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupX',
      status: isCandidate ? 'New Match' : 'Draft',
      match: 88,
      applicants: 0,
      qualified: 0,
      interviewed: 0,
      salary: '$100k - $130k',
      location: 'Remote',
      workStyle: 'Remote',
      experience: '3-5 years',
      posted: null,
      deadline: null,
      requirements: ['Python', 'Django', 'React'],
      description: 'Building and scaling our web applications...',
      benefits: ['Equity', 'Flexible Hours', 'Home Office Budget']
    }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = 
      selectedFilters.location === 'all' || 
      job.location.toLowerCase().includes(selectedFilters.location.toLowerCase())

    const matchesExperience = 
      selectedFilters.experience === 'all' || 
      job.experience === selectedFilters.experience

    const matchesWorkStyle = 
      selectedFilters.workStyle === 'all' || 
      job.workStyle.toLowerCase() === selectedFilters.workStyle.toLowerCase()

    return matchesSearch && matchesLocation && matchesExperience && matchesWorkStyle
  }).sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.match - a.match
      case 'date':
        return new Date(b.posted || 0).getTime() - new Date(a.posted || 0).getTime()
      case 'salary':
        return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''))
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{isCandidate ? 'Recommended Jobs' : 'Job Listings'}</h2>
          <p className="text-sm text-gray-400">
            {filteredJobs.length} {isCandidate ? 'matches found' : 'active listings'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search and filters ... */}
        </div>
      </div>

      {/* ... rest of the component ... */}
    </div>
  )
}

const SkillsTab = () => {
  const skills = [
    { name: 'React', level: 90, trending: true },
    { name: 'TypeScript', level: 85, trending: true },
    { name: 'Node.js', level: 80, trending: false },
    { name: 'AWS', level: 75, trending: true }
  ]

  const recommendations = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      platform: 'Coursera',
      duration: '4 weeks',
      match: 95
    },
    {
      id: 2,
      title: 'System Design Interview Prep',
      platform: 'Udemy',
      duration: '6 weeks',
      match: 88
    }
  ]

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Your Skills</h2>
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{skill.name}</span>
                  {skill.trending && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Recommended Learning</h2>
        <div className="space-y-4">
          {recommendations.map(course => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-gray-400">
                  {course.platform} • {course.duration}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
                  {course.match}% Match
                </span>
                <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600">
                  Enroll
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TalentPoolTab = () => {
  const candidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Frontend Developer',
      match: 95,
      location: 'San Francisco, CA',
      experience: '8 years',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Full Stack Engineer',
      match: 88,
      location: 'Remote',
      experience: '5 years',
      skills: ['Python', 'Django', 'React']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Active Candidates</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">
            Filter
          </button>
          <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600">
            Bulk Actions
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {candidates.map(candidate => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">{candidate.name}</h3>
                <p className="text-gray-400">{candidate.title}</p>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                <FaAtom className="text-purple-400" />
                <span className="text-purple-400 font-medium">{candidate.match}% Match</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <FaMapMarkerAlt />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaBriefcase />
                <span>{candidate.experience}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">
                Save
              </button>
              <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600">
                Contact
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const HiringPipelineTab = () => {
  const stages = [
    {
      name: 'Applied',
      count: 45,
      candidates: [
        { name: 'John Doe', role: 'Frontend Developer', date: '2 days ago' },
        { name: 'Jane Smith', role: 'UX Designer', date: '3 days ago' }
      ]
    },
    {
      name: 'Screening',
      count: 12,
      candidates: [
        { name: 'Alex Johnson', role: 'Backend Developer', date: '1 day ago' }
      ]
    },
    {
      name: 'Interview',
      count: 8,
      candidates: [
        { name: 'Sarah Chen', role: 'Senior Developer', date: 'Today' }
      ]
    },
    {
      name: 'Offer',
      count: 3,
      candidates: [
        { name: 'Mike Wilson', role: 'Product Manager', date: 'Yesterday' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Hiring Pipeline</h2>
        <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600">
          Add Candidate
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stages.map(stage => (
          <div key={stage.name} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{stage.name}</h3>
              <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
                {stage.count}
              </span>
            </div>
            <div className="space-y-2">
              {stage.candidates.map((candidate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-gray-700/30 rounded-lg"
                >
                  <div className="font-medium text-sm">{candidate.name}</div>
                  <div className="text-xs text-gray-400">{candidate.role}</div>
                  <div className="text-xs text-gray-500 mt-1">{candidate.date}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ApplicationsTab = () => {
  const applications = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      status: 'In Review',
      appliedDate: '2024-03-15',
      lastUpdate: '2024-03-18'
    },
    {
      id: 2,
      company: 'InnovateSoft',
      position: 'Full Stack Engineer',
      status: 'Interview Scheduled',
      appliedDate: '2024-03-12',
      lastUpdate: '2024-03-17'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Applications</h2>
        <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600">
          Track New Application
        </button>
      </div>
      <div className="grid gap-4">
        {applications.map(app => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">{app.position}</h3>
                <p className="text-gray-400">{app.company}</p>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {app.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>Applied: {app.appliedDate}</div>
              <div>Last Update: {app.lastUpdate}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const InsightsTab = ({ isCandidate }: { isCandidate: boolean }) => {
  const candidateInsights = [
    {
      id: 1,
      category: 'Market Intelligence',
      insights: [
        {
          title: 'Skill Demand Surge',
          description: 'React Native skills demand increased by 45% in your area. Consider upskilling to increase job prospects.',
          impact: 'High',
          action: {
            label: 'View Courses',
            url: '/skills'
          },
          trend: '+45%',
          type: 'trend'
        },
        {
          title: 'Salary Benchmark',
          description: 'Your profile matches jobs offering 20% above your current target salary range.',
          impact: 'Medium',
          action: {
            label: 'View Jobs',
            url: '/jobs'
          },
          trend: '+20%',
          type: 'insight'
        }
      ]
    },
    {
      id: 2,
      category: 'Profile Optimization',
      insights: [
        {
          title: 'Application Success Predictor',
          description: 'Adding certifications can increase your match rate by 40%',
          impact: 'High',
          action: {
            label: 'Add Certification',
            url: '/profile/certifications'
          },
          trend: '+40%',
          type: 'improvement'
        },
        {
          title: 'Interview Success Pattern',
          description: 'Candidates with similar profiles succeed most in system design discussions.',
          impact: 'Medium',
          action: {
            label: 'Practice Now',
            url: '/interviews/prep'
          },
          type: 'insight'
        }
      ]
    },
    {
      id: 3,
      category: 'Career Growth',
      insights: [
        {
          title: 'Career Trajectory',
          description: 'Your experience aligns with Tech Lead roles. 3 skills gap identified.',
          impact: 'High',
          action: {
            label: 'View Roadmap',
            url: '/career-path'
          },
          type: 'insight'
        },
        {
          title: 'Learning Recommendation',
          description: 'Top performers in your target role are proficient in Kubernetes.',
          impact: 'Medium',
          action: {
            label: 'Start Learning',
            url: '/skills'
          },
          type: 'tip'
        }
      ]
    }
  ]

  const employerInsights = [
    {
      id: 1,
      category: 'Hiring Analytics',
      insights: [
        {
          title: 'Candidate Pool Quality',
          description: 'Recent applicants show 40% higher match rates compared to last quarter.',
          impact: 'High',
          action: {
            label: 'View Details',
            url: '/insights'
          },
          trend: '+40%',
          type: 'trend'
        },
        {
          title: 'Time-to-Hire Optimization',
          description: 'Reducing technical assessment time could speed up hiring by 25%.',
          impact: 'Medium',
          action: {
            label: 'Optimize Process',
            url: '/hiring'
          },
          trend: '-25%',
          type: 'insight'
        }
      ]
    },
    {
      id: 2,
      category: 'Market Intelligence',
      insights: [
        {
          title: 'Competitive Analysis',
          description: 'Your job offers are 15% above market rate, attracting senior talent.',
          impact: 'High',
          action: {
            label: 'View Report',
            url: '/insights'
          },
          trend: '+15%',
          type: 'insight'
        },
        {
          title: 'Skill Trends',
          description: 'Consider adding "React Native" to requirements - 60% of top candidates have this skill.',
          impact: 'Medium',
          action: {
            label: 'Update Jobs',
            url: '/jobs'
          },
          type: 'tip'
        }
      ]
    },
    {
      id: 3,
      category: 'Process Optimization',
      insights: [
        {
          title: 'Interview Efficiency',
          description: 'Technical interviews taking 30% longer than benchmark.',
          impact: 'High',
          action: {
            label: 'View Solutions',
            url: '/insights'
          },
          trend: '+30%',
          type: 'alert'
        },
        {
          title: 'Candidate Experience',
          description: 'Positive feedback on new assessment process, satisfaction up 20%.',
          impact: 'Medium',
          action: {
            label: 'View Feedback',
            url: '/insights'
          },
          trend: '+20%',
          type: 'insight'
        }
      ]
    }
  ]

  const insights = isCandidate ? candidateInsights : employerInsights

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
          <p className="text-gray-400">Personalized insights to optimize your {isCandidate ? 'job search' : 'hiring process'}</p>
        </div>
        <button className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 flex items-center gap-2">
          <FaDownload />
          Export Report
        </button>
      </div>

      <div className="space-y-6">
        {insights.map(category => (
          <div key={category.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-medium">{category.category}</h3>
            </div>
            <div className="p-6 grid gap-6">
              {category.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={`p-3 rounded-xl ${
                    insight.type === 'trend'
                      ? 'bg-purple-500/20 text-purple-400'
                      : insight.type === 'insight'
                      ? 'bg-blue-500/20 text-blue-400'
                      : insight.type === 'alert'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {insight.type === 'trend' ? (
                      <FaChartLine className="text-xl" />
                    ) : insight.type === 'insight' ? (
                      <FaBrain className="text-xl" />
                    ) : insight.type === 'alert' ? (
                      <FaExclamationTriangle className="text-xl" />
                    ) : (
                      <FaRegLightbulb className="text-xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      {insight.trend && (
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          insight.trend.startsWith('+')
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {insight.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.impact === 'High'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.impact} Impact
                      </span>
                      <button className="text-sm text-purple-400 hover:text-purple-300">
                        {insight.action.label} →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FaBell className="text-gray-400" />
              <span>Notification Preferences</span>
            </div>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">
              Configure
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <span>Profile Settings</span>
            </div>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FaCog className="text-gray-400" />
              <span>Account Settings</span>
            </div>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add loading skeleton component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-gray-800 rounded-xl"></div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-24 bg-gray-800 rounded-xl"></div>
      <div className="h-24 bg-gray-800 rounded-xl"></div>
      <div className="h-24 bg-gray-800 rounded-xl"></div>
    </div>
  </div>
)

// Add error state component
const ErrorState = ({ message, retry }: { message: string; retry: () => void }) => (
  <div className="text-center py-12">
    <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
    <p className="text-gray-400 mb-4">{message}</p>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
    >
      Try Again
    </button>
  </div>
)

// Add empty state component
const EmptyState = ({ message, action }: { message: string; action?: { label: string; onClick: () => void } }) => (
  <div className="text-center py-12">
    <FaRegLightbulb className="text-4xl text-purple-400 mx-auto mb-4" />
    <h3 className="text-xl font-bold mb-2">Nothing to see here yet</h3>
    <p className="text-gray-400 mb-4">{message}</p>
    {action && (
      <button 
        onClick={action.onClick}
        className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
)

// Add MobileNav component
const MobileNav = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode 
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 
        transform transition-transform duration-200 ease-in-out z-50
        lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {children}
      </div>
    </>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { type } = useParams()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  
  const roleParam = searchParams.get('role')
  const isCandidate = roleParam === 'candidate' || type === 'candidate'
  
  // Initialize with fixed values
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Keyboard shortcuts
  useHotkeys('mod+k', () => {
    // Toggle search
    toast('Search coming soon!')
  })
  
  useHotkeys('mod+j', () => {
    setActiveTab('job-matches')
  })
  
  useHotkeys('mod+/', () => {
    toast('Keyboard shortcuts: \n⌘+K: Search\n⌘+J: Job Matches\n⌘+/: Help')
  })

  // Update metrics only after component mounts (client-side)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setMetrics(generateMetrics(isCandidate))
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboard()
  }, [isCandidate])

  const handleLogout = () => {
    router.push('/auth/logout')
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    ...(isCandidate ? [
      { id: 'job-matches', label: 'Job Matches', icon: FaAtom },
      { id: 'applications', label: 'Applications', icon: FaBriefcase },
      { id: 'skills', label: 'Skills & Learning', icon: FaGraduationCap },
    ] : [
      { id: 'candidates', label: 'Talent Pool', icon: FaUsers },
      { id: 'jobs', label: 'Job Listings', icon: FaBriefcase },
      { id: 'hiring', label: 'Hiring Pipeline', icon: FaProjectDiagram },
    ]),
    { id: 'insights', label: 'AI Insights', icon: FaBrain },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  const quantumCards = getMetricCards(metrics, isCandidate)
  const recentActivities = getRecentActivities(isCandidate)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab metrics={metrics} recentActivities={recentActivities} quantumCards={quantumCards} isCandidate={isCandidate} />
      case 'job-matches':
      case 'jobs':
        return <JobMatchesTab isCandidate={isCandidate} />
      case 'applications':
        return <ApplicationsTab />
      case 'skills':
        return <SkillsTab />
      case 'candidates':
        return <TalentPoolTab />
      case 'hiring':
        return <HiringPipelineTab />
      case 'insights':
        return <InsightsTab isCandidate={isCandidate} />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab metrics={metrics} recentActivities={recentActivities} quantumCards={quantumCards} isCandidate={isCandidate} />
    }
  }

  // Close mobile nav when route/tab changes
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setIsMobileNavOpen(false)
  }, [])

  return (
    <div className={`min-h-screen text-white ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Jobly Q
          </h1>
          <p className="text-sm text-gray-400">
            {isCandidate ? 'Candidate Portal' : 'Employer Portal'}
          </p>
        </div>
        <button 
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isMobileNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Mobile Navigation Drawer */}
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-purple-500 text-white' 
                        : 'text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Settings and Logout */}
            <div className="border-t border-gray-700 p-4 space-y-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-gray-400 hover:bg-gray-700"
              >
                {theme === 'dark' ? <FaRegSun className="text-xl" /> : <FaRegMoon className="text-xl" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </MobileNav>

        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block w-64 border-r border-gray-700 p-4 bg-gray-800">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Jobly Q
            </h1>
            <p className="text-sm text-gray-400">
              {isCandidate ? 'Candidate Portal' : 'Employer Portal'}
            </p>
          </div>

          <nav className="space-y-2 mb-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings and Logout Section */}
          <div className="border-t border-gray-700 pt-4 space-y-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-gray-400 hover:bg-gray-700"
            >
              {theme === 'dark' ? <FaRegSun className="text-xl" /> : <FaRegMoon className="text-xl" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content - Adjusted for Mobile */}
        <div className="flex-1 p-4 lg:p-8 w-full">
          {isLoading ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorState 
              message={error} 
              retry={() => setError(null)} 
            />
          ) : (
            renderTabContent()
          )}
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  )
}