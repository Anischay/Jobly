import { SmartMatcher } from '../SmartMatcher'
import { prisma } from '../../prisma'
import { SkillGapAnalyzer } from '../skillGapAnalyzer'
import { MarketDemandAggregator } from '../../services/marketDemandAggregator'
import { OpenAI } from 'openai'

// Mock dependencies
jest.mock('../../prisma', () => ({
  prisma: {
    jobListing: {
      findUnique: jest.fn()
    },
    user: {
      findUnique: jest.fn()
    }
  }
}))

jest.mock('../skillGapAnalyzer', () => ({
  SkillGapAnalyzer: {
    analyzeSkillGap: jest.fn()
  }
}))

jest.mock('../../services/marketDemandAggregator', () => ({
  MarketDemandAggregator: {
    aggregateMarketData: jest.fn()
  }
}))

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '0.8' } }]
        })
      }
    }
  }))
}))

describe('SmartMatcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('calculateMatchScore', () => {
    it('should calculate match score correctly for a perfect match', async () => {
      // Mock job data
      const mockJob = {
        id: 'job1',
        title: 'Senior Developer',
        description: 'Looking for an experienced developer',
        requirements: '5 years of experience',
        skills: [
          {
            skill: { name: 'JavaScript' },
            required: true,
            proficiencyLevel: 'EXPERT',
            importance: 1
          },
          {
            skill: { name: 'React' },
            required: true,
            proficiencyLevel: 'EXPERT',
            importance: 0.8
          }
        ]
      }

      // Mock candidate data
      const mockCandidate = {
        id: 'candidate1',
        skills: [
          {
            skill: { name: 'JavaScript' },
            proficiencyLevel: 'EXPERT',
            yearsOfExperience: 5
          },
          {
            skill: { name: 'React' },
            proficiencyLevel: 'EXPERT',
            yearsOfExperience: 4
          }
        ],
        profile: {
          totalYearsOfExperience: 6,
          relevantYearsOfExperience: 5,
          learningSpeed: 0.9,
          adaptabilityScore: 0.9
        }
      }

      // Mock market demand data
      const mockMarketData = {
        trend: 'RISING' as const,
        score: 0.9,
        jobCount: 1000,
        avgSalary: 120000,
        growthRate: 0.15,
        demandLevel: 'HIGH' as const
      }

      // Mock skill gap analysis
      const mockGapAnalysis = {
        gaps: [],
        estimatedTimeToCompletion: '0 days',
        recommendedOrder: [],
        difficulty: 'intermediate' as const
      }

      // Setup mocks
      ;(prisma.jobListing.findUnique as jest.Mock).mockResolvedValue(mockJob)
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockCandidate)
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockResolvedValue(mockMarketData)
      ;(SkillGapAnalyzer.analyzeSkillGap as jest.Mock).mockResolvedValue(mockGapAnalysis)

      const matchScore = await SmartMatcher.calculateMatchScore('job1', 'candidate1')

      expect(matchScore.total).toBeGreaterThan(0.8)
      expect(matchScore.breakdown.skillMatch).toBe(1)
      expect(matchScore.breakdown.proficiencyMatch).toBe(1)
      expect(matchScore.breakdown.marketAlignment).toBeGreaterThan(0.8)
      expect(matchScore.breakdown.learningPotential).toBeGreaterThan(0.8)
      expect(matchScore.breakdown.experienceMatch).toBe(1)
    })

    it('should handle missing skills appropriately', async () => {
      // Mock job with skills
      const mockJob = {
        id: 'job2',
        title: 'Junior Developer',
        description: 'Entry level position',
        requirements: '1-2 years experience',
        skills: [
          {
            skill: { name: 'JavaScript' },
            required: true,
            proficiencyLevel: 'INTERMEDIATE',
            importance: 1
          },
          {
            skill: { name: 'React' },
            required: false,
            proficiencyLevel: 'BEGINNER',
            importance: 0.5
          }
        ]
      }

      // Mock candidate with partial skills
      const mockCandidate = {
        id: 'candidate2',
        skills: [
          {
            skill: { name: 'JavaScript' },
            proficiencyLevel: 'BEGINNER',
            yearsOfExperience: 1
          }
        ],
        profile: {
          totalYearsOfExperience: 1,
          relevantYearsOfExperience: 1,
          learningSpeed: 0.7,
          adaptabilityScore: 0.8
        }
      }

      const mockMarketData = {
        trend: 'STABLE' as const,
        score: 0.7,
        jobCount: 500,
        avgSalary: 80000,
        growthRate: 0.05,
        demandLevel: 'MEDIUM' as const
      }

      const mockGapAnalysis = {
        gaps: [
          {
            missingSkill: 'React',
            importance: 0.5,
            timeToAcquire: '2 months'
          }
        ],
        estimatedTimeToCompletion: '2 months',
        recommendedOrder: ['React'],
        difficulty: 'beginner' as const
      }

      // Setup mocks
      ;(prisma.jobListing.findUnique as jest.Mock).mockResolvedValue(mockJob)
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockCandidate)
      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock).mockResolvedValue(mockMarketData)
      ;(SkillGapAnalyzer.analyzeSkillGap as jest.Mock).mockResolvedValue(mockGapAnalysis)

      const matchScore = await SmartMatcher.calculateMatchScore('job2', 'candidate2')

      expect(matchScore.total).toBeLessThan(0.8)
      expect(matchScore.breakdown.skillMatch).toBeLessThan(1)
      expect(matchScore.breakdown.proficiencyMatch).toBeLessThan(1)
      expect(matchScore.gapAnalysis.missingSkills).toHaveLength(1)
      expect(matchScore.gapAnalysis.missingSkills[0].name).toBe('React')
    })
  })

  describe('calculateMarketAlignment', () => {
    it('should calculate higher alignment for rising, high-demand skills', async () => {
      const jobSkills = [
        {
          name: 'React',
          required: true,
          proficiencyLevel: 'INTERMEDIATE',
          importance: 1
        }
      ]

      const candidateSkills = [
        {
          name: 'React',
          proficiencyLevel: 'INTERMEDIATE',
          yearsOfExperience: 2
        },
        {
          name: 'TypeScript',
          proficiencyLevel: 'BEGINNER',
          yearsOfExperience: 1
        }
      ]

      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock)
        .mockImplementation((skill) => {
          if (skill === 'React') {
            return {
              trend: 'RISING',
              score: 0.9,
              jobCount: 1000,
              avgSalary: 120000,
              growthRate: 0.2,
              demandLevel: 'HIGH'
            }
          }
          return {
            trend: 'STABLE',
            score: 0.7,
            jobCount: 500,
            avgSalary: 100000,
            growthRate: 0.1,
            demandLevel: 'MEDIUM'
          }
        })

      const alignment = await SmartMatcher['calculateMarketAlignment'](jobSkills, candidateSkills)
      expect(alignment).toBeGreaterThan(0.8)
    })

    it('should calculate lower alignment for declining, low-demand skills', async () => {
      const jobSkills = [
        {
          name: 'jQuery',
          required: true,
          proficiencyLevel: 'INTERMEDIATE',
          importance: 1
        }
      ]

      const candidateSkills = [
        {
          name: 'jQuery',
          proficiencyLevel: 'EXPERT',
          yearsOfExperience: 5
        }
      ]

      ;(MarketDemandAggregator.aggregateMarketData as jest.Mock)
        .mockResolvedValue({
          trend: 'DECLINING',
          score: 0.4,
          jobCount: 200,
          avgSalary: 70000,
          growthRate: -0.1,
          demandLevel: 'LOW'
        })

      const alignment = await SmartMatcher['calculateMarketAlignment'](jobSkills, candidateSkills)
      expect(alignment).toBeLessThan(0.5)
    })
  })

  describe('calculateLearningPotential', () => {
    it('should calculate high potential for related skills', async () => {
      const job = {
        title: 'Frontend Developer',
        description: 'React developer needed',
        skills: [
          {
            name: 'React',
            required: true,
            proficiencyLevel: 'INTERMEDIATE',
            importance: 1
          },
          {
            name: 'TypeScript',
            required: true,
            proficiencyLevel: 'INTERMEDIATE',
            importance: 0.8
          }
        ]
      }

      const candidate = {
        skills: [
          {
            name: 'JavaScript',
            proficiencyLevel: 'EXPERT',
            yearsOfExperience: 4
          },
          {
            name: 'Vue',
            proficiencyLevel: 'INTERMEDIATE',
            yearsOfExperience: 2
          }
        ],
        learningSpeed: 0.9,
        adaptabilityScore: 0.9
      }

      ;(SkillGapAnalyzer.analyzeSkillGap as jest.Mock).mockResolvedValue({
        gaps: [
          {
            missingSkill: 'React',
            importance: 1,
            timeToAcquire: '2 months'
          },
          {
            missingSkill: 'TypeScript',
            importance: 0.8,
            timeToAcquire: '1 month'
          }
        ],
        estimatedTimeToCompletion: '3 months',
        recommendedOrder: ['React', 'TypeScript'],
        difficulty: 'intermediate'
      })

      const potential = await SmartMatcher['calculateLearningPotential'](job, candidate)
      expect(potential).toBeGreaterThan(0.7)
    })

    it('should calculate lower potential for unrelated skills', async () => {
      const job = {
        title: 'Data Scientist',
        description: 'ML expert needed',
        skills: [
          {
            name: 'Python',
            required: true,
            proficiencyLevel: 'EXPERT',
            importance: 1
          },
          {
            name: 'Machine Learning',
            required: true,
            proficiencyLevel: 'EXPERT',
            importance: 1
          }
        ]
      }

      const candidate = {
        skills: [
          {
            name: 'HTML',
            proficiencyLevel: 'EXPERT',
            yearsOfExperience: 5
          },
          {
            name: 'CSS',
            proficiencyLevel: 'EXPERT',
            yearsOfExperience: 5
          }
        ],
        learningSpeed: 0.5,
        adaptabilityScore: 0.5
      }

      ;(SkillGapAnalyzer.analyzeSkillGap as jest.Mock).mockResolvedValue({
        gaps: [
          {
            missingSkill: 'Python',
            importance: 1,
            timeToAcquire: '6 months'
          },
          {
            missingSkill: 'Machine Learning',
            importance: 1,
            timeToAcquire: '12 months'
          }
        ],
        estimatedTimeToCompletion: '18 months',
        recommendedOrder: ['Python', 'Machine Learning'],
        difficulty: 'advanced'
      })

      const potential = await SmartMatcher['calculateLearningPotential'](job, candidate)
      expect(potential).toBeLessThan(0.5)
    })
  })
})
