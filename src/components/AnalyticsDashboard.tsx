'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa'
import { useAnalytics } from '@/hooks/useAnalytics'

interface AnalyticsData {
  heatmap: Array<{
    target: string
    intensity: number
  }>
  features: Array<{
    featureId: string
    totalUsage: number
    averageSuccessRate: number
    averageTimeSpent: number
    lastUsed: string
  }>
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { getAnalytics } = useAnalytics()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const end = new Date()
        const start = new Date()
        
        switch (timeRange) {
          case 'day':
            start.setDate(end.getDate() - 1)
            break
          case 'week':
            start.setDate(end.getDate() - 7)
            break
          case 'month':
            start.setDate(end.getDate() - 30)
            break
        }

        const [heatmapData, featureData] = await Promise.all([
          getAnalytics('heatmap', { start, end }),
          getAnalytics('features', { start, end })
        ])

        setData({
          heatmap: heatmapData || [],
          features: featureData || []
        })
      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, getAnalytics])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex gap-4">
        {['day', 'week', 'month'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as typeof timeRange)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === range
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Feature Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.features.slice(0, 4).map((feature, index) => (
          <motion.div
            key={feature.featureId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gray-800 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                {feature.featureId.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h3>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FaChartLine className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Usage</span>
                <span className="text-white">{feature.totalUsage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white">{Math.round(feature.averageSuccessRate)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Time</span>
                <span className="text-white">{Math.round(feature.averageTimeSpent)}s</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interaction Heatmap */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-medium text-white mb-6">User Interaction Heatmap</h3>
        <div className="space-y-4">
          {data?.heatmap.map((item, index) => (
            <motion.div
              key={item.target}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center"
            >
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">{item.target}</span>
                  <span className="text-white">{item.intensity} interactions</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.intensity / 100) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 