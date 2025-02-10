import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    return NextResponse.json({
      clerkUserId: userId,
      dbUser: user,
      message: user ? 'User found in database' : 'User not found in database'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
