'use server'

import { prisma } from "@/services/database"

export async function getVisas(typeData: string, data: string) {
  try {
    const whereClause = (() => {
      switch (typeData) {
        case "codeETA":
          return { codeETA: data }
        case "email":
          return { email: data }
        case "passport":
          return { passportNumber: data }
        default:
          return null
      }
    })()

    if (!whereClause) return null

    const visas = await prisma.visa.findMany({
      where: whereClause,
      include: {
        payments: {
          include: {
            payment: true
          }
        }
      }
    })

    return visas
  } catch (e) {
    return null
  }
}
