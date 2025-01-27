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
        id: 'ecommerce',
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with real-time inventory management and payment processing.',
        technologies: ['React', 'Node.js', 'Stripe', 'Redis'],
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/alexthompson/ecommerce',
        verified: true
      },
      {
        id: 'ai-chat',
        title: 'AI-Powered Chat Application',
        description: 'Developed a real-time chat application with AI-powered language translation and sentiment analysis.',
        technologies: ['WebSocket', 'Python', 'TensorFlow', 'React'],
        imageUrl: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/alexthompson/ai-chat',
        verified: true
      }
    ],
    experience: [
      {
        id: 'techcorp',
        role: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        duration: '2020 - Present',
        description: 'Leading a team of 5 developers, architecting and implementing scalable web applications.',
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
        id: 'startupx',
        role: 'Full Stack Developer',
        company: 'StartupX',
        location: 'Remote',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple client projects using React and Node.js.',
        achievements: [
          'Built real-time analytics dashboard',
          'Improved data processing speed by 40%',
          'Implemented automated testing suite'
        ],
        technologies: ['Vue.js', 'Python', 'PostgreSQL'],
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
        id: 'aws-cert',
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
        id: 'gcp-cert',
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
    ],
    socialLinks: {
      github: 'https://github.com/alexthompson',
      linkedin: 'https://linkedin.com/in/alexthompson',
      portfolio: 'https://alexthompson.dev'
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
        id: 'wellness-app',
        title: 'Health & Wellness App',
        description: 'Designed and developed a mobile-first wellness tracking application with personalized insights.',
        technologies: ['React Native', 'Figma', 'Firebase'],
        imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/sarahchen/wellness-app',
        verified: true
      },
      {
        id: 'design-system',
        title: 'Design System',
        description: 'Created a comprehensive design system for a large enterprise application.',
        technologies: ['Storybook', 'React', 'Styled Components'],
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/sarahchen/design-system',
        verified: true
      }
    ],
    experience: [
      {
        id: 'designlab',
        role: 'Senior UI/UX Designer',
        company: 'DesignLab',
        location: 'New York, NY',
        duration: '2019 - Present',
        description: 'Leading design initiatives for enterprise clients and mentoring junior designers.',
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
        id: 'creative-agency',
        role: 'Frontend Developer',
        company: 'CreativeAgency',
        location: 'Remote',
        duration: '2017 - 2019',
        description: 'Implemented responsive web designs and interactive prototypes.',
        achievements: [
          'Improved app store rating from 3.8 to 4.6',
          'Reduced user onboarding time by 50%',
          'Implemented accessibility improvements'
        ],
        technologies: ['UI Design', 'Mobile Design', 'Accessibility'],
        verified: true
      }
    ],
    education: [
      {
        degree: 'BFA in Digital Design',
        institution: 'Parsons School of Design',
        year: '2017',
        achievements: [
          'Senior Thesis: Accessible Design Systems',
          'Design Excellence Award',
          'UX Research Club Founder'
        ]
      }
    ],
    certifications: [
      {
        id: 'google-ux',
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
        id: 'iaap-cert',
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
    ],
    socialLinks: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      portfolio: 'https://sarahchen.design'
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
        id: 'iac-framework',
        title: 'Infrastructure as Code Framework',
        description: 'Developed a comprehensive IaC framework for automating cloud infrastructure deployment.',
        technologies: ['Terraform', 'AWS', 'Python'],
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/mrodriguez/iac-framework',
        verified: true
      },
      {
        id: 'monitoring-dashboard',
        title: 'Monitoring Dashboard',
        description: 'Built a real-time monitoring dashboard for microservices infrastructure.',
        technologies: ['Grafana', 'Prometheus', 'ELK Stack'],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/mrodriguez/monitoring-dashboard',
        verified: true
      }
    ],
    experience: [
      {
        id: 'cloudtech',
        role: 'Senior DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Austin, TX',
        duration: '2021 - Present',
        description: 'Leading cloud infrastructure and DevOps initiatives for enterprise clients.',
        achievements: [
          'Reduced deployment time by 70%',
          'Implemented zero-downtime deployments',
          'Automated CI/CD pipelines',
          'Reduced cloud costs by 40%'
        ],
        technologies: ['AWS', 'Kubernetes', 'Terraform'],
        verified: true
      },
      {
        id: 'techstart',
        role: 'DevOps Engineer',
        company: 'TechStart Inc.',
        location: 'Remote',
        duration: '2019 - 2021',
        description: 'Implemented CI/CD pipelines and managed cloud infrastructure.',
        achievements: [
          'Built automated testing framework',
          'Implemented infrastructure monitoring',
          'Reduced system downtime by 60%'
        ],
        technologies: ['Docker', 'Jenkins', 'AWS'],
        verified: true
      }
    ],
    education: [
      {
        degree: 'MS in Computer Engineering',
        institution: 'University of Texas',
        year: '2019',
        achievements: [
          'Focus on Cloud Computing',
          'Research in Container Orchestration',
          'Teaching Assistant for DevOps Course'
        ]
      }
    ],
    certifications: [
      {
        id: 'aws-pro',
        name: 'AWS DevOps Professional',
        issuer: 'Amazon Web Services',
        date: '2023',
        verified: true,
        achievements: [
          'CI/CD pipelines',
          'Infrastructure automation',
          'Security best practices'
        ]
      },
      {
        id: 'cka',
        name: 'Certified Kubernetes Administrator',
        issuer: 'Cloud Native Computing Foundation',
        date: '2022',
        verified: true,
        achievements: [
          'Container orchestration',
          'Cluster management',
          'Application deployment'
        ]
      }
    ],
    socialLinks: {
      github: 'https://github.com/mrodriguez',
      linkedin: 'https://linkedin.com/in/mrodriguez',
      portfolio: 'https://mrodriguez.tech'
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
        id: 'fitness-app',
        title: 'Fitness Tracking App',
        description: 'Developed a comprehensive fitness tracking app with social features and workout plans.',
        technologies: ['Swift', 'Firebase', 'HealthKit'],
        imageUrl: 'https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/eparker/fitness-app',
        verified: true
      },
      {
        id: 'food-delivery',
        title: 'Food Delivery Platform',
        description: 'Built a cross-platform food delivery app with real-time order tracking.',
        technologies: ['React Native', 'Node.js', 'MongoDB'],
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
        liveUrl: 'https://github.com/eparker/food-delivery',
        verified: true
      }
    ],
    experience: [
      {
        id: 'appworks',
        role: 'Senior Mobile Developer',
        company: 'AppWorks Inc.',
        location: 'Seattle, WA',
        duration: '2020 - Present',
        description: 'Leading mobile app development projects and mentoring junior developers.',
        achievements: [
          'Led development of 3 major app releases',
          'Improved app performance by 40%',
          'Implemented CI/CD for mobile apps',
          'Mentored 4 junior developers'
        ],
        technologies: ['iOS', 'Swift', 'React Native'],
        verified: true
      },
      {
        id: 'mobilefirst',
        role: 'iOS Developer',
        company: 'MobileFirst',
        location: 'Remote',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple iOS applications.',
        achievements: [
          'Built 5+ successful App Store apps',
          'Achieved 4.8+ star ratings',
          'Implemented SwiftUI migration'
        ],
        technologies: ['iOS', 'Swift', 'SwiftUI'],
        verified: true
      }
    ],
    education: [
      {
        degree: 'BS in Software Engineering',
        institution: 'University of Washington',
        year: '2018',
        achievements: [
          'Mobile Development Focus',
          'Senior Project: AR Navigation App',
          'Mobile Dev Club President'
        ]
      }
    ],
    certifications: [
      {
        id: 'apple-cert',
        name: 'Apple Certified iOS Developer',
        issuer: 'Apple',
        date: '2023',
        verified: true,
        achievements: [
          'iOS app architecture',
          'Performance optimization',
          'App Store guidelines'
        ]
      },
      {
        id: 'react-native-cert',
        name: 'React Native Professional',
        issuer: 'Meta',
        date: '2022',
        verified: true,
        achievements: [
          'Cross-platform development',
          'Native modules',
          'Performance optimization'
        ]
      }
    ],
    socialLinks: {
      github: 'https://github.com/eparker',
      linkedin: 'https://linkedin.com/in/eparker',
      portfolio: 'https://emilyparker.dev'
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
    <div className="min-h-screen bg-[#0A0118] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Candidates
            </span>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Filter</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Sort</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8 max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-md">
          {currentIndex < sortedProfiles.length && (
            <ProfileCard
              {...sortedProfiles[currentIndex]}
              onSwipe={handleSwipe}
            />
          )}
        </div>
      </div>
    </div>
  )
} 