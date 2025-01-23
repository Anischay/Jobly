import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create dummy employer
  const employer = await prisma.user.upsert({
    where: { email: 'employer@test.com' },
    update: {},
    create: {
      email: 'employer@test.com',
      name: 'Tech Corp',
      role: 'EMPLOYER',
      password: await hash('password123', 12),
    },
  })

  // Create dummy job seekers
  const jobSeeker1 = await prisma.user.upsert({
    where: { email: 'candidate1@test.com' },
    update: {},
    create: {
      email: 'candidate1@test.com',
      name: 'John Doe',
      role: 'CANDIDATE',
      password: await hash('password123', 12),
      profile: {
        create: {
          title: 'Senior Software Engineer',
          bio: 'Passionate developer with 5+ years of experience',
          skills: 'JavaScript, React, Node.js, TypeScript',
          experience: '5+ years in web development',
          education: 'BS in Computer Science',
          location: 'San Francisco, CA',
        },
      },
    },
  })

  const jobSeeker2 = await prisma.user.upsert({
    where: { email: 'candidate2@test.com' },
    update: {},
    create: {
      email: 'candidate2@test.com',
      name: 'Jane Smith',
      role: 'CANDIDATE',
      password: await hash('password123', 12),
      profile: {
        create: {
          title: 'UX Designer',
          bio: 'Creative designer focused on user experience',
          skills: 'Figma, Adobe XD, UI/UX, Prototyping',
          experience: '3 years in product design',
          education: 'BFA in Design',
          location: 'New York, NY',
        },
      },
    },
  })

  // Create dummy job listings
  const jobs = await Promise.all([
    prisma.jobListing.create({
      data: {
        title: 'Senior React Developer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        description: 'We are looking for a senior React developer to join our team and help build our next-generation web applications.',
        requirements: 'React, TypeScript, 5+ years experience, Strong problem-solving skills',
        salary: '$130,000 - $180,000',
        userId: employer.id,
      },
    }),
    prisma.jobListing.create({
      data: {
        title: 'UI/UX Designer',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'FULL_TIME',
        description: 'Join our design team to create beautiful and intuitive user interfaces for our products.',
        requirements: 'Figma, Adobe XD, 3+ years experience, Portfolio required',
        salary: '$90,000 - $120,000',
        userId: employer.id,
      },
    }),
    prisma.jobListing.create({
      data: {
        title: 'Backend Developer',
        company: 'Tech Corp',
        location: 'New York, NY',
        type: 'FULL_TIME',
        description: 'Looking for a backend developer to build scalable APIs and microservices.',
        requirements: 'Node.js, Python, AWS, 4+ years experience',
        salary: '$120,000 - $160,000',
        userId: employer.id,
      },
    }),
    prisma.jobListing.create({
      data: {
        title: 'DevOps Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'CONTRACT',
        description: 'Help us improve our infrastructure and deployment processes.',
        requirements: 'Docker, Kubernetes, AWS, CI/CD',
        salary: '$140,000 - $180,000',
        userId: employer.id,
      },
    }),
    prisma.jobListing.create({
      data: {
        title: 'Frontend Developer Intern',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        type: 'INTERNSHIP',
        description: 'Great opportunity for a student or recent graduate to gain hands-on experience.',
        requirements: 'Basic JavaScript, HTML, CSS, Currently pursuing CS degree',
        salary: '$30/hour',
        userId: employer.id,
      },
    }),
  ])

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 