'use server'

import { prisma } from '@/services/database'

export async function getCheckoutVisas(visaId: string[]) {
  const visas = await prisma.visa.findMany({
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
      stayInNZ: true,
      codeETA: true,
    }
  })

  if (visas) return visas
}

export async function getInstallmentsAppmax(quantity: number, visaIds: string[]) {
  try {
    let visas = await getCheckoutVisas(visaIds)

    const hasStayInNZ = visas?.some(visa => visa.stayInNZ)
    
    const reqInstallments = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/payment/installments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "access-token": process.env.APPMAX_ACCESS_TOKEN,
        "installments": 6,
        "total": quantity * (hasStayInNZ ? 297 + 350 : 297),
        "format": 2 
      })
    })

    const response = await reqInstallments.json()

    return response
  } catch (e) {
    console.log(e)
  }
}

export async function getPayment(id: string) {
  try {
    const payment = prisma.payment.findUnique({
      where: {
        id
      },
      include: {
        visas: {
          include: {
            visas: true
          }
        }
      }
    })

    return payment
  } catch(e) {
    return null
  }
}

export async function getPaymentPix(id: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        id
      }
    })

    if (payment?.status === 'Aprovado') {
      return {
        status: true,
        message: 'O pagamento foi recebido via PIX'
      }
    } else {
      return {
        return: false,
        message: 'Nenhum valor foi recebido até o momento'
      }
    }
  } catch (e) {

  }
}