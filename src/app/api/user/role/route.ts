import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { role } = await request.json();
    
    // Update user metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: role
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
