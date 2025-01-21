import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { jobId, direction } = await req.json()

    if (!jobId || !direction) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Record the swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId: session.user.id,
        jobListingId: jobId,
        direction,
      },
    })

    // If it's a right swipe, create a match
    if (direction === 'RIGHT') {
      await prisma.match.create({
        data: {
          userId: session.user.id,
          jobListingId: jobId,
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json(swipe)
  } catch (error) {
    console.error('Error recording swipe:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
} 