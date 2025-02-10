import { Job, SkillGraph } from '../types'
import { PineconeClient } from '@pinecone-database/pinecone'
import * as tf from '@tensorflow/tfjs'
import { MarketDemandAggregator } from '../services/marketDemandAggregator'
import { SkillGapAnalyzer } from '../ai/skillGapAnalyzer'
import { prisma } from '../prisma'
import { OpenAI } from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

interface SkillCluster {
  category: string
  skills: string[]
  marketDemand: number
  growthRate: number
}

interface MarketInsights {
  trends: {
    rising: string[]
    stable: string[]
    declining: string[]
  }
  emergingSkills: string[]
  skillClusters: SkillCluster[]
  recommendations: string[]
}

interface MarketData {
  score: number
  trend: 'RISING' | 'STABLE' | 'DECLINING'
  jobCount: number
  avgSalary: number
  growthRate: number
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface Point {
  coordinates: number[]
  index: number
}

interface Cluster {
  centroid: number[]
  points: Point[]
}

export class DataPipeline {
  private pinecone: PineconeClient
  private skillEmbeddingModel: tf.LayersModel | null = null
  private openai: OpenAI
  private marketDataCache: Map<string, { data: MarketData; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // 1 second

  constructor() {
    this.pinecone = new PineconeClient()
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.initialize()
  }

  private async initialize() {
    try {
      // Initialize Pinecone
      await this.pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT || '',
        apiKey: process.env.PINECONE_API_KEY || ''
      })

      // Load skill embedding model if not in test environment
      if (process.env.NODE_ENV !== 'test') {
        await this.loadSkillEmbeddingModel()
      }

      // Initialize market data cache
      await this.refreshMarketDataCache()
    } catch (error) {
      console.error('Error initializing DataPipeline:', error)
      throw new Error('Failed to initialize DataPipeline')
    }
  }

  private async loadSkillEmbeddingModel() {
    try {
      const modelPath = process.env.SKILL_EMBEDDING_MODEL_PATH
      if (!modelPath) {
        throw new Error('SKILL_EMBEDDING_MODEL_PATH not configured')
      }

      this.skillEmbeddingModel = await tf.loadLayersModel(modelPath)
    } catch (error) {
      console.error('Failed to load skill embedding model:', error)
      throw error
    }
  }

  public async processJob(job: Job): Promise<Job> {
    try {
      // Extract and normalize skills
      const normalizedSkills = await this.normalizeSkills(job.skills)
      
      // Generate skill embeddings
      const skillEmbeddings = await this.generateSkillEmbeddings(normalizedSkills)
      
      // Get market demand data
      const marketData = await this.getMarketData(normalizedSkills)
      
      // Store in vector database
      await this.storeJobVector(job.id, skillEmbeddings)

      // Update skill relationships
      await this.updateSkillRelationships(normalizedSkills)

      return {
        ...job,
        skills: normalizedSkills,
        marketInsights: marketData
      }
    } catch (error) {
      console.error('Error processing job:', error)
      throw new Error('Failed to process job')
    }
  }

  private async normalizeSkills(skills: string[]): Promise<string[]> {
    try {
      // Remove duplicates and standardize format
      const normalized = [...new Set(
        skills.map(skill => skill.toLowerCase().trim())
      )]

      // Use AI to standardize skill names with retries
      for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
        try {
          const messages: ChatCompletionMessageParam[] = [
            {
              role: 'system',
              content: 'You are a skill normalization expert. Standardize these skill names while preserving their meaning. Return the result as a JSON array of strings.'
            },
            {
              role: 'user',
              content: `Normalize these skills: ${normalized.join(', ')}`
            }
          ]

          const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages,
            temperature: 0.3,
            max_tokens: 1000
          })

          return JSON.parse(response.choices[0].message.content || '[]')
        } catch (error) {
          if (attempt === this.MAX_RETRIES) throw error
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt))
        }
      }

      return normalized // Fallback to basic normalization if AI fails
    } catch (error) {
      console.error('Error normalizing skills:', error)
      throw new Error('Failed to normalize skills')
    }
  }

  private async getMarketData(skills: string[]): Promise<MarketData[]> {
    try {
      return await Promise.all(
        skills.map(async skill => {
          // Check cache first
          const cached = this.marketDataCache.get(skill)
          if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data
          }

          // Get fresh data
          const data = await MarketDemandAggregator.aggregateMarketData(skill)
          
          // Update cache
          this.marketDataCache.set(skill, {
            data,
            timestamp: Date.now()
          })

          return data
        })
      )
    } catch (error) {
      console.error('Error fetching market data:', error)
      throw new Error('Failed to fetch market data')
    }
  }

  private async kMeansClustering(
    points: Point[],
    k: number,
    maxIterations: number = 100
  ): Promise<Cluster[]> {
    // Initialize centroids randomly
    let centroids = Array(k).fill(null).map(() => {
      const randomPoint = points[Math.floor(Math.random() * points.length)]
      return [...randomPoint.coordinates]
    })

    let clusters: Cluster[] = []
    let iteration = 0
    let hasConverged = false

    while (!hasConverged && iteration < maxIterations) {
      // Assign points to nearest centroid
      clusters = centroids.map(centroid => ({
        centroid,
        points: []
      }))

      points.forEach(point => {
        let minDistance = Infinity
        let nearestCluster = 0

        centroids.forEach((centroid, i) => {
          const distance = this.euclideanDistance(point.coordinates, centroid)
          if (distance < minDistance) {
            minDistance = distance
            nearestCluster = i
          }
        })

        clusters[nearestCluster].points.push(point)
      })

      // Calculate new centroids
      const newCentroids = clusters.map(cluster => {
        if (cluster.points.length === 0) return cluster.centroid

        const dimensions = cluster.points[0].coordinates.length
        const sum = new Array(dimensions).fill(0)

        cluster.points.forEach(point => {
          point.coordinates.forEach((coord, i) => {
            sum[i] += coord
          })
        })

        return sum.map(s => s / cluster.points.length)
      })

      // Check for convergence
      hasConverged = centroids.every((centroid, i) => 
        this.euclideanDistance(centroid, newCentroids[i]) < 0.001
      )

      centroids = newCentroids
      iteration++
    }

    return clusters
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, coord, i) => sum + Math.pow(coord - b[i], 2), 0)
    )
  }

  private async categorizeSkillCluster(skills: string[]): Promise<string> {
    try {
      const prompt = `Analyze these related skills and provide a single category name that best describes them:

Skills: ${skills.join(', ')}

Consider categories like:
- Frontend Development
- Backend Development
- Data Science
- DevOps
- Cloud Computing
- Cybersecurity
- Machine Learning
- Mobile Development
- etc.

Return only the category name, nothing else.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a skill categorization expert. Provide concise, accurate categories.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 50
      })

      return response.choices[0].message.content?.trim() || 'Uncategorized'
    } catch (error) {
      console.error('Error categorizing skill cluster:', error)
      return 'Uncategorized'
    }
  }

  private async generateSkillRecommendations(
    trends: MarketInsights['trends'],
    emergingSkills: string[],
    clusters: SkillCluster[]
  ): Promise<string[]> {
    try {
      const prompt = `Based on the following market data, provide strategic recommendations:
      
      Rising Skills: ${trends.rising.join(', ')}
      Stable Skills: ${trends.stable.join(', ')}
      Declining Skills: ${trends.declining.join(', ')}
      
      Emerging Skills: ${emergingSkills.join(', ')}
      
      Skill Clusters:
      ${clusters.map(c => `${c.category}: ${c.skills.join(', ')}`).join('\n')}
      
      Provide 3-5 strategic recommendations for skill development and hiring.
      Focus on:
      1. High-demand skill combinations
      2. Future-proof skill paths
      3. Strategic upskilling opportunities
      4. Emerging technology adoption
      
      Format as JSON array of strings.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic workforce planning expert with deep knowledge of technology trends.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      return JSON.parse(response.choices[0].message.content || '[]')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return [
        'Error generating recommendations. Please try again later.',
        'Review the market trends manually to make informed decisions.'
      ]
    }
  }

  private async storeJobVector(jobId: string, embeddings: number[]) {
    try {
      const index = this.pinecone.Index(process.env.PINECONE_INDEX || '')
      await index.upsert({
        upsertRequest: {
          vectors: [{
            id: jobId,
            values: embeddings,
            metadata: { type: 'job' }
          }]
        }
      })
    } catch (error) {
      console.error('Error storing job vector:', error)
      throw new Error('Failed to store job vector')
    }
  }

  private async generateSkillEmbeddings(skills: string[]): Promise<number[]> {
    if (!this.skillEmbeddingModel) {
      throw new Error('Skill embedding model not initialized')
    }

    try {
      // Convert skills to embeddings using the model
      const embeddings = await Promise.all(
        skills.map(async skill => {
          const tensor = tf.tensor([skill])
          const embedding = this.skillEmbeddingModel!.predict(tensor) as tf.Tensor
          return Array.from(embedding.dataSync())
        })
      )

      // Average the embeddings
      const dimensions = embeddings[0].length
      const averageEmbedding = new Array(dimensions).fill(0)

      embeddings.forEach(embedding => {
        embedding.forEach((value, i) => {
          averageEmbedding[i] += value
        })
      })

      return averageEmbedding.map(sum => sum / embeddings.length)
    } catch (error) {
      console.error('Error generating skill embeddings:', error)
      throw new Error('Failed to generate skill embeddings')
    }
  }
}

// Export singleton instance
export const dataPipeline = new DataPipeline()
