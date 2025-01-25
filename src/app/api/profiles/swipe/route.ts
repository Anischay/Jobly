import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchingService } from '@/lib/services/matching'

export async function POST(request: Request) {
  try {
    const { profileId, direction, test } = await request.json()

    if (!profileId || !direction) {
      return NextResponse.json(
        { error: 'Profile ID and swipe direction are required' },
        { status: 400 }
      )
    }

    // For testing, use a fixed recruiter ID
    const recruiterId = test ? 'test-recruiter-id' : null // TODO: Get from auth session
    if (!recruiterId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Record the swipe
    const swipe = await prisma.profileSwipe.create({
      data: {
        recruiterId,
        profileId,
        direction
      }
    })

    // If swiped right, create a match
    if (direction === 'right') {
      // Get profile and job details
      const [profile, recruiter] = await Promise.all([
        prisma.profile.findUnique({ where: { id: profileId } }),
        prisma.recruiter.findUnique({ where: { id: recruiterId } })
      ])

      if (!profile || !recruiter) {
        return NextResponse.json(
          { error: 'Profile or recruiter not found' },
          { status: 404 }
        )
      }

      // Calculate match scores
      const matchingService = new MatchingService()
      const matchDetails = await matchingService.calculateMatchScore(profile, recruiter.jobRequirements)

      // Create match record
      await prisma.profileMatch.create({
        data: {
          recruiterId,
          profileId,
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
    console.error('Error recording profile swipe:', error)
    return NextResponse.json(
      { error: 'Failed to record profile swipe' },
      { status: 500 }
    )
  }
} 
