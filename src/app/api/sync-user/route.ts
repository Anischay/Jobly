import { auth, currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 })
    }

    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || ''

    const user = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: primaryEmail,
        name: name,
        image: clerkUser.imageUrl,
      },
      update: {
        email: primaryEmail,
        name: name,
        image: clerkUser.imageUrl,
      },
    })

    return NextResponse.json({
      success: true,
      user,
      message: 'User synced successfully'
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ 
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
