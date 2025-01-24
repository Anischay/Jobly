'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import ProfileCard from '@/components/ProfileCard'

const DEMO_CANDIDATES = [
  {
    id: '1',
    name: 'Alex Thompson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    bio: 'Passionate developer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Looking for a role where I can lead technical initiatives and mentor junior developers.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
    experience: [
      {
        id: 'exp1',
        role: 'Senior Full Stack Developer',
        company: 'TechStart Inc',
        location: 'San Francisco, CA',
        duration: '2020 - Present',
        description: 'Leading development of a high-scale SaaS platform',
        achievements: [
          'Led team of 5 developers in rebuilding core platform',
          'Reduced API response times by 60%',
          'Implemented microservices architecture',
          'Mentored 3 junior developers'
        ],
        technologies: ['React', 'Node.js', 'AWS'],
        verified: true
      },
      {
        id: 'exp2',
        role: 'Full Stack Developer',
        company: 'DataCorp',
        location: 'Remote',
        duration: '2018 - 2020',
        description: 'Developed data visualization tools',
        achievements: [
          'Built real-time analytics dashboard',
          'Improved data processing speed by 40%',
          'Implemented automated testing suite'
        ],
        technologies: ['Vue.js', 'Python', 'PostgreSQL'],
        verified: true
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with real-time inventory management and payment processing.',
        technologies: ['React', 'Node.js', 'Stripe', 'Redis'],
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/alexthompson/ecommerce',
        verified: true
      },
      {
        id: 'p2',
        title: 'AI Chat Application',
        description: 'Developed a real-time chat application with AI-powered language translation and sentiment analysis.',
        technologies: ['WebSocket', 'Python', 'TensorFlow', 'React'],
        imageUrl: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/alexthompson/ai-chat',
        verified: true
      }
    ],
    education: [
      {
        degree: 'M.S. Computer Science',
        institution: 'Stanford University',
        year: '2018',
        achievements: [
          'Focus on Distributed Systems',
          'Research in Cloud Computing',
          'Teaching Assistant for Web Development'
        ]
      },
      {
        degree: 'B.S. Computer Science',
        institution: 'UC Berkeley',
        year: '2016',
        achievements: [
          'Dean\'s List 2014-2016',
          'Senior Project: Distributed Database System',
          'ACM Club President'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
        verified: true,
        achievements: [
          'Expertise in cloud architecture',
          'Microservices design patterns',
          'Serverless applications'
        ]
      },
      {
        id: 'cert2',
        name: 'Google Cloud Professional',
        issuer: 'Google',
        date: '2022',
        verified: true,
        achievements: [
          'Cloud infrastructure',
          'Container orchestration',
          'Cloud security'
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Senior Product Designer',
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    bio: 'Product designer with 5+ years of experience creating user-centered digital experiences. Passionate about accessibility and inclusive design. Looking for opportunities to shape product strategy and mentor junior designers.',
    skills: ['UI/UX', 'Design Systems', 'Figma', 'User Research', 'Prototyping', 'Design Strategy'],
    experience: [
      {
        id: 'exp1',
        role: 'Senior Product Designer',
        company: 'DesignHub',
        location: 'New York, NY',
        duration: '2021 - Present',
        description: 'Leading product design for enterprise SaaS platform',
        achievements: [
          'Redesigned core product increasing user engagement by 40%',
          'Built and maintained company-wide design system',
          'Led team of 3 designers',
          'Established user research program'
        ],
        technologies: ['Figma', 'Design Systems', 'User Research'],
        verified: true
      },
      {
        id: 'exp2',
        role: 'Product Designer',
        company: 'TechCo',
        location: 'Remote',
        duration: '2019 - 2021',
        description: 'Designed user interfaces for mobile applications',
        achievements: [
          'Improved app store rating from 3.8 to 4.6',
          'Reduced user onboarding time by 50%',
          'Implemented accessibility improvements'
        ],
        technologies: ['UI Design', 'Mobile Design', 'Accessibility'],
        verified: true
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Enterprise Design System',
        description: 'Created a comprehensive design system used by 50+ designers and developers.',
        technologies: ['Figma', 'React', 'Storybook'],
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/sarahjohnson/design-system',
        verified: true
      },
      {
        id: 'p2',
        title: 'Mobile Banking App',
        description: 'Led the redesign of a mobile banking app used by 1M+ users.',
        technologies: ['Mobile Design', 'User Research', 'Prototyping'],
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/sarahjohnson/banking-app',
        verified: true
      }
    ],
    education: [
      {
        degree: 'B.F.A. Interaction Design',
        institution: 'Rhode Island School of Design',
        year: '2019',
        achievements: [
          'Senior Thesis: Accessible Design Systems',
          'Design Excellence Award',
          'UX Research Club Founder'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert1',
        name: 'Google UX Design Professional',
        issuer: 'Google',
        date: '2023',
        verified: true,
        achievements: [
          'User-centered design process',
          'Design thinking methodology',
          'Responsive web design'
        ]
      },
      {
        id: 'cert2',
        name: 'Accessibility Specialist',
        issuer: 'IAAP',
        date: '2022',
        verified: true,
        achievements: [
          'Web accessibility standards',
          'Inclusive design patterns',
          'Accessibility testing'
        ]
      }
    ]
  }
]

export default function DemoCandidatesPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSwipe = (direction: 'left' | 'right', reason?: string) => {
    console.log(`Swiped ${direction}${reason ? ` - Reason: ${reason}` : ''}`)
    if (currentIndex < DEMO_CANDIDATES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
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
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Recruiter View
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 pb-8 max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-md">
          {currentIndex < DEMO_CANDIDATES.length && (
            <ProfileCard
              {...DEMO_CANDIDATES[currentIndex]}
              onSwipe={handleSwipe}
            />
          )}
        </div>
      </div>
    </div>
  )
} 