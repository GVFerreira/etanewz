import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../database'

export default NextAuth({
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/login'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hub@etanz.com.br" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          const usermail = credentials?.email as string
          const userpassword = credentials?.password as string

          const user = await prisma.user.findUnique({
            where: { email: usermail }
          })

          if (!user) return null

          const isPasswordValid = bcrypt.compareSync(userpassword, user.password)
          if (!isPasswordValid) return null

          return user
        } catch (e) {
          console.error(e)
          return null
        }
      }
    })
  ],
  events: {}
})
