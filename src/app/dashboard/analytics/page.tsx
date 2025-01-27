'use client'

import { motion } from 'framer-motion'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              Track user interactions and feature usage across your platform
            </p>
          </div>
        </div>

        <AnalyticsDashboard />
      </motion.div>
    </div>
  )
} 