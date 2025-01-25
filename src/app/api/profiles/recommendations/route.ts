import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEMO_CANDIDATES } from '@/data/demoCandidates'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isTestMode = url.searchParams.get('test') === 'true'
    const role = url.searchParams.get('role')

    if (!isTestMode) {
      // TODO: Add auth check here
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (role !== 'recruiter') {
      return NextResponse.json(
        { error: 'Invalid role. Must be recruiter.' },
        { status: 400 }
      )
    }

    // For test mode, return demo candidates
    if (isTestMode) {
      return NextResponse.json(DEMO_CANDIDATES)
    }

    // For production:
    // 1. Get recruiter's job requirements
    // 2. Get profiles that match those requirements
    // 3. Filter out already swiped profiles
    // 4. Calculate match scores
    // 5. Sort by match score
    // 6. Return top N profiles

    const profiles = await prisma.profile.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
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
