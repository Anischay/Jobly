import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const isTestMode = url.searchParams.get('test') === 'true'
    
    if (!isTestMode) {
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Get jobs based on authentication status
    if (isTestMode) {
      // For test mode, return all jobs without filtering
      const jobs = await prisma.jobListing.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })
      return NextResponse.json(jobs)
    } else {
      // Get user's previous swipes
      const swipedJobIds = await prisma.swipe.findMany({
        where: {
          userId: (await getServerSession(authOptions))!.user.id,
        },
        select: {
          jobListingId: true,
        },
      })

      // Get jobs that haven't been swiped on yet
      const jobs = await prisma.jobListing.findMany({
        where: {
          id: {
            notIn: swipedJobIds.map((swipe: { jobListingId: string }) => swipe.jobListingId),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })
      return NextResponse.json(jobs)
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
} 