'use server'

import { prisma } from '@/services/database'

export async function getUniqueVisa(visaId: string) {
  const visa = prisma.visa.findUnique({
    where: {
      id: visaId
    }
  })

  if (visa) return visa
  return {status: 404, message: "Solicitação não encontrada"}
}