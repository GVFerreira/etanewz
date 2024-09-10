'use server'

import { prisma } from '@/services/database'

export async function getVisas() {
  const visas = prisma.visa.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return visas
}