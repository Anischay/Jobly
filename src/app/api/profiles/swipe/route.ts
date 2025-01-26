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
    const { profileId, direction } = await request.json()

    if (!profileId || !direction) {
      return NextResponse.json(
        { error: 'Profile ID and swipe direction are required' },
        { status: 400 }
      )
    }

    // Record the swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        profileId,
        direction
      }
    })

    // If swiped right, create a match
    if (direction === 'right') {
      // Get profile and user details
      const [profile, user] = await Promise.all([
        prisma.profile.findUnique({ where: { id: profileId } }),
        prisma.user.findUnique({ where: { id: userId } })
      ])

      if (!profile || !user || user.role !== 'EMPLOYER') {
        return NextResponse.json(
          { error: 'Profile or employer not found' },
          { status: 404 }
        )
      }

      // Calculate match scores
      const matchingService = new MatchingService()
      const matchDetails = await matchingService.calculateMatchScore(profile, user.jobRequirements)

      // Create match record
      await prisma.match.create({
        data: {
          employerId: userId,
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
