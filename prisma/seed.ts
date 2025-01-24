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
      password: await hash('password123', 12),
    },
  })

  // Create a test candidate
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@test.com',
      name: 'John Doe',
      role: 'CANDIDATE',
      password: await hash('password123', 12),
    },
  })

  console.log({ employer, candidate })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 