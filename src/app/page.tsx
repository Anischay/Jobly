'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaBriefcase, FaSearch, FaUserTie, FaLightbulb, FaHandshake, FaRocket, FaBars, FaTimes, FaHeart, FaComments, FaStar, FaGraduationCap, FaPalette, FaCogs, FaArrowRight } from 'react-icons/fa'
import CountdownTimer from '@/components/CountdownTimer'
import MatchingSystem from '@/components/MatchingSystem'
import { JobCard } from '@/components/JobCard'
import { LearnMoreModal } from '@/components/LearnMoreModal'
import { 
  howItWorksContent, 
  featuresContent, 
  forRecruitersContent, 
  forCandidatesContent 
} from '@/data/learnMoreContent'
import { AnimatePresence } from 'framer-motion'

const sampleJob = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  type: 'Full-time',
  salary: '$120k - $180k',
  description: 'Join our team to build the next generation of web applications...',
  requirements: ['5+ years of React experience', 'Strong TypeScript skills'],
  responsibilities: ['Lead frontend development', 'Mentor junior developers'],
  benefits: ['Health insurance', 'Remote work options'],
  techStack: ['React', 'TypeScript', 'Next.js'],
  teamSize: '5-10',
  employeeCount: '50-200',
  companyInfo: {
    name: 'TechCorp',
    size: '50-200 employees',
    industry: 'Software Development',
    description: 'TechCorp is a leading software company...',
    culture: ['Innovation-driven', 'Collaborative', 'Growth-focused'],
    techStack: ['React', 'TypeScript', 'Next.js'],
    verified: true
  },
  imageUrl: '/company-placeholder.jpg',
  website: 'https://techcorp.com',
  linkedIn: 'https://linkedin.com/company/techcorp'
}

export default function LandingPage() {
  const router = useRouter()
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [activeModal, setActiveModal] = useState<'howItWorks' | 'features' | 'recruiters' | 'candidates' | string | null>(null)
  const [customModalContent, setCustomModalContent] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      title: "Smart Matching",
      description: "Our intelligent algorithm finds the perfect fit based on skills, experience, and cultural alignment.",
      icon: <FaLightbulb className="text-purple-400 text-2xl" />,
      gradient: "from-purple-500/20 to-blue-500/20",
      content: {
        sections: [
          {
            title: "AI-Powered Matching",
            description: "Our advanced matching system uses multiple data points to create perfect connections.",
            items: [
              "Skills-based matching with deep learning",
              "Experience level compatibility",
              "Cultural fit assessment",
              "Work style and preferences analysis",
              "Project history alignment"
            ]
          },
          {
            title: "Real-time Updates",
            description: "Stay informed with instant updates on your matches.",
            items: [
              "Instant match notifications",
              "Match strength indicators",
              "Compatibility scores",
              "Personalized recommendations",
              "Match quality feedback"
            ]
          }
        ]
      }
    },
    {
      title: "Interactive Profiles",
      description: "Showcase your personality and skills through video introductions and dynamic portfolios.",
      icon: <FaUserTie className="text-purple-400 text-2xl" />,
      gradient: "from-blue-500/20 to-purple-500/20",
      content: {
        sections: [
          {
            title: "Rich Media Profiles",
            description: "Create engaging profiles that showcase your true potential.",
            items: [
              "Video introductions",
              "Interactive portfolio showcase",
              "Skill visualization",
              "Achievement timeline",
              "Project demonstrations"
            ]
          },
          {
            title: "Verification System",
            description: "Build trust with verified credentials and experiences.",
            items: [
              "Skills assessment badges",
              "Work history verification",
              "Education credentials",
              "Project authenticity checks",
              "Peer endorsements"
            ]
          }
        ]
      }
    },
    {
      title: "Smart Collaboration",
      description: "Connect directly with potential matches and schedule interviews seamlessly.",
      icon: <FaHandshake className="text-purple-400 text-2xl" />,
      gradient: "from-purple-500/20 to-blue-500/20",
      content: {
        sections: [
          {
            title: "Seamless Communication",
            description: "Engage effectively with your matches through integrated tools.",
            items: [
              "In-app messaging system",
              "Video interview platform",
              "Calendar integration",
              "Document sharing",
              "Meeting scheduling"
            ]
          },
          {
            title: "Progress Tracking",
            description: "Monitor and manage your connections efficiently.",
            items: [
              "Connection status tracking",
              "Interview pipeline view",
              "Follow-up reminders",
              "Interaction history",
              "Feedback collection"
            ]
          }
        ]
      }
    }
  ]

  const featureBoxes = [
    {
      icon: <FaUserTie className="text-purple-400 text-3xl" />,
      title: "Create Your Profile",
      description: "Build your professional profile with skills, experience, and aspirations.",
      content: {
        sections: [
          {
            title: "Rich Profile Creation",
            description: "Create a comprehensive professional profile that stands out.",
            items: [
              "Add your professional experience and achievements",
              "Showcase your technical skills and certifications",
              "Upload portfolio projects with live demos",
              "Include a video introduction to personalize your profile",
              "Link your GitHub and LinkedIn profiles for verification"
            ]
          },
          {
            title: "Skill Assessment",
            description: "Validate your skills through our comprehensive assessment system.",
            items: [
              "Take skill-specific assessments",
              "Get badges for verified skills",
              "Complete coding challenges",
              "Showcase GitHub contributions and projects",
              "Receive endorsements from peers"
            ]
          }
        ]
      }
    },
    {
      icon: <FaSearch className="text-purple-400 text-3xl" />,
      title: "Smart Job Matching",
      description: "Get matched with opportunities that align with your skills and career goals.",
      content: {
        sections: [
          {
            title: "AI-Powered Matching",
            description: "Our advanced algorithms find the perfect job matches for you.",
            items: [
              "Skill-based job recommendations",
              "Culture fit analysis",
              "Salary range matching",
              "Location preferences",
              "Work style compatibility"
            ]
          }
        ]
      }
    },
    {
      icon: <FaHandshake className="text-purple-400 text-3xl" />,
      title: "Easy Applications",
      description: "Apply to jobs with a single click and track your applications.",
      content: {
        sections: [
          {
            title: "Streamlined Applications",
            description: "Apply to multiple jobs efficiently and track your progress.",
            items: [
              "One-click applications",
              "Application status tracking",
              "Interview scheduling",
              "Direct messaging with recruiters",
              "Automated follow-ups"
            ]
          }
        ]
      }
    }
  ]

  const industries = [
    {
      name: "Technology",
      icon: <FaRocket className="text-purple-400 text-3xl" />,
      jobCount: 1200
    },
    {
      name: "Healthcare",
      icon: <FaHeart className="text-purple-400 text-3xl" />,
      jobCount: 800
    },
    {
      name: "Finance",
      icon: <FaBriefcase className="text-purple-400 text-3xl" />,
      jobCount: 600
    },
    {
      name: "Education",
      icon: <FaGraduationCap className="text-purple-400 text-3xl" />,
      jobCount: 450
    },
    {
      name: "Marketing",
      icon: <FaSearch className="text-purple-400 text-3xl" />,
      jobCount: 350
    },
    {
      name: "Design",
      icon: <FaPalette className="text-purple-400 text-3xl" />,
      jobCount: 300
    },
    {
      name: "Sales",
      icon: <FaHandshake className="text-purple-400 text-3xl" />,
      jobCount: 400
    },
    {
      name: "Engineering",
      icon: <FaCogs className="text-purple-400 text-3xl" />,
      jobCount: 900
    }
  ]

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Industries', href: '#industries' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '#contact' }
  ]

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        const navHeight = 80 // Approximate nav height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - navHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    } else {
      router.push(href)
    }
    setShowMobileMenu(false)
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up', reason?: string) => {
    console.log(`Swiped ${direction}${reason ? ` with reason: ${reason}` : ''}`)
  }

  const modalContent = {
    howItWorks: {
      title: 'How It Works',
      content: howItWorksContent
    },
    features: {
      title: 'Platform Features',
      content: featuresContent
    },
    recruiters: {
      title: 'For Recruiters',
      content: forRecruitersContent
    },
    candidates: {
      title: 'For Candidates',
      content: forCandidatesContent
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0118] text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-gray-900/95 via-purple-900/95 to-gray-900/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-white">
                Jobly<span className="text-purple-500">.</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <button
                onClick={() => router.push('/auth/sign-in')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/sign-up')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleNavigation(item.href)
                      setShowMobileMenu(false)
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    router.push('/auth/sign-in')
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    router.push('/auth/sign-up')
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-white bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div id="hero" className="relative min-h-screen flex items-center justify-center pt-12">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-blue-900/30 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-conic from-purple-500/40 via-blue-500/40 to-purple-500/40"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-8"
            >
              <span className="inline-flex items-center px-6 py-2 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300">
                <FaStar className="mr-2 text-purple-400" />
                Revolutionizing Professional Connections
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl font-bold mb-6"
            >
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Where Career and
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Culture Connect
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-purple-100/80 mb-12 max-w-3xl mx-auto"
            >
              Experience job matching reimagined. Where AI meets human connection, 
              creating perfect matches based on skills, values, and aspirations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button
                onClick={() => router.push('/early-access')}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-lg font-medium overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform group-hover:translate-y-full" />
                <span className="relative">Get Early Access</span>
              </button>
              
              <button
                onClick={() => router.push('/demo')}
                className="group relative px-8 py-4 rounded-xl text-lg font-medium overflow-hidden transition-all hover:scale-105 border border-purple-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 transition-transform group-hover:translate-y-full" />
                <span className="relative">Watch Demo</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MatchingSystem Section */}
      <MatchingSystem />

      {/* Launch Countdown Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0118] to-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="relative">
          <CountdownTimer />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-[#0A0118]" />
        <div className="relative max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Revolutionizing Job Search
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-b ${feature.gradient} backdrop-blur-sm border border-purple-400/20 transform-gpu hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer`}
                onClick={() => {
                  setActiveModal('feature-' + index)
                  setCustomModalContent(feature.content)
                }}
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <motion.h3 
                  className="text-xl font-semibold text-white mb-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-purple-200/60">{feature.description}</p>
                <motion.div
                  className="mt-4 flex items-center text-purple-400 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Learn more
                  <FaArrowRight className="ml-2 text-xs" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0118] to-gray-900/50" />
        <div className="relative max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Featured Industries
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-400/20 text-center group hover:bg-purple-500/5 transition-all transform-gpu hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-all"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {industry.icon}
                </motion.div>
                <motion.h3 
                  className="text-lg font-semibold text-white mb-1"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {industry.name}
                </motion.h3>
                <p className="text-sm text-purple-200/60">{industry.jobCount}+ jobs</p>
                <motion.div
                  className="mt-3 text-purple-400 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 3 }}
                >
                  View jobs <FaArrowRight className="ml-2 text-xs" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section id="contact" className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-[#0A0118]" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center"
          >
            Ready to Transform Your Career Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-purple-200/80 mb-8"
          >
            Join the waitlist and be among the first to experience the future of job matching
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/early-access')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 font-medium"
            >
              Get Early Access
            </button>
            <button
              onClick={() => router.push('/demo')}
              className="px-8 py-3 bg-purple-500/10 text-purple-300 rounded-xl hover:bg-purple-500/20 font-medium border border-purple-400/30"
            >
              View Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Choose Your Role
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/demo/jobs')}
                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl hover:border-blue-500 transition-all transform hover:scale-105 flex items-center gap-4"
              >
                <FaSearch className="text-2xl text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">Job Seeker</div>
                  <div className="text-sm text-gray-400">Find your next opportunity</div>
                </div>
              </button>

              <button
                onClick={() => router.push('/demo/candidates')}
                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl hover:border-blue-500 transition-all transform hover:scale-105 flex items-center gap-4"
              >
                <FaBriefcase className="text-2xl text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">Recruiter</div>
                  <div className="text-sm text-gray-400">Find top talent</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Job Card Section */}
      <section id="job-card" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-[#0A0118]" />
        <div className="relative max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Featured Job
          </motion.h2>
          <JobCard job={sampleJob} onSwipe={handleSwipe} />
        </div>
      </section>

      {/* Modals */}
      {activeModal && (
        <LearnMoreModal
          isOpen={true}
          onClose={() => {
            setActiveModal(null)
            setCustomModalContent(null)
          }}
          title={activeModal.startsWith('feature-') 
            ? features[parseInt(activeModal.split('-')[1])].title 
            : modalContent[activeModal as keyof typeof modalContent].title}
          content={customModalContent || modalContent[activeModal as keyof typeof modalContent].content}
        />
      )}
    </div>
  )
} 