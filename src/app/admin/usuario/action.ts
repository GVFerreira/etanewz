'use server'

import { prisma } from "@/services/database"
import bcrypt from 'bcryptjs'

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  
    return users
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function createUser(data: any) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (existingUser) {
    throw new Error("E-mail já cadastrado.")
  }
  
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(data.password_one, salt)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  })

  return user
}