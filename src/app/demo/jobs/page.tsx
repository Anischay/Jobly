'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import ProfileCard from '@/components/ProfileCard'

const DEMO_JOBS = [
  {
    id: '1',
    name: 'Senior Full Stack Engineer',
    title: 'Tech Corp',
    location: 'San Francisco, CA (Hybrid)',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=500&fit=crop',
    bio: 'We\'re looking for a Senior Full Stack Engineer to join our rapidly growing team. This role offers an exciting opportunity to work on cutting-edge technologies and shape the future of our platform.\n\nKey Responsibilities:\n• Lead development of new features from conception to deployment\n• Mentor junior developers and promote best practices\n• Collaborate with product and design teams\n• Optimize application performance and scalability\n\nTech Stack:\n• Frontend: React, TypeScript, Next.js\n• Backend: Node.js, PostgreSQL, Redis\n• Infrastructure: AWS, Docker, Kubernetes',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'System Design'],
    experience: [
      {
        id: 'exp1',
        role: 'Requirements',
        company: 'Experience & Skills',
        location: 'San Francisco, CA',
        duration: 'Full-time',
        description: 'What we\'re looking for in an ideal candidate:',
        achievements: [
          '• 5+ years of experience in full-stack development',
          '• Strong proficiency in React and Node.js',
          '• Experience with cloud services (AWS/GCP/Azure)',
          '• Knowledge of system design and scalability',
          '• Strong problem-solving and communication skills'
        ],
        technologies: ['Full Stack', 'Cloud', 'System Design'],
        verified: true
      }
    ],
    projects: [],
    education: [],
    certifications: [
      {
        id: 'cert1',
        name: 'Benefits & Perks',
        issuer: 'What we offer',
        date: '2024',
        verified: true,
        achievements: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Flexible PTO and remote work options',
          'Professional development budget',
          'Modern tech stack and tools'
        ]
      }
    ],
    isCompanyProfile: true,
    companyLinks: {
      website: 'https://techcorp.example',
      linkedin: 'https://linkedin.com/company/techcorp'
    }
  },
  {
    id: '2',
    name: 'Product Designer',
    title: 'Design Studio Inc',
    location: 'Remote (US)',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop',
    bio: 'Join our creative team as a Product Designer and help shape the future of digital experiences. We\'re looking for someone who combines creativity with user-centric thinking.\n\nRole Overview:\n• Create beautiful and functional user interfaces\n• Lead the design process from research to implementation\n• Collaborate with developers and stakeholders\n• Build and maintain our design system\n\nOur Design Philosophy:\n• User-centered approach\n• Data-driven decisions\n• Iterative design process\n• Focus on accessibility',
    skills: ['UI/UX', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Design Thinking'],
    experience: [
      {
        id: 'exp1',
        role: 'Requirements',
        company: 'Experience & Skills',
        location: 'Remote',
        duration: 'Full-time',
        description: 'What we\'re looking for in an ideal candidate:',
        achievements: [
          '• 3+ years of product design experience',
          '• Strong portfolio showcasing UI/UX work',
          '• Experience with modern design tools',
          '• Understanding of design systems',
          '• Excellent communication skills'
        ],
        technologies: ['UI/UX', 'Design Systems', 'Product Design'],
        verified: true
      }
    ],
    projects: [],
    education: [],
    certifications: [
      {
        id: 'cert1',
        name: 'Benefits & Culture',
        issuer: 'What we offer',
        date: '2024',
        verified: true,
        achievements: [
          'Competitive compensation package',
          'Remote-first culture',
          'Creative freedom and ownership',
          'Latest design tools and resources',
          'Regular team retreats'
        ]
      }
    ],
    isCompanyProfile: true,
    companyLinks: {
      website: 'https://designstudio.example',
      linkedin: 'https://linkedin.com/company/designstudio'
    }
  }
]

export default function DemoJobsPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSwipe = (direction: 'left' | 'right', reason?: string) => {
    console.log(`Swiped ${direction}${reason ? ` - Reason: ${reason}` : ''}`)
    if (currentIndex < DEMO_JOBS.length - 1) {
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
              Job Seeker View
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 pb-8 max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-md">
          {currentIndex < DEMO_JOBS.length && (
            <ProfileCard
              {...DEMO_JOBS[currentIndex]}
              onSwipe={handleSwipe}
            />
          )}
        </div>
      </div>
    </div>
  )
} 