import { DataPipeline } from '../DataPipeline'
import { Job } from '../../types'
import { OpenAI } from 'openai'
import { prisma } from '../../prisma'
import { MarketDemandAggregator } from '../../services/marketDemandAggregator'
import * as tf from '@tensorflow/tfjs'

// Mock dependencies
jest.mock('@pinecone-database/pinecone', () => ({
  PineconeClient: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    Index: jest.fn().mockReturnValue({
      upsert: jest.fn().mockResolvedValue(undefined)
    })
  }))
}))

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: '["react", "typescript", "next.js"]'
              }
            }
          ]
        })
      }
    }
  }))
}))

jest.mock('../../prisma', () => ({
  prisma: {
    skill: {
      findMany: jest.fn().mockResolvedValue([
        {
          name: 'react',
          marketDemand: { trend: 'RISING', score: 0.9 }
        },
        {
          name: 'typescript',
          marketDemand: { trend: 'STABLE', score: 0.8 }
        }
      ]),
      create: jest.fn(),
      update: jest.fn()
    },
    skillRelationship: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}))

jest.mock('../../services/marketDemandAggregator', () => ({
  MarketDemandAggregator: {
    aggregateMarketData: jest.fn()
  }
}))

jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn().mockReturnValue({
      dataSync: jest.fn().mockReturnValue(new Float32Array([0.1, 0.2, 0.3]))
    })
  }),
  tensor: jest.fn().mockReturnValue({})
}))

describe('DataPipeline', () => {
  let dataPipeline: DataPipeline

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SKILL_EMBEDDING_MODEL_PATH = 'test/path'
    dataPipeline = new DataPipeline()
  })

  const mockJob: Job = {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    description: 'Looking for an experienced frontend developer',
    requirements: ['5+ years experience', 'Bachelor\'s degree'],
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    location: 'Remote',
    type: 'full-time',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('processJob', () => {
    beforeEach(() => {
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockResolvedValue({
        trend: 'RISING',
        score: 0.8,
        jobCount: 1000,
        avgSalary: 120000,
        growthRate: 0.15,
        demandLevel: 'HIGH'
      })
    })

    it('should normalize and enrich skills with market data', async () => {
      const processed = await dataPipeline.processJob(mockJob)
      
      expect(processed.skills).toEqual(['react', 'typescript', 'next.js'])
      expect(processed.marketInsights).toBeDefined()
      expect(MarketDemandAggregator.aggregateMarketData).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockRejectedValue(
        new Error('API Error')
      )

      await expect(dataPipeline.processJob(mockJob)).rejects.toThrow('Failed to process job')
    })

    it('should retry OpenAI calls on failure', async () => {
      const openAIMock = OpenAI as jest.Mock
      let attempts = 0
      openAIMock.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockImplementation(() => {
              attempts++
              if (attempts < 2) throw new Error('API Error')
              return {
                choices: [{ message: { content: '["react"]' } }]
              }
            })
          }
        }
      }))

      const processed = await dataPipeline.processJob(mockJob)
      expect(attempts).toBe(2)
      expect(processed.skills).toEqual(['react'])
    })
  })

  describe('market data caching', () => {
    it('should use cached market data when available', async () => {
      const mockMarketData = {
        trend: 'RISING',
        score: 0.8,
        jobCount: 1000,
        avgSalary: 120000,
        growthRate: 0.15,
        demandLevel: 'HIGH'
      }

      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockResolvedValue(mockMarketData)

      // First call should fetch from API
      await dataPipeline.processJob(mockJob)
      expect(MarketDemandAggregator.aggregateMarketData).toHaveBeenCalledTimes(4)

      // Reset mock call count
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockClear()

      // Second call should use cache
      await dataPipeline.processJob(mockJob)
      expect(MarketDemandAggregator.aggregateMarketData).not.toHaveBeenCalled()
    })

    it('should refresh cache when TTL expires', async () => {
      const mockMarketData = {
        trend: 'RISING',
        score: 0.8,
        jobCount: 1000,
        avgSalary: 120000,
        growthRate: 0.15,
        demandLevel: 'HIGH'
      }

      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockResolvedValue(mockMarketData)

      // First call should fetch from API
      await dataPipeline.processJob(mockJob)

      // Fast forward time past TTL
      jest.useFakeTimers()
      jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1)

      // Reset mock
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockClear()

      // Should fetch fresh data
      await dataPipeline.processJob(mockJob)
      expect(MarketDemandAggregator.aggregateMarketData).toHaveBeenCalled()

      jest.useRealTimers()
    })
  })

  describe('skill clustering', () => {
    it('should generate skill clusters with proper categorization', async () => {
      const openAIMock = OpenAI as jest.Mock
      openAIMock.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'Frontend Development' } }]
            })
          }
        }
      }))

      const mockSkills = [
        { name: 'react', marketDemand: { trend: 'RISING', score: 0.9 } },
        { name: 'vue', marketDemand: { trend: 'STABLE', score: 0.8 } },
        { name: 'angular', marketDemand: { trend: 'DECLINING', score: 0.6 } }
      ]

      ;(prisma.skill.findMany as jest.Mock).mockResolvedValue(mockSkills)

      const insights = await dataPipeline.generateMarketInsights()
      
      expect(insights.skillClusters).toBeDefined()
      expect(insights.skillClusters[0].category).toBe('Frontend Development')
      expect(insights.trends.rising).toContain('react')
      expect(insights.trends.stable).toContain('vue')
      expect(insights.trends.declining).toContain('angular')
    })

    it('should handle clustering with empty data', async () => {
      ;(prisma.skill.findMany as jest.Mock).mockResolvedValue([])

      const insights = await dataPipeline.generateMarketInsights()
      
      expect(insights.skillClusters).toEqual([])
      expect(insights.trends.rising).toEqual([])
      expect(insights.emergingSkills).toEqual([])
    })
  })

  describe('skill embeddings', () => {
    it('should generate and store skill embeddings', async () => {
      const mockEmbeddings = new Float32Array([0.1, 0.2, 0.3])
      
      ;(tf.loadLayersModel as jest.Mock).mockResolvedValue({
        predict: jest.fn().mockReturnValue({
          dataSync: jest.fn().mockReturnValue(mockEmbeddings)
        })
      })

      const processed = await dataPipeline.processJob(mockJob)
      
      expect(tf.loadLayersModel).toHaveBeenCalled()
      expect(tf.tensor).toHaveBeenCalled()
    })

    it('should handle missing embedding model gracefully', async () => {
      process.env.SKILL_EMBEDDING_MODEL_PATH = ''
      
      const newPipeline = new DataPipeline()
      await expect(newPipeline.processJob(mockJob)).rejects.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle OpenAI API errors', async () => {
      const openAIMock = OpenAI as jest.Mock
      openAIMock.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('OpenAI API Error'))
          }
        }
      }))

      await expect(dataPipeline.processJob(mockJob)).rejects.toThrow()
    })

    it('should handle Pinecone errors', async () => {
      const pineconeError = new Error('Pinecone Error')
      const mockPineconeClient = {
        init: jest.fn().mockRejectedValue(pineconeError)
      }

      jest.mock('@pinecone-database/pinecone', () => ({
        PineconeClient: jest.fn().mockImplementation(() => mockPineconeClient)
      }))

      await expect(new DataPipeline().processJob(mockJob)).rejects.toThrow()
    })

    it('should handle database errors', async () => {
      ;(prisma.skill.findMany as jest.Mock).mockRejectedValue(
        new Error('Database Error')
      )

      await expect(dataPipeline.generateMarketInsights()).rejects.toThrow()
    })
  })
})
