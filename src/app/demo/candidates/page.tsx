'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa'
import { CandidateCard } from '@/components/CandidateCard'

// Mock candidate data
const DEMO_CANDIDATES = [
  {
    id: 'candidate1',
    name: 'Alex Chen',
    title: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    fallbackImageUrl: '/images/fallback-profile.jpg',
    about: 'Full stack engineer with 8+ years of experience building scalable web applications. Previously at Stripe and Google. Passionate about AI/ML and cloud architecture.',
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Stripe',
        duration: '2020 - Present',
        description: 'Leading the payments infrastructure team, building scalable solutions handling millions of transactions daily.',
        achievements: [
          'Led team of 5 engineers in rebuilding the payment processing pipeline',
          'Reduced system latency by 40% through innovative caching',
          'Implemented real-time fraud detection saving $10M+ annually'
        ],
        technologies: ['Go', 'Node.js', 'Python', 'Kubernetes', 'AWS'],
        verified: true
      },
      {
        role: 'Software Engineer',
        company: 'Google',
        duration: '2018 - 2020',
        description: 'Worked on Google Cloud Platform, focusing on serverless computing and container orchestration.',
        achievements: [
          'Developed key features for Cloud Functions service',
          'Improved deployment success rate by 25%',
          'Created internal tools used by 500+ engineers'
        ],
        technologies: ['Python', 'Go', 'Kubernetes', 'GCP'],
        verified: true
      }
    ],
    skills: [
      'React', 'Node.js', 'TypeScript', 'Python',
      'AWS', 'Kubernetes', 'TensorFlow', 'System Design'
    ],
    projects: [
      {
        id: 'trading-platform',
        title: 'AI-Powered Trading Platform',
        description: 'Built a real-time trading platform using machine learning to predict market trends. Processes $10M+ in daily transactions.',
        technologies: ['Python', 'TensorFlow', 'React', 'AWS'],
        imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://github.com/alexchen/trading-ai',
        verified: true
      },
      {
        id: 'collab-suite',
        title: 'Real-time Collaboration Suite',
        description: 'Developed an enterprise collaboration platform used by 100k+ users. Featured real-time editing and video conferencing.',
        technologies: ['WebRTC', 'Socket.io', 'Redis', 'Kubernetes'],
        imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://github.com/alexchen/collab-suite',
        verified: true
      }
    ],
    values: [
      'Passionate about building scalable and maintainable software that solves real-world problems.',
      'Strong advocate for clean code and best practices.',
      'Enjoy mentoring and knowledge sharing within the team.'
    ],
    githubStats: {
      contributions: 2547,
      repositories: 48,
      topLanguages: [
        { name: 'TypeScript', percentage: 40 },
        { name: 'Python', percentage: 35 },
        { name: 'Go', percentage: 25 }
      ]
    },
    socialLinks: {
      github: 'https://github.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
      portfolio: 'https://alexchen.dev'
    },
    matchScore: 95
  },
  {
    id: 'candidate2',
    name: 'Sarah Rodriguez',
    title: 'Senior Product Designer',
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    fallbackImageUrl: '/images/fallback-profile.jpg',
    about: 'Product designer with 6+ years of experience creating beautiful and functional digital experiences. Passionate about user-centered design and accessibility.',
    experience: [
      {
        role: 'Senior Product Designer',
        company: 'Airbnb',
        duration: '2021 - Present',
        description: 'Leading design for the core booking experience, improving conversion rates by 35%.',
        achievements: [
          'Led redesign of booking flow used by 150M+ users',
          'Increased mobile conversion rate by 35%',
          'Created design system used across company'
        ],
        technologies: ['Figma', 'Principle', 'Framer', 'React'],
        verified: true
      },
      {
        role: 'Product Designer',
        company: 'Spotify',
        duration: '2019 - 2021',
        description: 'Redesigned the mobile app experience, focusing on music discovery and user engagement.',
        achievements: [
          'Increased user engagement by 40%',
          'Reduced user complaints by 60%',
          'Won internal design award'
        ],
        technologies: ['Figma', 'After Effects', 'Protopie'],
        verified: true
      }
    ],
    skills: ['UI/UX Design', 'Design Systems', 'Figma', 'User Research', 'Prototyping', 'Motion Design'],
    projects: [
      {
        id: 'airbnb-redesign',
        title: 'Airbnb Booking Redesign',
        description: 'Led the redesign of the core booking flow, improving user experience and conversion rates by 35%. Implemented new design system.',
        technologies: ['Figma', 'Principle', 'Framer'],
        imageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://www.behance.net/sarahrodriguez/airbnb',
        verified: true
      },
      {
        id: 'spotify-mobile',
        title: 'Spotify Mobile App',
        description: 'Redesigned the music discovery experience, increasing user engagement by 40%. Focus on personalization and social features.',
        technologies: ['Figma', 'After Effects', 'ProtoPie'],
        imageUrl: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://www.behance.net/sarahrodriguez/spotify',
        verified: true
      }
    ],
    values: [
      'Believe in design that puts users first',
      'Advocate for accessibility and inclusive design',
      'Passionate about creating delightful user experiences'
    ],
    githubStats: {
      contributions: 856,
      repositories: 25,
      topLanguages: [
        { name: 'JavaScript', percentage: 45 },
        { name: 'HTML/CSS', percentage: 40 },
        { name: 'React', percentage: 15 }
      ]
    },
    socialLinks: {
      dribbble: 'https://dribbble.com/sarahrodriguez',
      linkedin: 'https://linkedin.com/in/sarahrodriguez',
      portfolio: 'https://sarahrodriguez.design',
      github: 'https://github.com/sarahrodriguez'
    },
    matchScore: 88
  },
  {
    id: 'candidate3',
    name: 'Michael Johnson',
    title: 'Senior DevOps Engineer',
    location: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop',
    fallbackImageUrl: '/images/fallback-profile.jpg',
    about: 'DevOps engineer with 7+ years of experience building and maintaining cloud infrastructure. Expert in automation and scalable systems.',
    experience: [
      {
        role: 'Senior DevOps Engineer',
        company: 'Amazon',
        duration: '2019 - Present',
        description: 'Leading cloud infrastructure for critical e-commerce systems, handling millions of requests.',
        achievements: [
          'Reduced infrastructure costs by 40%',
          'Improved system reliability to 99.99%',
          'Automated 90% of deployment processes'
        ],
        technologies: ['AWS', 'Kubernetes', 'Terraform', 'Python'],
        verified: true
      },
      {
        role: 'Cloud Engineer',
        company: 'Microsoft',
        duration: '2017 - 2019',
        description: 'Managed Azure cloud services and implemented infrastructure as code solutions.',
        achievements: [
          'Migrated 100+ services to Azure',
          'Reduced deployment time by 70%',
          'Created disaster recovery system'
        ],
        technologies: ['Azure', 'Terraform', 'Docker', 'Go'],
        verified: true
      }
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python', 'Go'],
    projects: [
      {
        id: 'cloud-migration',
        title: 'Cloud Migration Project',
        description: 'Led the migration of 200+ microservices to Kubernetes, improving reliability and reducing costs by 40%. Implemented automated scaling.',
        technologies: ['Kubernetes', 'Terraform', 'AWS', 'Prometheus'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://github.com/mjohnson/cloud-migration',
        verified: true
      },
      {
        id: 'devops-platform',
        title: 'Automated DevOps Platform',
        description: 'Built an internal platform for automated infrastructure provisioning and management. Used by 200+ engineers daily.',
        technologies: ['Go', 'Docker', 'Kubernetes', 'React'],
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
        liveUrl: 'https://github.com/mjohnson/devops-platform',
        verified: true
      }
    ],
    values: [
      'Committed to building reliable and secure systems',
      'Advocate for DevOps culture and practices',
      'Passionate about automation and efficiency'
    ],
    githubStats: {
      contributions: 1893,
      repositories: 35,
      topLanguages: [
        { name: 'Go', percentage: 45 },
        { name: 'Python', percentage: 35 },
        { name: 'Shell', percentage: 20 }
      ]
    },
    socialLinks: {
      github: 'https://github.com/mjohnson',
      linkedin: 'https://linkedin.com/in/mjohnson',
      portfolio: 'https://mjohnson.dev'
    },
    matchScore: 92
  }
]

export default function DemoCandidatesPage() {
  const router = useRouter()
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [swipedCandidates, setSwipedCandidates] = useState<string[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<typeof DEMO_CANDIDATES[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [inviteType, setInviteType] = useState<'coffee' | 'lunch'>('coffee')
  const [inviteNote, setInviteNote] = useState('')

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentCandidate = DEMO_CANDIDATES[currentCandidateIndex]
    
    setSwipedCandidates(prev => [...prev, currentCandidate.id])
    
    if (direction === 'right') {
      // Show success message or animation
      console.log('Liked candidate:', currentCandidate.name)
      // Move to next candidate
      if (currentCandidateIndex < DEMO_CANDIDATES.length - 1) {
        setCurrentCandidateIndex(prev => prev + 1)
      }
    } else if (direction === 'up') {
      setSelectedCandidate(currentCandidate)
      setShowInviteModal(true)
      return // Don't move to next candidate yet
    } else {
      // Move to next candidate for left swipe
      if (currentCandidateIndex < DEMO_CANDIDATES.length - 1) {
        setCurrentCandidateIndex(prev => prev + 1)
      }
    }
  }

  const handleSendInvite = () => {
    if (!selectedDate) return

    // In a real app, this would send the invite
    console.log('Sending invite to:', selectedCandidate?.name)
    console.log('Type:', inviteType)
    console.log('Date:', selectedDate)
    console.log('Note:', inviteNote)
    
    setShowInviteModal(false)
    setSelectedDate(null)
    setInviteType('coffee')
    setInviteNote('')
    
    // Move to next candidate after invite is sent
    if (currentCandidateIndex < DEMO_CANDIDATES.length - 1) {
      setCurrentCandidateIndex(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation('/demo')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              Back to Demo
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Recruiter Demo
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              Find Your Next Hire
            </h1>
            <p className="text-gray-400">
              Swipe right to connect, up to invite for coffee/lunch
            </p>
          </div>

          {currentCandidateIndex < DEMO_CANDIDATES.length ? (
            <div className="relative">
              <CandidateCard
                {...DEMO_CANDIDATES[currentCandidateIndex]}
                onSwipe={handleSwipe}
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-800/50 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">That's all for now!</h2>
              <p className="text-gray-400 mb-8">
                Ready to find your perfect candidates?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/early-access')}
                className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Join Early Access
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Coffee/Lunch Invite Modal */}
      {showInviteModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Invite {selectedCandidate.name} for Coffee/Lunch</h3>
            <div className="space-y-6">
              {/* Invite Type Selection */}
              <div className="flex gap-4">
                <button
                  onClick={() => setInviteType('coffee')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    inviteType === 'coffee'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="block text-center text-lg mb-2">☕</span>
                  <span className={`block text-center ${
                    inviteType === 'coffee' ? 'text-purple-400' : 'text-gray-400'
                  }`}>Coffee Chat</span>
                </button>
                <button
                  onClick={() => setInviteType('lunch')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    inviteType === 'lunch'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="block text-center text-lg mb-2">🍽️</span>
                  <span className={`block text-center ${
                    inviteType === 'lunch' ? 'text-purple-400' : 'text-gray-400'
                  }`}>Lunch Meeting</span>
                </button>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Select Date & Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Venue Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Venue</label>
                <input
                  type="text"
                  placeholder={inviteType === 'coffee' ? 'e.g. Starbucks on Market St' : 'e.g. Bistro on Main St'}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Personal Note */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Personal Note</label>
                <textarea
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-24"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowInviteModal(false)
                    setSelectedDate(null)
                    setInviteType('coffee')
                    setInviteNote('')
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={!selectedDate}
                  className="px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 