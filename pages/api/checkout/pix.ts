'use server'

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/services/database'

async function createPayment(data: any, visaIds: string[]) {
  try {
    const payment = await prisma.payment.create({
      data: {
        ...data,
      }
    })

    // Associa cada visto ao pagamento na tabela VisaPayment
    const visaPayments = visaIds.map((visaId) => ({
      paymentId: payment.id,
      visasId: visaId,
    }))

    await prisma.visaPayment.createMany({
      data: visaPayments,
    })

    return payment
  } catch (e) {
    console.log(e)
    return { status: 400, message: e }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método de requisição não permitido' })

  const {
    name,
    surname,
    email,
    telephone,
    documentNumber,
    quantity,
    visas
  } = JSON.parse(req.body)

  function formatTel(numberTel: string) { return numberTel.replace(/\D/g, '').slice(0, 11) }

  const reqIp = req.headers['x-forwarded-for'] as string
  const userIp = reqIp ? reqIp.split(',')[0] : 'IP não disponível'

  function expirateDate() {
    let currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 12)
    let expirationDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')
    return expirationDate
  }

  try {
    const newClient = await fetch(`https://homolog.sandboxappmax.com.br/api/v3/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          "access-token": "45E9B0B3-ABBCFC87-FC1FC616-56706B71",
          "firstname": name,
          "lastname": surname,
          "email": email,
          "telephone": formatTel(telephone),
          "ip": userIp
      })
    })
    const client = await newClient.json()

    if(client.success) {
      const newOrder = await fetch(`https://homolog.sandboxappmax.com.br/api/v3/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "access-token": "45E9B0B3-ABBCFC87-FC1FC616-56706B71", //TESTE
          "products": [{
            "sku": "835103",
            "name": "Assessoria - eTA Nova Zelândia",
            "qty": quantity,
            // "price": 297, // PROD
            "price": 0.5, // DEV
            "digital_product": 1
          }],
          "customer_id": client.data.id
        })
      })
      const order = await newOrder.json()
  
      const newPayment = await fetch(`https://homolog.sandboxappmax.com.br/api/v3/payment/credit-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "access-token": "45E9B0B3-ABBCFC87-FC1FC616-56706B71", //TESTE
          "cart": { "order_id": order.data.id },
          "customer": { "customer_id": order.data.customer_id },
          "payment": {
          "pix": {
              "document_number": documentNumber,
              "expiration_date": expirateDate()
            }
          }
        })
      })
      const pixPayment = await newPayment.json()

      if (pixPayment.success) {
        try {
          const payment = await createPayment({
            idClient: `${client.data.id}`,
            idOrder: `${order.data.id}`,
            transactionAmount: order.data.total,
            transactionId: pixPayment.data.pay_reference,
            docNumber: documentNumber,
            status: "Pagamento pendente",
            paymentTypeId: "pix",
            qrCode: pixPayment.data.pix_emv,
            qrCodeBase64: pixPayment.data.pix_qrcode,
          }, visas)

          return res.status(201).json(payment)
        } catch(e) {
          console.log(e)
          return res.status(500).json(e)
        }
      } else {
        try {
          const payment = await createPayment({
            idClient: `${client.data.id}`,
            idOrder: `${order.data.id}`,
            transactionAmount: 0.0,
            transactionId: "",
            docNumber: documentNumber,
            status: "Falha ao gerar PIX",
            paymentTypeId: "pix",
          }, visas)

          return res.status(200).json(payment)
        } catch(e) {
          console.log(e)
          return res.status(500).json(e)
        }
      }
    }
   } catch (e) {
    console.log(e)
    return res.status(500).json(e)
   }
}
