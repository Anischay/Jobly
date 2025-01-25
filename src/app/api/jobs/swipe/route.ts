import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchingService } from '@/lib/services/matching'

export async function POST(request: Request) {
  try {
    const { jobId, direction, test } = await request.json()

    if (!jobId || !direction) {
      return NextResponse.json(
        { error: 'Job ID and swipe direction are required' },
        { status: 400 }
      )
    }

    // For testing, use a fixed user ID
    const userId = test ? 'test-user-id' : null // TODO: Get from auth session
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Record the swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        jobListingId: jobId,
        direction
      }
    })

    // If swiped right, create a match
    if (direction === 'right') {
      // Get job and profile details
      const [job, profile] = await Promise.all([
        prisma.jobListing.findUnique({ where: { id: jobId } }),
        prisma.profile.findUnique({ where: { userId } })
      ])

      if (!job || !profile) {
        return NextResponse.json(
          { error: 'Job or profile not found' },
          { status: 404 }
        )
      }

      // Calculate match scores
      const matchingService = new MatchingService()
      const matchDetails = await matchingService.calculateMatchScore(profile, job)

      // Create match record
      await prisma.match.create({
        data: {
          userId,
          jobListingId: jobId,
          overallScore: matchDetails.overallScore,
          skillMatch: matchDetails.skillMatch,
          experienceMatch: matchDetails.experienceMatch,
          cultureFit: matchDetails.cultureFit,
          status: 'PENDING'
        }
      })

      // Increment applications count
      await prisma.jobListing.update({
        where: { id: jobId },
        data: { applicationsCount: { increment: 1 } }
      })
    }

    return NextResponse.json({ success: true, swipe })
  } catch (error) {
    console.error('Error recording swipe:', error)
    return NextResponse.json(
      { error: 'Failed to record swipe' },
      { status: 500 }
    )
  }
} 
