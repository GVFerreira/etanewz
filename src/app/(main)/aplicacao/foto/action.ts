'use server'

import { prisma } from '@/services/database'

export async function updateImage(visaId: string, imagePath: string) {
  const visa = prisma.visa.update({
    where: {
      id: visaId
    },
    data: {
      imagePath: imagePath.replace("public/", "/")
    }
  })

  if (visa) return visa
  return {status: 404, message: "Solicitação não encontrada"}
}