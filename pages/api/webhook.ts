'use server'

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/services/database'

interface Data {
  id: string
  status: string
}

async function getPayment(idOrder: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        idOrder
      }
    })

    return payment
  } catch (e) {
    console.log(e)
    return null
  }
}


async function updatePayment(data: Data) {
  try {
    const updatePayment = await prisma.payment.update({
      where: {
        id: data.id
      },
      data: {
        status: data.status
      }
    })

    return updatePayment
  } catch (e) {
    console.log(e)
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  if (method !== 'POST') return res.status(405).json({ message: 'Método de requisição não permitido' })

  const payment = await getPayment(body.data.id)

  if (!payment) return res.status(404)

  // Verifica o status do pagamento
  if (payment.status === 'approved') {
    return res.status(200)
  } else {
    // Processa o pagamento caso o evento seja de aprovação
    if (body.event === "OrderApproved" || body.event === "OrderPaidByPix") {
      await updatePayment({
        id: payment.id,
        status: "Aprovado",
      })
    }

    return res.status(202).send("OK")
  }
}
