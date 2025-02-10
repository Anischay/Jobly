import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs'
import { SmartMatcher } from '@/lib/ai/SmartMatcher'
import { prisma } from '@/lib/prisma'

// Input validation schema
const matchRequestSchema = z.object({
  jobId: z.string().optional(),
  candidateId: z.string().optional(),
  filters: z.object({
    skills: z.array(z.string()).optional(),
    experience: z.number().min(0).optional(),
    location: z.string().optional(),
    jobType: z.string().optional()
  }).optional(),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10)
  }).optional()
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, candidateId, filters, pagination } = matchRequestSchema.parse(body)

    // If both jobId and candidateId are provided, calculate specific match
    if (jobId && candidateId) {
      const matchScore = await SmartMatcher.calculateMatchScore(jobId, candidateId)
      return NextResponse.json({ match: matchScore })
    }

    // If only jobId is provided, find matching candidates
    if (jobId) {
      const matches = await findMatchingCandidates(jobId, filters, pagination)
      return NextResponse.json(matches)
    }

    // If only candidateId is provided, find matching jobs
    if (candidateId) {
      const matches = await findMatchingJobs(candidateId, filters, pagination)
      return NextResponse.json(matches)
    }

    return NextResponse.json(
      { error: 'Either jobId or candidateId must be provided' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in job matching:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function findMatchingCandidates(
  jobId: string,
  filters?: z.infer<typeof matchRequestSchema>['filters'],
  pagination?: z.infer<typeof matchRequestSchema>['pagination']
) {
  const { page = 1, limit = 10 } = pagination || {}
  const skip = (page - 1) * limit

  // Get all candidates matching basic filters
  const whereClause = {
    AND: [
      filters?.skills
        ? {
            skills: {
              some: {
                skill: {
                  name: {
                    in: filters.skills.map(s => s.toLowerCase())
                  }
                }
              }
            }
          }
        : {},
      filters?.experience
        ? {
            profile: {
              totalYearsOfExperience: {
                gte: filters.experience
              }
            }
          }
        : {}
    ]
  }

  const [candidates, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        profile: true
      }
    }),
    prisma.user.count({ where: whereClause })
  ])

  // Calculate match scores for each candidate
  const matchPromises = candidates.map(async candidate => {
    const matchScore = await SmartMatcher.calculateMatchScore(jobId, candidate.id)
    return {
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        profile: candidate.profile
      },
      match: matchScore
    }
  })

  const matches = await Promise.all(matchPromises)

  // Sort by match score
  matches.sort((a, b) => b.match.total - a.match.total)

  return {
    matches,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit
    }
  }
}

async function findMatchingJobs(
  candidateId: string,
  filters?: z.infer<typeof matchRequestSchema>['filters'],
  pagination?: z.infer<typeof matchRequestSchema>['pagination']
) {
  const { page = 1, limit = 10 } = pagination || {}
  const skip = (page - 1) * limit

  // Get all jobs matching basic filters
  const whereClause = {
    AND: [
      filters?.skills
        ? {
            skills: {
              some: {
                skill: {
                  name: {
                    in: filters.skills.map(s => s.toLowerCase())
                  }
                }
              }
            }
          }
        : {},
      filters?.location
        ? {
            location: {
              contains: filters.location,
              mode: 'insensitive'
            }
          }
        : {},
      filters?.jobType
        ? { type: filters.jobType }
        : {}
    ]
  }

  const [jobs, total] = await Promise.all([
    prisma.jobListing.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    }),
    prisma.jobListing.count({ where: whereClause })
  ])

  // Calculate match scores for each job
  const matchPromises = jobs.map(async job => {
    const matchScore = await SmartMatcher.calculateMatchScore(job.id, candidateId)
    return {
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        skills: job.skills
      },
      match: matchScore
    }
  })

  const matches = await Promise.all(matchPromises)

  // Sort by match score
  matches.sort((a, b) => b.match.total - a.match.total)

  return {
    matches,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit
    }
  }
}
