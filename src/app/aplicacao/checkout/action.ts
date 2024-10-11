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

export async function getInstallmentsAppmax(quantity: number) {
  try {
    const reqInstallments = await fetch('https://homolog.sandboxappmax.com.br/api/v3/payment/installments', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "access-token": process.env.APPMAX_ACCESS_TOKEN,
        "installments": 6,
        "total": quantity * 297,
        "format": 2 
      })
    })

    const response = await reqInstallments.json()

    return response
  } catch (e) {
    console.log(e)
  }
}