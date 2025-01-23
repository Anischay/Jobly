'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import ProfileCard from '@/components/ProfileCard'

// Enhanced mock data for demo
const DEMO_JOBS = [
  {
    id: '1',
    name: "TechVision AI",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA (Remote)",
    imageUrl: "/companies/techvision.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    bio: "Join one of the fastest-growing AI companies building the future of autonomous systems. Backed by Y Combinator and top VCs with $50M+ funding. Featured in TechCrunch and Forbes 30 Under 30.",
    skills: [
      "Required Skills:",
      "React", "Node.js", "TypeScript", "Python",
      "TensorFlow", "AWS", "Kubernetes", "CI/CD"
    ],
    experience: [
      {
        id: 'e1',
        role: "Role Overview",
        company: "Position Details",
        location: "Remote",
        duration: "Full-time",
        description: "We're looking for a Senior Full Stack Developer to lead our core platform development.",
        achievements: [
          "Key Responsibilities:",
          "• Lead development of our next-gen AI platform",
          "• Design and implement scalable microservices",
          "• Mentor junior developers and drive technical decisions",
          "• Collaborate with ML teams on model deployment",
          
          "Requirements:",
          "• 5+ years of full-stack development experience",
          "• Strong expertise in React, Node.js, and TypeScript",
          "• Experience with AI/ML deployments",
          "• Track record of leading technical projects",
          
          "Nice to Have:",
          "• Experience with TensorFlow or PyTorch",
          "• Contributions to open-source projects",
          "• Previous startup experience"
        ],
        technologies: ["Technical Leadership", "Architecture", "Mentorship"],
        verified: true
      }
    ],
    projects: [
      {
        id: 'p1',
        title: "About TechVision AI",
        description: "We're building the future of autonomous systems with our AI platform that processes 1M+ images daily. Our solutions are trusted by 5 Fortune 500 automotive companies, and we've achieved 300% YoY growth.",
        technologies: ["AI/ML", "Enterprise", "Scale"],
        imageUrl: "/projects/techvision-product.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://techvision.ai/about",
        verified: true
      },
      {
        id: 'p2',
        title: "Engineering at TechVision",
        description: "Our engineering culture emphasizes autonomy, innovation, and continuous learning. We practice trunk-based development, maintain 90%+ test coverage, and deploy 50+ times per day.",
        technologies: ["DevOps", "Quality", "Autonomy"],
        imageUrl: "/projects/techvision-impact.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://techvision.ai/engineering",
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c1',
        name: "Compensation & Benefits",
        issuer: "What We Offer",
        date: "2024",
        achievements: [
          "Compensation:",
          "• Base salary: $180,000 - $250,000",
          "• Equity: 0.1% - 0.5%",
          "• Annual bonus based on performance",
          
          "Health & Wellness:",
          "• Premium health, dental, and vision coverage",
          "• Mental health support",
          "• Annual wellness stipend",
          
          "Work & Life:",
          "• Remote-first culture",
          "• Flexible working hours",
          "• Unlimited PTO (minimum 4 weeks)",
          "• Home office setup allowance"
        ],
        verified: true
      },
      {
        id: 'c2',
        name: "Growth & Culture",
        issuer: "Why Join Us",
        date: "2024",
        achievements: [
          "Professional Growth:",
          "• Clear path to Principal Engineer",
          "• $5,000 annual learning budget",
          "• Conference speaking opportunities",
          "• Patent bonus program",
          
          "Engineering Culture:",
          "• 20% time for innovation projects",
          "• Regular hackathons",
          "• Open source contributions",
          "• Strong documentation culture",
          
          "Team Culture:",
          "• Remote-first with async communication",
          "• No-meetings Wednesdays",
          "• Regular team retreats",
          "• Continuous feedback loops"
        ],
        verified: true
      }
    ],
    companyLinks: {
      website: "https://techvision.ai",
      linkedin: "https://linkedin.com/company/techvision-ai"
    }
  },
  {
    id: '2',
    name: "DesignCraft",
    title: "Lead Product Designer",
    location: "New York, NY (Hybrid)",
    imageUrl: "/companies/designcraft.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60",
    bio: "We're a design-first product studio crafting digital experiences for Fortune 500 companies and hot startups. Our work has won multiple Webby Awards and been featured in Fast Company.",
    skills: [
      "Required Skills:",
      "UI/UX Design", "Design Systems", "User Research",
      "Design Leadership", "Figma", "Design Ops"
    ],
    projects: [
      {
        id: 'p3',
        title: "Company Impact",
        description: "Our design work reaches 50M+ users globally. We've won 3 Webby Awards and helped clients achieve 40-60% improvement in key metrics.",
        technologies: ["Design Excellence", "Global Reach", "Impact"],
        imageUrl: "/projects/designcraft-work.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://designcraft.co/impact",
        verified: true
      },
      {
        id: 'p4',
        title: "Design Culture",
        description: "We foster a culture of experimentation and learning. Weekly design critiques, monthly workshops, and quarterly design sprints keep our team sharp.",
        technologies: ["Learning", "Collaboration", "Innovation"],
        imageUrl: "/projects/designcraft-impact.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://designcraft.co/culture",
        verified: true
      }
    ],
    experience: [
      {
        id: 'e2',
        role: "Role Impact",
        company: "What You'll Achieve",
        location: "Hybrid",
        duration: "First 12 Months",
        description: "Your impact as Lead Product Designer:",
        achievements: [
          "Shape the design strategy for Fortune 500 clients",
          "Build and scale our design system framework",
          "Lead and mentor a team of 4-6 designers",
          "Drive design process improvements",
          "Present to C-level stakeholders"
        ],
        technologies: ["Design Leadership", "Strategy", "Team Building"],
        verified: true
      }
    ],
    education: [
      {
        degree: "Growth & Development",
        institution: "Career Path",
        year: "2024+",
        achievements: [
          "Path to Design Director",
          "Monthly 1:1 mentorship",
          "Industry conference budget",
          "Design workshop facilitation",
          "Client presentation coaching",
          "Professional certification support"
        ]
      }
    ],
    certifications: [
      {
        id: 'c2',
        name: "Team Culture",
        issuer: "Design Values",
        date: "2024",
        achievements: [
          "Design-first mindset",
          "Weekly design critiques",
          "Monthly design workshops",
          "Quarterly design sprints",
          "Cross-functional collaboration",
          "User-centered processes"
        ],
        verified: true
      }
    ],
    companyLinks: {
      website: "https://designcraft.co",
      linkedin: "https://linkedin.com/company/designcraft"
    }
  }
]

export default function DemoJobsPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

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
              onClick={() => router.push('/demo')}
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
              isCompanyProfile={true}
            />
          )}
        </div>
      </div>
    </div>
  )
} 