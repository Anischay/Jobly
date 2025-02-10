import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create skill categories
  const categories = [
    {
      name: 'Programming Languages',
      description: 'Core programming and scripting languages',
      color: '#FF6B6B',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'PHP']
    },
    {
      name: 'Frontend Development',
      description: 'Web frontend technologies and frameworks',
      color: '#4ECDC4',
      skills: ['React', 'Vue.js', 'Angular', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'SASS']
    },
    {
      name: 'Backend Development',
      description: 'Server-side technologies and frameworks',
      color: '#45B7D1',
      skills: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'FastAPI']
    },
    {
      name: 'Database',
      description: 'Database systems and query languages',
      color: '#96CEB4',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'SQL']
    },
    {
      name: 'DevOps',
      description: 'Development operations and cloud platforms',
      color: '#D4A5A5',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins']
    },
    {
      name: 'Mobile Development',
      description: 'Mobile app development technologies',
      color: '#FFE66D',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin']
    },
    {
      name: 'AI/ML',
      description: 'Artificial Intelligence and Machine Learning',
      color: '#6C5B7B',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Computer Vision', 'NLP', 'Deep Learning']
    },
    {
      name: 'Soft Skills',
      description: 'Professional and interpersonal skills',
      color: '#C06C84',
      skills: ['Communication', 'Leadership', 'Problem Solving', 'Team Work', 'Time Management']
    }
  ]

  console.log('Creating skill categories and skills...')
  
  for (const category of categories) {
    const createdCategory = await prisma.skillCategory.create({
      data: {
        name: category.name,
        description: category.description,
        color: category.color
      }
    })

    console.log(`Created category: ${category.name}`)

    for (const skillName of category.skills) {
      await prisma.skill.create({
        data: {
          name: skillName.toLowerCase(),
          category: category.name.toUpperCase().replace(/ /g, '_'),
          categoryId: createdCategory.id,
          description: `${skillName} skill in ${category.name}`
        }
      })
      console.log(`Created skill: ${skillName}`)
    }
  }

  // Create a test employer
  console.log('Creating test users...')
  
  const employer = await prisma.user.create({
    data: {
      id: 'test_employer',
      email: 'employer@test.com',
      name: 'Tech Corp',
      role: 'EMPLOYER',
    },
  })

  // Create some test job listings with skills
  console.log('Creating test job listings...')
  
  const fullStackSkills = await prisma.skill.findMany({
    where: {
      name: {
        in: ['react', 'node.js', 'typescript', 'postgresql'].map(s => s.toLowerCase())
      }
    }
  })

  await prisma.jobListing.create({
    data: {
      title: 'Senior Full Stack Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'FULL_TIME',
      description: 'Looking for a senior full stack engineer with experience in React, Node.js, and TypeScript',
      requirements: '- 5+ years of experience in web development\n- Strong knowledge of React and Node.js\n- Experience with TypeScript and PostgreSQL\n- Good communication skills',
      salary: '$120,000 - $150,000',
      userId: employer.id,
      skills: {
        create: fullStackSkills.map(skill => ({
          skillId: skill.id,
          importance: 1.0,
          required: true
        }))
      }
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })