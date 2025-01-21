'use client'

import { useState } from 'react'
import ProfileCard from '@/components/ProfileCard'

// Sample profiles data
const SAMPLE_PROFILES = [
  {
    id: '1',
    name: 'Alex Thompson',
    title: 'Senior Full Stack Developer',
    bio: 'Passionate developer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.',
    location: 'San Francisco, CA',
    videoUrl: '/videos/alex-intro.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    resumeUrl: '/resumes/alex_thompson_resume.pdf',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with real-time inventory management and payment processing.',
        technologies: ['React', 'Node.js', 'Stripe', 'Redis'],
        link: 'https://github.com/alexthompson/ecommerce',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop'
      },
      {
        title: 'AI-Powered Chat Application',
        description: 'Developed a real-time chat application with AI-powered language translation and sentiment analysis.',
        technologies: ['WebSocket', 'Python', 'TensorFlow', 'React'],
        link: 'https://github.com/alexthompson/ai-chat',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop'
      }
    ],
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        duration: '2020 - Present',
        description: 'Leading a team of 5 developers, architecting and implementing scalable web applications.'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupX',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple client projects using React and Node.js.'
      }
    ],
    education: 'BS in Computer Science, Stanford University',
    links: {
      github: 'https://github.com/alexthompson',
      linkedin: 'https://linkedin.com/in/alexthompson',
      website: 'https://alexthompson.dev'
    }
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'UX/UI Designer & Frontend Developer',
    bio: 'Creative designer with a strong technical background. Passionate about creating beautiful and intuitive user experiences.',
    location: 'New York, NY',
    videoUrl: '/videos/sarah-intro.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    resumeUrl: '/resumes/sarah_chen_resume.pdf',
    skills: ['UI/UX Design', 'React', 'Figma', 'CSS', 'Animation', 'User Research'],
    projects: [
      {
        title: 'Health & Wellness App',
        description: 'Designed and developed a mobile-first wellness tracking application with personalized insights.',
        technologies: ['React Native', 'Figma', 'Firebase'],
        link: 'https://github.com/sarahchen/wellness-app',
        image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&h=300&fit=crop'
      },
      {
        title: 'Design System',
        description: 'Created a comprehensive design system for a large enterprise application.',
        technologies: ['Storybook', 'React', 'Styled Components'],
        link: 'https://github.com/sarahchen/design-system',
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&h=300&fit=crop'
      }
    ],
    experience: [
      {
        title: 'Senior UI/UX Designer',
        company: 'DesignLab',
        duration: '2019 - Present',
        description: 'Leading design initiatives for enterprise clients and mentoring junior designers.'
      },
      {
        title: 'Frontend Developer',
        company: 'CreativeAgency',
        duration: '2017 - 2019',
        description: 'Implemented responsive web designs and interactive prototypes.'
      }
    ],
    education: 'BFA in Digital Design, Parsons School of Design',
    links: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      website: 'https://sarahchen.design'
    }
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    title: 'DevOps Engineer',
    bio: 'DevOps enthusiast with a passion for automation and scalable infrastructure. Expert in cloud technologies and CI/CD pipelines.',
    location: 'Austin, TX',
    videoUrl: '/videos/marcus-intro.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    resumeUrl: '/resumes/marcus_rodriguez_resume.pdf',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python'],
    projects: [
      {
        title: 'Infrastructure as Code Framework',
        description: 'Developed a comprehensive IaC framework for automating cloud infrastructure deployment.',
        technologies: ['Terraform', 'AWS', 'Python'],
        link: 'https://github.com/mrodriguez/iac-framework',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop'
      },
      {
        title: 'Monitoring Dashboard',
        description: 'Built a real-time monitoring dashboard for microservices infrastructure.',
        technologies: ['Grafana', 'Prometheus', 'ELK Stack'],
        link: 'https://github.com/mrodriguez/monitoring-dashboard',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'
      }
    ],
    experience: [
      {
        title: 'Senior DevOps Engineer',
        company: 'CloudTech Solutions',
        duration: '2021 - Present',
        description: 'Leading cloud infrastructure and DevOps initiatives for enterprise clients.'
      },
      {
        title: 'DevOps Engineer',
        company: 'TechStart Inc.',
        duration: '2019 - 2021',
        description: 'Implemented CI/CD pipelines and managed cloud infrastructure.'
      }
    ],
    education: 'MS in Computer Engineering, University of Texas',
    links: {
      github: 'https://github.com/mrodriguez',
      linkedin: 'https://linkedin.com/in/mrodriguez',
      website: 'https://mrodriguez.tech'
    }
  },
  {
    id: '4',
    name: 'Emily Parker',
    title: 'Mobile App Developer',
    bio: 'Mobile development specialist with expertise in iOS and React Native. Passionate about creating seamless mobile experiences.',
    location: 'Seattle, WA',
    videoUrl: '/videos/emily-intro.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    resumeUrl: '/resumes/emily_parker_resume.pdf',
    skills: ['iOS', 'Swift', 'React Native', 'Firebase', 'UI/UX', 'App Store'],
    projects: [
      {
        title: 'Fitness Tracking App',
        description: 'Developed a comprehensive fitness tracking app with social features and workout plans.',
        technologies: ['Swift', 'Firebase', 'HealthKit'],
        link: 'https://github.com/eparker/fitness-app',
        image: 'https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=500&h=300&fit=crop'
      },
      {
        title: 'Food Delivery Platform',
        description: 'Built a cross-platform food delivery app with real-time order tracking.',
        technologies: ['React Native', 'Node.js', 'MongoDB'],
        link: 'https://github.com/eparker/food-delivery',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop'
      }
    ],
    experience: [
      {
        title: 'Senior Mobile Developer',
        company: 'AppWorks Inc.',
        duration: '2020 - Present',
        description: 'Leading mobile app development projects and mentoring junior developers.'
      },
      {
        title: 'iOS Developer',
        company: 'MobileFirst',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple iOS applications.'
      }
    ],
    education: 'BS in Software Engineering, University of Washington',
    links: {
      github: 'https://github.com/eparker',
      linkedin: 'https://linkedin.com/in/eparker',
      website: 'https://emilyparker.dev'
    }
  }
]

// Simulated matching algorithm (would be replaced with actual implementation)
const calculateMatchScore = (profile: typeof SAMPLE_PROFILES[0]) => {
  // This would be replaced with actual quantum-inspired matching algorithm
  const scores = {
    skillMatch: Math.random() * 100,
    cultureFit: Math.random() * 100,
    experienceAlign: Math.random() * 100,
    overallScore: 0
  }
  scores.overallScore = (scores.skillMatch + scores.cultureFit + scores.experienceAlign) / 3
  return scores
}

export default function CandidatesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sortBy, setSortBy] = useState<'match' | 'cultural' | 'skill' | 'recent'>('match')
  const [filters, setFilters] = useState({
    careerStage: 'all', // emerging, established, leader, all
    roleType: 'all', // technical, creative, management, all
    matchThreshold: 70, // minimum match percentage
    culturalValues: [] as string[] // values alignment
  })

  // Enhanced sorting with match scores
  const sortedProfiles = [...SAMPLE_PROFILES].sort((a, b) => {
    const scoreA = calculateMatchScore(a)
    const scoreB = calculateMatchScore(b)

    switch (sortBy) {
      case 'match':
        return scoreB.overallScore - scoreA.overallScore
      case 'cultural':
        return scoreB.cultureFit - scoreA.cultureFit
      case 'skill':
        return scoreB.skillMatch - scoreA.skillMatch
      case 'recent':
        return b.id.localeCompare(a.id)
      default:
        return 0
    }
  }).filter(profile => {
    const score = calculateMatchScore(profile)
    return score.overallScore >= filters.matchThreshold
  })

  const handleSwipe = (direction: 'left' | 'right', reason?: string) => {
    console.log(`Swiped ${direction}${reason ? ` with reason: ${reason}` : ''}`)
    
    if (currentIndex < sortedProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Discover Your Perfect Match
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Match Quality Indicator */}
            {sortedProfiles[currentIndex] && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-purple-400 font-medium">
                      {Math.round(calculateMatchScore(sortedProfiles[currentIndex]).overallScore)}% Match
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Sorting Options */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={() => setSortBy('match')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortBy === 'match'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-purple-500/20'
                }`}
              >
                Overall Match
              </button>
              <button
                onClick={() => setSortBy('cultural')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortBy === 'cultural'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-purple-500/20'
                }`}
              >
                Cultural Fit
              </button>
              <button
                onClick={() => setSortBy('skill')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortBy === 'skill'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-purple-500/20'
                }`}
              >
                Skill Match
              </button>
            </div>

            {/* Refined Filters */}
            <div className="flex justify-center gap-4 flex-wrap">
              <select
                value={filters.careerStage}
                onChange={(e) => setFilters({...filters, careerStage: e.target.value})}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-purple-500/20 focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Any Career Stage</option>
                <option value="emerging">Emerging Talent (0-3 years)</option>
                <option value="established">Established Professional (3-8 years)</option>
                <option value="leader">Industry Leader (8+ years)</option>
              </select>

              <select
                value={filters.roleType}
                onChange={(e) => setFilters({...filters, roleType: e.target.value})}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-purple-500/20 focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Any Role Type</option>
                <option value="technical">Technical/Engineering</option>
                <option value="creative">Creative/Design</option>
                <option value="management">Leadership/Management</option>
              </select>

              {/* Match Quality Threshold */}
              <div className="w-full flex items-center gap-4 px-4">
                <span className="text-gray-400 text-sm">Min Match:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.matchThreshold}
                  onChange={(e) => setFilters({...filters, matchThreshold: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-purple-400 text-sm font-medium">{filters.matchThreshold}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profiles Display */}
        <div className="max-w-2xl mx-auto relative h-[600px]">
          {sortedProfiles.length === 0 ? (
            <div className="text-center text-gray-400 mt-8 p-8 rounded-lg border border-purple-500/20 bg-gray-800/50">
              <p className="text-lg mb-2">No matches found above {filters.matchThreshold}% threshold</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or lowering the match threshold</p>
            </div>
          ) : (
            sortedProfiles.map((profile, index) => (
              <div
                key={profile.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentIndex 
                    ? 'opacity-100 z-10 scale-100 rotate-0' 
                    : 'opacity-0 -z-10 scale-95 rotate-3'
                }`}
              >
                <ProfileCard
                  {...profile}
                  projects={profile.projects.map(p => ({
                    id: p.title.toLowerCase().replace(/\s+/g, '-'),
                    title: p.title,
                    description: p.description,
                    technologies: p.technologies,
                    imageUrl: p.image,
                    liveUrl: p.link,
                    verified: true
                  }))}
                  experience={profile.experience.map(e => ({
                    id: `${e.company}-${e.title}`.toLowerCase().replace(/\s+/g, '-'),
                    role: e.title,
                    company: e.company,
                    location: profile.location,
                    duration: e.duration,
                    description: e.description,
                    achievements: [],
                    technologies: [],
                    verified: true
                  }))}
                  education={[{
                    degree: profile.education.split(',')[0].trim(),
                    institution: profile.education.split(',')[1].trim(),
                    year: '2020',
                    achievements: []
                  }]}
                  socialLinks={{
                    github: profile.links.github,
                    linkedin: profile.links.linkedin,
                    portfolio: profile.links.website
                  }}
                  onSwipe={handleSwipe}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 