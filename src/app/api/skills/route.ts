import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'

export async function GET(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''
  const limit = parseInt(searchParams.get('limit') || '10')
  const categoryId = searchParams.get('categoryId')
  const includeCategories = searchParams.get('includeCategories') === 'true'

  try {
    // Fetch categories if requested
    const categories = includeCategories ? await prisma.skillCategory.findMany({
      include: {
        _count: {
          select: { skills: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    }) : []

    // Fetch skills based on query and category
    const skills = await prisma.skill.findMany({
      where: {
        AND: [
          { name: { contains: query } },
          categoryId ? { categoryId } : {},
        ]
      },
      take: limit,
      orderBy: [
        {
          jobSkills: {
            _count: 'desc'
          }
        },
        {
          name: 'asc'
        }
      ],
      include: {
        skillCategory: true,
        _count: {
          select: {
            jobSkills: true
          }
        }
      }
    })

    // Get related skills based on co-occurrence in job listings
    const relatedSkills = query ? await prisma.skill.findMany({
      where: {
        jobSkills: {
          some: {
            jobListing: {
              skills: {
                some: {
                  skill: {
                    name: {
                      contains: query
                    }
                  }
                }
              }
            }
          }
        }
      },
      take: 5,
      orderBy: {
        jobSkills: {
          _count: 'desc'
        }
      },
      include: {
        skillCategory: true
      }
    }) : []

    return NextResponse.json({
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        skillCount: category._count.skills
      })),
      skills: skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        categoryId: skill.categoryId,
        categoryName: skill.skillCategory?.name,
        categoryColor: skill.skillCategory?.color,
        popularity: skill._count.jobSkills
      })),
      related: relatedSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        categoryId: skill.categoryId,
        categoryName: skill.skillCategory?.name,
        categoryColor: skill.skillCategory?.color
      }))
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}
