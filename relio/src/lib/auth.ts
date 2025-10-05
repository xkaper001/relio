import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import type { Adapter, AdapterUser } from 'next-auth/adapters'

// Helper function to generate a unique username from email
async function generateUniqueUsername(email: string): Promise<string> {
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  let username = baseUsername
  let counter = 1
  
  // Check if username exists and increment counter if needed
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`
    counter++
  }
  
  return username
}

// Custom adapter that extends PrismaAdapter to handle username
function CustomPrismaAdapter(p: typeof prisma): Adapter {
  const adapter = PrismaAdapter(p) as Adapter
  
  return {
    ...adapter,
    async createUser(user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      const username = await generateUniqueUsername(user.email || `user${Date.now()}`)
      
      const newUser = await p.user.create({
        data: {
          ...user,
          username,
        },
      })
      
      return {
        id: newUser.id,
        email: newUser.email!,
        emailVerified: newUser.emailVerified,
        name: newUser.name,
        image: newUser.image,
        username: newUser.username,
      }
    },
    async getUser(id: string) {
      const user = await p.user.findUnique({ where: { id } })
      if (!user) return null
      
      return {
        id: user.id,
        email: user.email!,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
        username: user.username,
      }
    },
    async getUserByEmail(email: string) {
      const user = await p.user.findUnique({ where: { email } })
      if (!user) return null
      
      return {
        id: user.id,
        email: user.email!,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
        username: user.username,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      })
      if (!account) return null
      
      return {
        id: account.user.id,
        email: account.user.email!,
        emailVerified: account.user.emailVerified,
        name: account.user.name,
        image: account.user.image,
        username: account.user.username,
      }
    },
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
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
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback:', { token: !!token, session: !!session })
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { hasUser: !!user, hasToken: !!token })
      if (user) {
        token.username = user.username
        token.id = user.id
        token.email = user.email || undefined
      }
      return token
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}
