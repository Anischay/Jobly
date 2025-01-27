import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateMatchScore } from '@/lib/services/matching'

export async function POST(request: Request) {
  try {
    const { jobId, direction, userId } = await request.json()

    if (!jobId || !direction || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate direction
    if (!['left', 'right'].includes(direction)) {
      return NextResponse.json(
        { error: 'Invalid direction' },
        { status: 400 }
      )
    }

    // Get job and profile
    const [job, profile] = await Promise.all([
      prisma.jobListing.findUnique({
        where: { id: jobId }
      }),
      prisma.profile.findUnique({
        where: { userId }
      })
    ])

    if (!job || !profile) {
      return NextResponse.json(
        { error: 'Job or profile not found' },
        { status: 404 }
      )
    }

    // For right swipes, calculate match and create record
    if (direction === 'right') {
      // Calculate match score
      const matchScore = calculateMatchScore(job, profile)

      // Create match record
      await prisma.match.create({
        data: {
          userId: profile.userId,
          jobListingId: jobId,
          status: 'PENDING',
          overallScore: matchScore
        }
      })

      // Update job applications count
      await prisma.jobListing.update({
        where: { id: jobId },
        data: {
          applicationsCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        message: 'Match created successfully',
        matchScore
      })
    }

    // For left swipes, just record the interaction
    await prisma.swipe.create({
      data: {
        userId: profile.userId,
        jobListingId: jobId,
        direction
      }
    })

    return NextResponse.json({
      message: 'Swipe recorded successfully'
    })
  } catch (error) {
    console.error('Error in swipe handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
