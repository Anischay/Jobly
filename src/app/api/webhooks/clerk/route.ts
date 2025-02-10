import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function handler(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await request.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the event
  const eventType = evt.type;
  console.log(`Processing webhook event: ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(' ') || username || '';

    try {
      const user = await prisma.user.upsert({
        where: { id: id as string },
        create: {
          id: id as string,
          email: primaryEmail,
          name: name,
          image: image_url,
        },
        update: {
          email: primaryEmail,
          name: name,
          image: image_url,
        },
      });

      console.log('User upserted:', user.id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error upserting user:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { id: id as string },
      });

      console.log('User deleted:', id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
