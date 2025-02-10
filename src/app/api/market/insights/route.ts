import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { dataPipeline } from '@/lib/data/DataPipeline'
import { z } from 'zod'

const querySchema = z.object({
  skills: z.array(z.string()).optional(),
  timeframe: z.enum(['1M', '3M', '6M', '1Y', 'ALL']).optional().default('3M'),
  region: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10)
})

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = {
      skills: searchParams.get('skills')?.split(','),
      timeframe: searchParams.get('timeframe'),
      region: searchParams.get('region'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    }

    const validatedParams = querySchema.parse(params)
    const insights = await dataPipeline.generateMarketInsights()

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error generating market insights:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
