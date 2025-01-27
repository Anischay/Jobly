'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'

const sampleJobs = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $180,000',
    description: 'We are seeking an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications, collaborating with cross-functional teams, and mentoring junior developers.',
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      '5+ years of experience with React and Node.js',
      'Strong understanding of web technologies and best practices',
      'Experience with cloud platforms (AWS/Azure)',
      'Excellent problem-solving and communication skills'
    ],
    responsibilities: [
      'Design and implement scalable web applications',
      'Write clean, maintainable, and efficient code',
      'Collaborate with product managers and designers',
      'Mentor junior developers and conduct code reviews',
      'Participate in architectural decisions'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible work hours and remote options',
      'Professional development budget',
      'Generous vacation policy'
    ],
    companyInfo: {
      name: 'TechCorp Solutions',
      size: '50-200 employees',
      industry: 'Software Development',
      description: 'TechCorp Solutions is a leading software development company specializing in building innovative solutions for enterprise clients. We focus on creating cutting-edge applications that solve real-world problems.',
      culture: [
        'Innovation-driven environment',
        'Collaborative team culture',
        'Work-life balance focused',
        'Continuous learning encouraged'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop'
  },
  {
    id: '2',
    title: 'UX/UI Product Designer',
    company: 'DesignMind Creative',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90,000 - $140,000',
    description: "Join our award-winning design team in creating beautiful, intuitive interfaces for cutting-edge digital products. We're looking for a passionate designer who can transform complex problems into elegant solutions.",
    requirements: [
      "Bachelor's degree in Design, HCI, or related field",
      '3+ years of product design experience',
      'Strong portfolio demonstrating end-to-end design process',
      'Proficiency in Figma, Sketch, and prototyping tools',
      'Experience with design systems and component libraries'
    ],
    responsibilities: [
      'Lead the design process from concept to implementation',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Collaborate with engineers on implementation',
      'Maintain and evolve our design system'
    ],
    benefits: [
      'Competitive salary with annual bonus',
      'Comprehensive healthcare coverage',
      'Annual design conference allowance',
      'Creative workspace with latest equipment',
      'Flexible remote work options'
    ],
    companyInfo: {
      name: 'DesignMind Creative',
      size: '20-50 employees',
      industry: 'Design & Creative Services',
      description: 'DesignMind Creative is a boutique design agency known for creating exceptional digital experiences. We work with innovative startups and established brands to bring their visions to life.',
      culture: [
        'Design-first mindset',
        'Creative freedom',
        'Collaborative workspace',
        'Regular design workshops'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop'
  },
  {
    id: '3',
    title: 'Data Science Team Lead',
    company: 'Quantum Analytics',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$150,000 - $200,000',
    description: "Lead our data science initiatives in developing cutting-edge machine learning solutions. You'll guide a team of data scientists and collaborate with stakeholders to drive data-driven decision making across the organization.",
    requirements: [
      "Ph.D. or Master's in Computer Science, Statistics, or related field",
      '7+ years of experience in machine learning and data science',
      'Strong background in deep learning frameworks',
      'Experience leading and mentoring data science teams',
      'Published research or patents in ML/AI is a plus'
    ],
    responsibilities: [
      'Lead and mentor a team of 5-7 data scientists',
      'Develop and implement ML models and algorithms',
      'Drive research initiatives and innovation',
      'Collaborate with product and engineering teams',
      'Present findings to executive stakeholders'
    ],
    benefits: [
      'Top-tier compensation package',
      'Research publication opportunities',
      'Conference speaking opportunities',
      'Premium health and life insurance',
      'Stock options and annual bonus'
    ],
    companyInfo: {
      name: 'Quantum Analytics',
      size: '100-500 employees',
      industry: 'Artificial Intelligence & Machine Learning',
      description: 'Quantum Analytics is at the forefront of AI innovation, developing solutions that transform how businesses operate. Our research-driven approach has led to breakthrough discoveries in machine learning.',
      culture: [
        'Research-focused environment',
        'Innovation-driven culture',
        'Regular knowledge sharing sessions',
        'Work-life harmony'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=1200&h=800&fit=crop'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale Technologies',
    location: 'Austin, TX',
    type: 'Remote',
    salary: '$110,000 - $160,000',
    description: "Join our cloud infrastructure team in building and maintaining highly scalable, containerized applications. You'll work with cutting-edge technologies to automate deployment processes and optimize system performance.",
    requirements: [
      "Bachelor's degree in Computer Science or equivalent experience",
      '4+ years of experience with cloud platforms (AWS/GCP)',
      'Strong knowledge of Docker and Kubernetes',
      'Experience with CI/CD pipelines',
      'Infrastructure as Code experience (Terraform/CloudFormation)'
    ],
    responsibilities: [
      'Design and implement cloud infrastructure',
      'Automate deployment and scaling processes',
      'Monitor and optimize system performance',
      'Implement security best practices',
      'Provide on-call support as needed'
    ],
    benefits: [
      'Competitive remote salary',
      'Home office setup allowance',
      'Monthly internet stipend',
      'Learning and certification budget',
      'Flexible working hours'
    ],
    companyInfo: {
      name: 'CloudScale Technologies',
      size: '200-500 employees',
      industry: 'Cloud Infrastructure',
      description: "CloudScale Technologies specializes in cloud-native solutions that help businesses scale efficiently. We're committed to pushing the boundaries of cloud technology while maintaining reliability and security.",
      culture: [
        'Remote-first culture',
        'Asynchronous communication',
        'Continuous learning',
        'Results-oriented environment'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop'
  },
  {
    id: '5',
    title: 'Product Marketing Manager',
    company: 'InnovateX',
    location: 'Seattle, WA',
    type: 'Hybrid',
    salary: '$95,000 - $135,000',
    description: "Drive our product marketing strategy and execution for our suite of enterprise software solutions. You'll work closely with product, sales, and marketing teams to develop compelling narratives and go-to-market strategies.",
    requirements: [
      "Bachelor's degree in Marketing, Business, or related field",
      '5+ years of B2B product marketing experience',
      'Strong analytical and strategic thinking skills',
      'Excellent written and verbal communication',
      'Experience with marketing automation tools'
    ],
    responsibilities: [
      'Develop product positioning and messaging',
      'Create sales enablement materials',
      'Lead product launches and campaigns',
      'Analyze market trends and competition',
      'Generate customer insights and feedback'
    ],
    benefits: [
      'Performance-based bonuses',
      'Comprehensive benefits package',
      'Professional development fund',
      'Hybrid work schedule',
      'Company equity'
    ],
    companyInfo: {
      name: 'InnovateX',
      size: '500-1000 employees',
      industry: 'Enterprise Software',
      description: 'InnovateX creates enterprise software solutions that transform how businesses operate. Our products are used by Fortune 500 companies worldwide to streamline their operations.',
      culture: [
        'Customer-centric focus',
        'Data-driven decision making',
        'Cross-functional collaboration',
        'Innovation at scale'
      ]
    },
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop'
  }
]

export default function JobsPage() {
  const router = useRouter()
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [swipedJobs, setSwipedJobs] = useState<{[key: string]: 'left' | 'right'}>({})

  const handleSwipe = (direction: 'left' | 'right', reason?: string) => {
    const currentJob = sampleJobs[currentJobIndex]
    
    // Record the swipe
    setSwipedJobs(prev => ({
      ...prev,
      [currentJob.id]: direction
    }))

    // Log the action
    console.log(`Swiped ${direction} on job ${currentJob.id}${reason ? ` with reason: ${reason}` : ''}`)

    // Move to next job
    if (currentJobIndex < sampleJobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1)
    }
  }

  if (currentJobIndex >= sampleJobs.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No More Jobs</h2>
          <p className="text-gray-400 mb-8">You've viewed all available jobs.</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back Home
            </button>
            <button
              onClick={() => {
                setCurrentJobIndex(0)
                setSwipedJobs({})
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div className="text-gray-400">
              Job {currentJobIndex + 1} of {sampleJobs.length}
            </div>
          </div>
        </div>
      </div>

      {/* Job Card Section */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <JobCard job={sampleJobs[currentJobIndex]} onSwipe={handleSwipe} />
        </div>
      </div>
    </div>
  )
} 