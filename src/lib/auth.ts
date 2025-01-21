import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user?.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "CANDIDATE" | "EMPLOYER" | "ADMIN"
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      // If using OAuth, create a default role for new users
      if (account && account.type === "oauth" && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        })
        
        if (!dbUser) {
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              name: token.name,
              image: token.picture,
              role: "CANDIDATE",
            },
          })
          // Create empty profile
          await prisma.profile.create({
            data: {
              userId: newUser.id,
            },
          })
          token.role = "CANDIDATE"
        } else {
          token.role = dbUser.role
        }
      }
      return token
    }
  }
} 