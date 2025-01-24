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
  debug: true,
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
    signIn: '/early-access',
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn callback:', { user, account, profile });
      return true
    },
    async jwt({ token, user, account, profile, trigger }) {
      console.log('JWT callback:', { 
        token, 
        user, 
        accountType: account?.type,
        accountState: account?.state,
        trigger 
      });

      if (user) {
        token.role = user.role
      }
      
      // If using OAuth, create a default role for new users
      if (account && account.type === "oauth") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        })
        
        if (!dbUser) {
          // Use state parameter if available, otherwise default to CANDIDATE
          const stateStr = account.state as string | undefined;
          const role = stateStr?.includes("EMPLOYER") ? "EMPLOYER" : "CANDIDATE";
          console.log('Using role:', role);
          
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              name: token.name,
              image: token.picture,
              role: role,
            },
          })
          console.log('Created new user:', newUser);
          
          // Create empty profile
          await prisma.profile.create({
            data: {
              userId: newUser.id,
            },
          })
          token.role = role
        } else {
          console.log('Found existing user:', dbUser);
          token.role = dbUser.role
        }
      }
      return token
    }
  }
} 