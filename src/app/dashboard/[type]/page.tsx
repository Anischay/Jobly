'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaBriefcase, FaBuilding, FaUsers, FaChartLine, FaEnvelope, FaBell, FaCog } from 'react-icons/fa'
import { JobCard } from '@/components/JobCard'
import { CandidateCard } from '@/components/CandidateCard'

export default function DashboardPage() {
  const params = useParams()
  const type = params.type as 'candidate' | 'recruiter'

  const mockJobs = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      experience: '5+ years',
      logo: '/company-logos/tech-corp.png',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      postedAt: '2 days ago',
      description: 'We are seeking an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, collaborating with cross-functional teams, and mentoring junior developers.',
      requirements: ['5+ years of experience', 'Strong problem-solving skills', 'Team leadership'],
      benefits: ['Health insurance', '401k', 'Remote work'],
      teamSize: '10-20',
      techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
      workStyle: 'Hybrid',
      rating: 4.8,
      applicants: 45,
      culture: {
        values: ['Innovative', 'Collaborative', 'Fast-paced'],
        perks: ['Flexible hours', 'Learning opportunities', 'Team events']
      }
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      salary: '$90k - $120k',
      type: 'Full-time',
      experience: '3+ years',
      logo: '/company-logos/design-studio.png',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
      postedAt: '1 week ago',
      description: 'Join our creative team as a Product Designer. You will be responsible for creating beautiful and intuitive user interfaces, developing design systems, and conducting user research to inform design decisions.',
      requirements: ['3+ years of experience', 'Portfolio required', 'Strong communication'],
      benefits: ['Health insurance', 'Unlimited PTO', 'Learning budget'],
      teamSize: '5-10',
      techStack: ['Figma', 'Sketch', 'Adobe CC'],
      workStyle: 'Remote',
      rating: 4.5,
      applicants: 32,
      culture: {
        values: ['Creative', 'User-focused', 'Flexible'],
        perks: ['Creative workshops', 'Design conferences', 'Software licenses']
      }
    }
  ]

  const mockCandidates = [
    {
      id: '1',
      name: 'John Smith',
      title: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      experience: '8 years',
      education: 'MS in Computer Science',
      avatar: '/avatars/john.png',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
      rating: 4.9,
      availability: 'Available in 2 weeks',
      bio: 'Experienced developer with a passion for building scalable applications',
      achievements: ['Led team of 5 developers', 'Reduced deployment time by 50%']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Product Designer',
      location: 'New York, NY',
      experience: '5 years',
      education: 'BFA in Design',
      avatar: '/avatars/sarah.png',
      skills: ['UI/UX', 'Figma', 'Design Systems', 'User Research'],
      rating: 4.7,
      availability: 'Immediately available',
      bio: 'Creative designer focused on building intuitive user experiences',
      achievements: ['Redesigned core product', 'Increased user engagement by 40%']
    }
  ]

  const candidateStats = [
    { label: 'Applied Jobs', value: 12, icon: FaBriefcase },
    { label: 'Interviews', value: 3, icon: FaUsers },
    { label: 'Profile Views', value: 45, icon: FaChartLine }
  ]

  const recruiterStats = [
    { label: 'Active Jobs', value: 8, icon: FaBriefcase },
    { label: 'Total Applicants', value: 124, icon: FaUsers },
    { label: 'Interviews Scheduled', value: 12, icon: FaChartLine }
  ]

  const stats = type === 'candidate' ? candidateStats : recruiterStats

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">Jobly</div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <FaEnvelope className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white">
                <FaBell className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white">
                <FaCog className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {type === 'candidate' ? 'Recommended Jobs' : 'Active Job Listings'}
              </h2>
              <div className="space-y-6">
                {mockJobs.map((job) => (
                  <JobCard key={job.id} job={job} featured={job.id === '1'} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {type === 'recruiter' && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Top Candidates</h2>
                <div className="space-y-6">
                  {mockCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} featured={candidate.id === '1'} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {type === 'candidate' ? (
                  <>
                    <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600">
                      Update Profile
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                      Browse All Jobs
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                      View Applications
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600">
                      Post New Job
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                      View Applications
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                      Company Settings
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 