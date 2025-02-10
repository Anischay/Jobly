import { auth, currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { SkillAnalyzer } from '@/lib/ai/skillAnalyzer'

interface Skill {
  id: string
  name: string
  category: string
  required: boolean
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  importance: number
}

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  salary: z.string().optional(),
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      category: z.string().min(1, "Skill category is required"),
      required: z.boolean(),
      proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
      importance: z.number()
    })
  ).min(1, "At least one skill is required")
})

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('q') || ''
    const skills = searchParams.get('skills')?.split(',') || []
    const type = searchParams.get('type')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        skills.length > 0
          ? {
              skills: {
                some: {
                  skill: {
                    name: {
                      in: skills.map(s => s.toLowerCase())
                    }
                  }
                }
              }
            }
          : {},
        type ? { type } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {}
      ]
    }

    const [jobs, total] = await Promise.all([
      prisma.jobListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          skills: {
            include: {
              skill: {
                include: {
                  skillCategory: true,
                  marketDemand: true
                }
              }
            }
          }
        }
      }),
      prisma.jobListing.count({ where })
    ])

    return NextResponse.json({
      jobs,
      total,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const validatedData = jobSchema.parse(data)

    // Analyze job description for skill suggestions and validation
    const analysis = await SkillAnalyzer.analyzeJobDescription(validatedData.description)

    // Create or get skills from the database
    const skillPromises = validatedData.skills.map(async (skill: Skill) => {
      const existingSkill = await prisma.skill.findFirst({
        where: { name: skill.name.toLowerCase() }
      })

      if (existingSkill) {
        // Update market demand if it exists
        const matchingSuggestion = analysis.suggestedSkills.find(
          s => s.name.toLowerCase() === skill.name.toLowerCase()
        )

        if (matchingSuggestion?.marketDemand) {
          await prisma.skillMarketDemand.upsert({
            where: { skillId: existingSkill.id },
            create: {
              skillId: existingSkill.id,
              trend: matchingSuggestion.marketDemand.trend,
              score: matchingSuggestion.marketDemand.score,
              dataSource: 'AI Analysis'
            },
            update: {
              trend: matchingSuggestion.marketDemand.trend,
              score: matchingSuggestion.marketDemand.score,
              lastUpdated: new Date()
            }
          })
        }

        return {
          skillId: existingSkill.id,
          required: skill.required,
          importance: skill.importance,
          proficiencyLevel: skill.proficiencyLevel
        }
      }

      // Create new skill if it doesn't exist
      const newSkill = await prisma.skill.create({
        data: {
          name: skill.name.toLowerCase(),
          category: skill.category,
          description: `${skill.name} skill for ${validatedData.title} position`
        }
      })

      // Create market demand data if available
      const matchingSuggestion = analysis.suggestedSkills.find(
        s => s.name.toLowerCase() === skill.name.toLowerCase()
      )

      if (matchingSuggestion?.marketDemand) {
        await prisma.skillMarketDemand.create({
          data: {
            skillId: newSkill.id,
            trend: matchingSuggestion.marketDemand.trend,
            score: matchingSuggestion.marketDemand.score,
            dataSource: 'AI Analysis'
          }
        })
      }

      return {
        skillId: newSkill.id,
        required: skill.required,
        importance: skill.importance,
        proficiencyLevel: skill.proficiencyLevel
      }
    })

    const jobSkills = await Promise.all(skillPromises)

    // Create the job listing with skills
    const jobListing = await prisma.jobListing.create({
      data: {
        title: validatedData.title,
        company: validatedData.company,
        location: validatedData.location,
        type: validatedData.type,
        description: validatedData.description,
        requirements: validatedData.requirements,
        salary: validatedData.salary || '',
        userId,
        skills: {
          create: jobSkills
        }
      },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                skillCategory: true,
                marketDemand: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(jobListing)
  } catch (error) {
    console.error('Error creating job listing:', error)
    return NextResponse.json(
      { error: 'Failed to create job listing' },
      { status: 500 }
    )
  }
}