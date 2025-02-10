import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { motion } from 'framer-motion'

interface SkillTrend {
  skillId: string
  name: string
  trend: 'RISING' | 'STABLE' | 'DECLINING'
  score: number
  historicalData: {
    date: string
    score: number
    jobCount: number
    avgSalary: number
  }[]
}

interface Props {
  trends: SkillTrend[]
  className?: string
}

export const SkillTrends: React.FC<Props> = ({ trends, className }) => {
  const [selectedMetric, setSelectedMetric] = React.useState<'score' | 'jobCount' | 'avgSalary'>('score')
  const [selectedSkills, setSelectedSkills] = React.useState<Set<string>>(new Set())
  const [timeRange, setTimeRange] = React.useState<'1M' | '3M' | '6M' | '1Y'>('3M')

  const metricLabels = {
    score: 'Market Demand Score',
    jobCount: 'Job Postings',
    avgSalary: 'Average Salary ($)'
  }

  const timeRanges = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365
  }

  const filterDataByTimeRange = (data: typeof trends[0]['historicalData']) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRanges[timeRange])
    return data.filter(d => new Date(d.date) >= cutoffDate)
  }

  const getTrendColor = (trend: SkillTrend['trend']) => {
    switch (trend) {
      case 'RISING':
        return '#10B981'
      case 'STABLE':
        return '#6366F1'
      case 'DECLINING':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const toggleSkill = (skillId: string) => {
    const newSelected = new Set(selectedSkills)
    if (newSelected.has(skillId)) {
      newSelected.delete(skillId)
    } else {
      newSelected.add(skillId)
    }
    setSelectedSkills(newSelected)
  }

  // Prepare data for the selected skills and time range
  const chartData = React.useMemo(() => {
    const selectedTrends = trends.filter(t => selectedSkills.has(t.skillId))
    if (selectedTrends.length === 0) return []

    const allDates = new Set<string>()
    selectedTrends.forEach(trend => {
      const filteredData = filterDataByTimeRange(trend.historicalData)
      filteredData.forEach(d => allDates.add(d.date))
    })

    return Array.from(allDates)
      .sort()
      .map(date => {
        const point: any = { date }
        selectedTrends.forEach(trend => {
          const dataPoint = trend.historicalData.find(d => d.date === date)
          if (dataPoint) {
            point[trend.name] = dataPoint[selectedMetric]
          }
        })
        return point
      })
  }, [trends, selectedSkills, timeRange, selectedMetric])

  // Current demand comparison
  const currentDemand = trends.map(trend => ({
    name: trend.name,
    score: trend.score,
    color: getTrendColor(trend.trend)
  }))

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="space-x-2">
            <span className="text-sm text-gray-400">Metric:</span>
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value as typeof selectedMetric)}
              className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
            >
              {Object.entries(metricLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-x-2">
            <span className="text-sm text-gray-400">Time Range:</span>
            {Object.keys(timeRanges).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range as typeof timeRange)}
                className={`px-2 py-1 rounded text-sm ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Current Demand Comparison */}
        <div className="h-64">
          <h3 className="text-gray-300 text-sm font-medium mb-4">Current Market Demand</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentDemand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="score" fill="#6366F1">
                {currentDemand.map((entry, index) => (
                  <motion.cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Selection */}
        <div className="flex flex-wrap gap-2">
          {trends.map(trend => (
            <button
              key={trend.skillId}
              onClick={() => toggleSkill(trend.skillId)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedSkills.has(trend.skillId)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {trend.name}
            </button>
          ))}
        </div>

        {/* Historical Trends */}
        {selectedSkills.size > 0 && (
          <div className="h-64">
            <h3 className="text-gray-300 text-sm font-medium mb-4">Historical Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                {trends
                  .filter(t => selectedSkills.has(t.skillId))
                  .map(trend => (
                    <Line
                      key={trend.skillId}
                      type="monotone"
                      dataKey={trend.name}
                      stroke={getTrendColor(trend.trend)}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
