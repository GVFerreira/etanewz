// app/api/update-payment/route.ts
import { prisma } from '@/services/database'
import { NextResponse } from 'next/server'

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
    const updatedPayment = await prisma.payment.update({
      where: {
        id: data.id
      },
      data: {
        status: data.status
      }
    })
    return updatedPayment
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  const payment = await getPayment(String(body.data.id))

  if (!payment) return NextResponse.json({ message: 'Pagamento não encontrado' }, { status: 404 })

  // Verifica o status do pagamento
  if (payment.status === 'approved') {
    return NextResponse.json({ message: 'Pagamento já aprovado' }, { status: 200 })
  } else {
    // Processa o pagamento caso o evento seja de aprovação
    if (body.event === "OrderApproved" || body.event === "OrderPaidByPix") {
      await updatePayment({
        id: payment.id,
        status: "Aprovado",
      })
    }

    return NextResponse.json({ message: 'OK' }, { status: 202 })
  }
}
