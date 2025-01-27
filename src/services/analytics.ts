import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface UserInteraction {
  userId: string
  eventType: 'click' | 'scroll' | 'swipe' | 'search' | 'filter'
  targetId?: string
  targetType?: string
  metadata?: Record<string, any>
  timestamp: Date
}

interface FeatureUsage {
  featureId: string
  userId: string
  usageCount: number
  lastUsed: Date
  successRate: number
  timeSpent: number
}

export class AnalyticsService {
  // Track individual user interactions
  async trackInteraction(interaction: UserInteraction) {
    try {
      await prisma.userInteraction.create({
        data: {
          userId: interaction.userId,
          eventType: interaction.eventType,
          targetId: interaction.targetId,
          targetType: interaction.targetType,
          metadata: interaction.metadata,
          timestamp: interaction.timestamp
        }
      })
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }

  // Track feature usage
  async trackFeatureUsage(usage: Omit<FeatureUsage, 'usageCount' | 'lastUsed'>) {
    try {
      await prisma.featureUsage.upsert({
        where: {
          userId_featureId: {
            userId: usage.userId,
            featureId: usage.featureId
          }
        },
        update: {
          usageCount: { increment: 1 },
          lastUsed: new Date(),
          successRate: usage.successRate,
          timeSpent: usage.timeSpent
        },
        create: {
          userId: usage.userId,
          featureId: usage.featureId,
          usageCount: 1,
          lastUsed: new Date(),
          successRate: usage.successRate,
          timeSpent: usage.timeSpent
        }
      })
    } catch (error) {
      console.error('Failed to track feature usage:', error)
    }
  }

  // Get user interaction heatmap data
  async getInteractionHeatmap(userId: string, timeRange: { start: Date; end: Date }) {
    try {
      const interactions = await prisma.userInteraction.findMany({
        where: {
          userId,
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      })

      return this.processHeatmapData(interactions)
    } catch (error) {
      console.error('Failed to get interaction heatmap:', error)
      return []
    }
  }

  // Get feature usage analytics
  async getFeatureAnalytics(timeRange: { start: Date; end: Date }) {
    try {
      const usageData = await prisma.featureUsage.findMany({
        where: {
          lastUsed: {
            gte: timeRange.start,
            lte: timeRange.end
          }
        },
        orderBy: {
          usageCount: 'desc'
        }
      })

      return this.processFeatureAnalytics(usageData)
    } catch (error) {
      console.error('Failed to get feature analytics:', error)
      return []
    }
  }

  private processHeatmapData(interactions: any[]) {
    // Process raw interaction data into heatmap format
    const heatmapData = interactions.reduce((acc, interaction) => {
      const key = `${interaction.targetType}-${interaction.targetId}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(heatmapData).map(([key, value]) => ({
      target: key,
      intensity: value
    }))
  }

  private processFeatureAnalytics(usageData: any[]) {
    return usageData.map(usage => ({
      featureId: usage.featureId,
      totalUsage: usage.usageCount,
      averageSuccessRate: usage.successRate,
      averageTimeSpent: usage.timeSpent,
      lastUsed: usage.lastUsed
    }))
  }
} 