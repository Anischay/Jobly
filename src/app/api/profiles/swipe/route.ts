import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchingService } from '@/lib/services/matching'
import { auth } from '@clerk/nextjs'

export async function POST(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { jobListingId, direction } = await request.json()

    if (!jobListingId || !direction) {
      return NextResponse.json(
        { error: 'Job listing ID and swipe direction are required' },
        { status: 400 }
      )
    }

    // Record the swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        jobListingId,
        direction
      }
    })

    // If swiped right, create a match
    if (direction === 'right') {
      // Get job listing and user details with profile
      const [jobListing, user] = await Promise.all([
        prisma.jobListing.findUnique({ where: { id: jobListingId } }),
        prisma.user.findUnique({ 
          where: { id: userId },
          include: { profile: true }
        })
      ])

      if (!jobListing || !user || !user.profile || user.role !== 'CANDIDATE') {
        return NextResponse.json(
          { error: 'Job listing, candidate, or candidate profile not found' },
          { status: 404 }
        )
      }

      // Calculate match scores
      const matchingService = new MatchingService()
      const matchDetails = await matchingService.calculateMatchScore(user.profile, jobListing)

      // Create match record
      await prisma.match.create({
        data: {
          userId,
          jobListingId,
          overallScore: matchDetails.overallScore,
          skillMatch: matchDetails.skillMatch,
          experienceMatch: matchDetails.experienceMatch,
          cultureFit: matchDetails.cultureFit,
          status: 'PENDING'
        }
      })
    }

    return NextResponse.json({ success: true, swipe })
  } catch (error) {
    console.error('Error recording job swipe:', error)
    return NextResponse.json(
      { error: 'Failed to record job swipe' },
      { status: 500 }
    )
  }
} 
