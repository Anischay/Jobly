import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'

export async function GET(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { error: 'Invalid role. Must be employer.' },
        { status: 400 }
      )
    }

    // Get profiles that haven't been swiped by this employer
    const profiles = await prisma.profile.findMany({
      take: 10,
      where: {
        NOT: {
          swipes: {
            some: {
              userId: userId
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching profile recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
} 
