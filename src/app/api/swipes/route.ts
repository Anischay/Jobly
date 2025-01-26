import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const swipe = await prisma.swipe.create({
      data: {
        ...body,
        userId,
      },
    })
    return NextResponse.json(swipe)
  } catch (error) {
    console.error('Error creating swipe:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const swipes = await prisma.swipe.findMany({
      where: {
        userId,
      },
      include: {
        jobListing: true,
      },
    })
    return NextResponse.json(swipes)
  } catch (error) {
    console.error('Error fetching swipes:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 