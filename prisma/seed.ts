import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a test employer
  const employer = await prisma.user.create({
    data: {
      email: 'employer@test.com',
      name: 'Tech Corp',
      role: 'EMPLOYER',
      hashedPassword: await hash('password123', 12),
    },
  })

  // Create some test job listings
  await prisma.jobListing.create({
    data: {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'FULL_TIME',
      description: 'Looking for a senior software engineer with experience in React and Node.js',
      requirements: 'At least 5 years of experience in web development',
      salary: '$120,000 - $150,000',
      userId: employer.id,
    },
  })

  // Create a test candidate
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@test.com',
      name: 'John Doe',
      role: 'CANDIDATE',
      hashedPassword: await hash('password123', 12),
    },
  })

  // Create a profile for the candidate
  await prisma.profile.create({
    data: {
      userId: candidate.id,
      title: 'Full Stack Developer',
      bio: 'Passionate about web development',
      skills: 'React, Node.js, TypeScript',
      experience: '3 years in web development',
      education: 'BS in Computer Science',
      location: 'New York, NY',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 