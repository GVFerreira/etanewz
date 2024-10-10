'use server'

import { prisma } from '@/services/database'

export async function getCheckoutVisas(visaId: string[]) {
  const visas = prisma.visa.findMany({
    where: {
      id: { in: visaId}
    },
    orderBy: {
      createdAt: "asc"
    },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      telephone: true,
      codeETA: true,
    }
  })

  if (visas) return visas
}