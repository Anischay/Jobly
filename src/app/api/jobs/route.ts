import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const jobs = await prisma.jobListing.findMany({
      include: {
        user: true,
      },
    })
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const job = await prisma.jobListing.create({
      data: {
        ...body,
        userId: userId,
      },
    })
    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 