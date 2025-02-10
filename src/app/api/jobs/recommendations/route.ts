import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchingService } from '@/lib/services/matching'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Recommendations API called')
    const { searchParams } = new URL(request.url)
    const test = searchParams.get('test') === 'true'
    const role = searchParams.get('role')
    
    console.log('Query params:', { test, role })

    // Mock recommendations for testing
    const mockRecommendations = [
      {
        job: {
          id: 'job1',
          title: 'Senior Full Stack Developer',
          company: 'TechCorp',
          location: 'San Francisco',
          type: 'FULL_TIME',
          salary: '$120k - $180k',
          workStyle: 'HYBRID',
          skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript'],
          experience: 5,
          benefits: ['Health Insurance', '401k', 'Remote Work Options', 'Unlimited PTO', 'Learning Budget'],
          description: 'We are seeking an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, collaborating with cross-functional teams, and mentoring junior developers.',
          createdAt: new Date().toISOString()
        },
        matchDetails: {
          overallScore: 85,
          skillMatch: 80,
          experienceMatch: 90,
          cultureFit: 85,
          matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
          missingSkills: ['AWS'],
          locationMatch: true,
          workStyleMatch: true
        }
      },
      {
        job: {
          id: 'job2',
          title: 'Frontend Engineer',
          company: 'InnovateLabs',
          location: 'Remote',
          type: 'FULL_TIME',
          salary: '$90k - $140k',
          workStyle: 'REMOTE',
          skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'],
          experience: 2,
          benefits: ['Flexible Hours', 'Learning Budget', 'Home Office Setup', '4-Day Work Week', 'Health Insurance'],
          description: 'Join our remote-first team as a Frontend Engineer. You will be building beautiful, responsive user interfaces using modern web technologies. We value creativity, attention to detail, and a passion for great user experiences.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        },
        matchDetails: {
          overallScore: 95,
          skillMatch: 100,
          experienceMatch: 100,
          cultureFit: 85,
          matchedSkills: ['JavaScript', 'React', 'TypeScript'],
          missingSkills: ['CSS', 'HTML'],
          locationMatch: true,
          workStyleMatch: false
        }
      },
      {
        job: {
          id: 'job3',
          title: 'Backend Developer',
          company: 'DataSystems',
          location: 'New York',
          type: 'FULL_TIME',
          salary: '$100k - $150k',
          workStyle: 'ONSITE',
          skills: ['Node.js', 'PostgreSQL', 'Python', 'Docker'],
          experience: 3,
          benefits: ['Health Insurance', 'Stock Options', 'Gym Membership', 'Annual Bonus', 'Professional Development'],
          description: 'DataSystems is looking for a Backend Developer to help scale our data processing infrastructure. You will work on high-performance APIs, database optimization, and cloud infrastructure using cutting-edge technologies.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        },
        matchDetails: {
          overallScore: 75,
          skillMatch: 70,
          experienceMatch: 100,
          cultureFit: 55,
          matchedSkills: ['Node.js', 'PostgreSQL'],
          missingSkills: ['Python', 'Docker'],
          locationMatch: false,
          workStyleMatch: false
        }
      }
    ]

    console.log('Sending mock recommendations')
    return NextResponse.json({ recommendations: mockRecommendations })
  } catch (error) {
    console.error('Error in job recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
} 
