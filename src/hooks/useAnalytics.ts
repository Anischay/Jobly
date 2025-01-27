import { useCallback } from 'react'

interface TrackInteractionParams {
  eventType: 'click' | 'scroll' | 'swipe' | 'search' | 'filter'
  targetId?: string
  targetType?: string
  metadata?: Record<string, any>
}

interface TrackFeatureParams {
  featureId: string
  successRate: number
  timeSpent: number
}

export function useAnalytics() {
  const trackInteraction = useCallback(async (params: TrackInteractionParams) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interaction',
          data: params
        })
      })
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }, [])

  const trackFeatureUsage = useCallback(async (params: TrackFeatureParams) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feature',
          data: params
        })
      })
    } catch (error) {
      console.error('Failed to track feature usage:', error)
    }
  }, [])

  const getAnalytics = useCallback(async (type: 'heatmap' | 'features', timeRange?: { start: Date; end: Date }) => {
    try {
      const params = new URLSearchParams({ type })
      if (timeRange) {
        params.append('start', timeRange.start.toISOString())
        params.append('end', timeRange.end.toISOString())
      }

      const response = await fetch(`/api/analytics?${params}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      return await response.json()
    } catch (error) {
      console.error('Failed to get analytics:', error)
      return null
    }
  }, [])

  return {
    trackInteraction,
    trackFeatureUsage,
    getAnalytics
  }
} 