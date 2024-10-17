import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

// Função para criar um pagamento e associar vistos ao pagamento
async function createPayment(data: any, visaIds: string[]) {
  try {
    const payment = await prisma.payment.create({
      data: {
        ...data,
      }
    })

    const visaPayments = visaIds.map((visaId) => ({
      paymentId: payment.id,
      visasId: visaId,
    }))

    await prisma.visaPayment.createMany({
      data: visaPayments,
    })

    return payment
  } catch (e) {
    console.error(e)
    return null
  }
}

function formatTel(numberTel: string) {
  return numberTel.replace(/\D/g, '').slice(0, 11)
}

function expirateDate() {
  let currentDate = new Date()
  currentDate.setHours(currentDate.getHours() + 12)
  return currentDate.toISOString().slice(0, 19).replace('T', ' ')
}

// Função POST para processar o pagamento com PIX
export async function POST(req: Request) {
  try {
    const { name, surname, email, telephone, documentNumber, amount, quantity, visas } = await req.json()

    const reqIp = req.headers.get('x-forwarded-for')
    const userIp = reqIp ? reqIp.split(',')[0] : 'IP não disponível'

    // Envia o pedido para criar o cliente
    const newClientResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'access-token': process.env.APPMAX_ACCESS_TOKEN,
        'firstname': name,
        'lastname': surname,
        'email': email,
        'telephone': formatTel(telephone),
        'ip': userIp
      })
    })
    const client = await newClientResponse.json()

    if (client.success) {
      // Cria um pedido
      const newOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'access-token': process.env.APPMAX_ACCESS_TOKEN,
          'products': [{
            'sku': '835103',
            'name': 'Assessoria - NZeTA Nova Zelândia',
            'qty': quantity,
            'price': amount,
            'digital_product': 1
          }],
          'customer_id': client.data.id
        })
      })
      const order = await newOrderResponse.json()

      // Processa o pagamento PIX
      const newPaymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/payment/pix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'access-token': process.env.APPMAX_ACCESS_TOKEN,
          'cart': { 'order_id': order.data.id },
          'customer': { 'customer_id': order.data.customer_id },
          'payment': {
            'pix': {
              'document_number': documentNumber,
              'expiration_date': expirateDate()
            }
          }
        })
      })
      const pixPayment = await newPaymentResponse.json()

      // Verifica se o pagamento foi bem-sucedido
      if (pixPayment.success) {
        const payment = await createPayment({
          idClient: `${client.data.id}`,
          idOrder: `${order.data.id}`,
          transactionAmount: order.data.total,
          transactionId: pixPayment.data.pay_reference,
          docNumber: documentNumber,
          status: 'Pagamento pendente',
          paymentTypeId: 'pix',
          qrCode: pixPayment.data.pix_emv,
          qrCodeBase64: pixPayment.data.pix_qrcode,
        }, visas)

        return NextResponse.json({
          id: payment?.id,
          qrCode: pixPayment.data.pix_emv,
          qrCodeBase64: pixPayment.data.pix_qrcode
        }, { status: 201 })
      } else {
        // Caso falhe o pagamento
        const payment = await createPayment({
          idClient: `${client.data.id}`,
          idOrder: `${order.data.id}`,
          transactionAmount: amount,
          transactionId: '',
          docNumber: documentNumber,
          status: 'Falha ao gerar PIX',
          paymentTypeId: 'pix',
        }, visas)

        return NextResponse.json(payment, { status: 200 })
      }
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro no processamento do pagamento' }, { status: 500 })
  }
}
