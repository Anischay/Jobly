import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { AnalyticsService } from '@/services/analytics'

const analyticsService = new AnalyticsService()

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { type, data } = body

    switch (type) {
      case 'interaction':
        await analyticsService.trackInteraction({
          userId,
          ...data,
          timestamp: new Date()
        })
        break
      
      case 'feature':
        await analyticsService.trackFeatureUsage({
          userId,
          ...data
        })
        break

      default:
        return new NextResponse('Invalid analytics type', { status: 400 })
    }

    return new NextResponse('Analytics recorded', { status: 200 })
  } catch (error) {
    console.error('Analytics error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const start = new Date(searchParams.get('start') || new Date().setDate(new Date().getDate() - 30))
    const end = new Date(searchParams.get('end') || new Date())

    let data
    switch (type) {
      case 'heatmap':
        data = await analyticsService.getInteractionHeatmap(userId, { start, end })
        break
      
      case 'features':
        data = await analyticsService.getFeatureAnalytics({ start, end })
        break

      default:
        return new NextResponse('Invalid analytics type', { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 