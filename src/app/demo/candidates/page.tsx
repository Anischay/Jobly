'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import ProfileCard from '@/components/ProfileCard'

// Enhanced mock data for demo
const DEMO_CANDIDATES = [
  {
    id: '1',
    name: "Alex Chen",
    title: "Senior Full Stack Engineer",
    location: "San Francisco, CA",
    imageUrl: "/avatars/alex.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
    bio: "Full stack engineer with 8+ years of experience building scalable web applications. Previously at Stripe and Google. Passionate about AI/ML and cloud architecture.",
    skills: [
      "React", "Node.js", "TypeScript", "Python",
      "AWS", "Kubernetes", "TensorFlow", "System Design"
    ],
    projects: [
      {
        id: 'p1',
        title: "AI-Powered Trading Platform",
        description: "Built a real-time trading platform using machine learning to predict market trends. Processes $10M+ in daily transactions.",
        technologies: ["Python", "TensorFlow", "React", "AWS"],
        imageUrl: "/projects/alex-trading.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://github.com/alexchen/trading-ai",
        verified: true
      },
      {
        id: 'p2',
        title: "Real-time Collaboration Suite",
        description: "Developed an enterprise collaboration platform used by 100k+ users. Featured real-time editing and video conferencing.",
        technologies: ["WebRTC", "Socket.io", "Redis", "Kubernetes"],
        imageUrl: "/projects/alex-collab.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://github.com/alexchen/collab-suite",
        verified: true
      }
    ],
    experience: [
      {
        id: 'e1',
        role: "Senior Software Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        duration: "2020 - 2023",
        description: "Led the core payments infrastructure team, focusing on scalability and reliability",
        achievements: [
          "Technical Leadership:",
          "• Led team of 5 engineers in rebuilding the payment processing pipeline",
          "• Mentored 3 junior engineers to promotion in 18 months",
          "• Drove adoption of TypeScript across 15+ services",
          
          "System Architecture:",
          "• Designed microservices architecture processing $50B+ annually",
          "• Reduced system latency by 40% through innovative caching",
          "• Implemented real-time fraud detection saving $10M+ annually",
          
          "Development & Innovation:",
          "• Created internal testing framework used by 200+ engineers",
          "• Published 3 open-source tools with 1000+ GitHub stars",
          "• Filed 2 patents for payment processing innovations"
        ],
        technologies: [
          "Backend: Go, Node.js, Python",
          "Infrastructure: Kubernetes, AWS, Terraform",
          "Data: PostgreSQL, Redis, Kafka",
          "Practices: Microservices, DDD, TDD"
        ],
        verified: true
      },
      {
        id: 'e2',
        role: "Software Engineer",
        company: "Google",
        location: "Mountain View, CA",
        duration: "2018 - 2020",
        description: "Core member of Google Cloud Platform's infrastructure team",
        achievements: [
          "Technical Impact:",
          "• Built auto-scaling system handling 1M+ containers",
          "• Improved system reliability from 99.9% to 99.99%",
          "• Reduced infrastructure costs by 35% through optimization",
          
          "Project Leadership:",
          "• Led migration of 100+ services to Kubernetes",
          "• Coordinated with 5 teams across 3 time zones",
          "• Created technical documentation used by 1000+ developers",
          
          "Innovation & Recognition:",
          "• Received Google Spot Award for performance optimization",
          "• Contributed to 2 major open-source projects",
          "• Presented at 3 internal tech conferences"
        ],
        technologies: [
          "Languages: Java, Go, Python",
          "Cloud: GCP, Kubernetes, Docker",
          "Tools: Prometheus, Grafana, BigQuery",
          "Practices: SRE, DevOps, Agile"
        ],
        verified: true
      }
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2018",
        achievements: [
          "Focus on Machine Learning",
          "4.0 GPA",
          "Teaching Assistant for AI courses",
          "Published 2 research papers"
        ]
      },
      {
        degree: "B.S. Computer Science",
        institution: "UC Berkeley",
        year: "2016",
        achievements: [
          "Summa Cum Laude",
          "President of Coding Club",
          "Hackathon Winner"
        ]
      }
    ],
    certifications: [
      {
        id: 'c1',
        name: "AWS Solutions Architect Professional",
        issuer: "Amazon Web Services",
        date: "2023",
        verified: true
      },
      {
        id: 'c2',
        name: "Google Cloud Professional Architect",
        issuer: "Google",
        date: "2022",
        verified: true
      }
    ],
    socialLinks: {
      github: "https://github.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      portfolio: "https://alexchen.dev",
      twitter: "https://twitter.com/alexchen"
    }
  },
  {
    id: '2',
    name: "Sarah Johnson",
    title: "Lead Product Designer",
    location: "New York, NY",
    imageUrl: "/avatars/sarah.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
    bio: "Product designer with 6+ years of experience creating user-centered digital experiences. Previously at Airbnb and Google. Passionate about inclusive design and design systems.",
    skills: [
      "UI/UX Design", "Design Systems", "User Research",
      "Figma", "Design Leadership", "Prototyping"
    ],
    projects: [
      {
        id: 'p3',
        title: "Netflix Kids Redesign",
        description: "Led the redesign of Netflix's kids experience, improving engagement by 45% and reducing cognitive load for young users.",
        technologies: ["UI/UX", "Animation", "User Testing"],
        imageUrl: "/projects/sarah-netflix.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://dribbble.com/sarahjohnson/netflix",
        verified: true
      },
      {
        id: 'p4',
        title: "Inclusive Design System",
        description: "Created a comprehensive design system focused on accessibility, adopted by 20+ product teams serving 5M+ users.",
        technologies: ["Design Systems", "Accessibility", "Documentation"],
        imageUrl: "/projects/sarah-design-system.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://dribbble.com/sarahjohnson/design-system",
        verified: true
      }
    ],
    experience: [
      {
        id: 'e3',
        role: "Lead Product Designer",
        company: "Airbnb",
        location: "New York, NY",
        duration: "2021 - Present",
        description: "Leading design strategy for Airbnb's core booking experience",
        achievements: [
          "Design Leadership:",
          "• Led redesign of booking flow used by 150M+ users",
          "• Built and scaled design system used by 40+ designers",
          "• Mentored 4 designers to senior positions",
          
          "Product Impact:",
          "• Increased booking conversion by 25% through UX improvements",
          "• Reduced customer support tickets by 40%",
          "• Achieved 100% accessibility compliance score",
          
          "Innovation & Process:",
          "• Established new design critique framework",
          "• Created automated design QA process",
          "• Led 5 successful design sprints with stakeholders"
        ],
        technologies: [
          "Design: Figma, Framer, Principle",
          "Research: UserTesting, Maze, Hotjar",
          "Development: React, CSS, Animation",
          "Process: Design Ops, Design Systems"
        ],
        verified: true
      },
      {
        id: 'e4',
        role: "Senior Product Designer",
        company: "Google",
        location: "New York, NY",
        duration: "2019 - 2021",
        description: "Led design for Google Maps mobile experience",
        achievements: [
          "Design Innovation:",
          "• Redesigned navigation UI used by 1B+ users",
          "• Created new interaction patterns reducing errors by 60%",
          "• Won internal design award for accessibility features",
          
          "Research & Testing:",
          "• Conducted 200+ user testing sessions",
          "• Implemented A/B testing framework for design",
          "• Published internal case study on inclusive design",
          
          "Team Impact:",
          "• Mentored 3 junior designers",
          "• Created onboarding program for new designers",
          "• Led weekly design critiques for team of 12"
        ],
        technologies: [
          "Tools: Figma, Sketch, Adobe CC",
          "Prototyping: Framer, Principle",
          "Research: Mixed Methods, Analytics",
          "Standards: Material Design, WCAG"
        ],
        verified: true
      }
    ],
    education: [
      {
        degree: "M.F.A. Design",
        institution: "Rhode Island School of Design",
        year: "2019",
        achievements: [
          "Focus on Digital Experience Design",
          "Published thesis on inclusive design",
          "Teaching Assistant for UI/UX courses"
        ]
      },
      {
        degree: "B.F.A. Graphic Design",
        institution: "Parsons School of Design",
        year: "2017",
        achievements: [
          "Dean's List",
          "Best Portfolio Award",
          "Design Fellowship Recipient"
        ]
      }
    ],
    certifications: [
      {
        id: 'c3',
        name: "Google UX Design Professional Certificate",
        issuer: "Google",
        date: "2023",
        verified: true
      },
      {
        id: 'c4',
        name: "Certified Professional in Accessibility Core Competencies",
        issuer: "IAAP",
        date: "2022",
        verified: true
      }
    ],
    socialLinks: {
      dribbble: "https://dribbble.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      portfolio: "https://sarahjohnson.design",
      twitter: "https://twitter.com/sarahjohnson"
    }
  }
]

export default function DemoCandidatesPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

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
              onClick={() => router.push('/demo')}
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