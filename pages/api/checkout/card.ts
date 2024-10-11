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
    visas,
    name,
    surname,
    email,
    telephone,
    accountName,
    cardNumber,
    monthExpire,
    yearExpire,
    cvv,
    installments,
    documentNumber,
    quantity
  } = JSON.parse(req.body)

  function formatTel(numberTel: string) { return numberTel.replace(/\D/g, '').slice(0, 11) }

  function separateInstallmentsAndValues (inputForm: string) {
    /// String original
    let stringOriginal = inputForm

    // Encontrando o índice do 'R$'
    let indiceR$ = stringOriginal.indexOf('R$')

    // Extraindo os 2 primeiros caracteres
    let installments = stringOriginal.substr(0, 2)

    // Extraindo os caracteres a partir do índice do 'R$' até o final
    let valueInstallment = stringOriginal.substr(indiceR$ + 3)

    // Convertendo o valor da parcela para float (substituindo ',' por '.' antes de converter)
    let valueInstallmentFloat = parseFloat(valueInstallment.replace('.', '').replace(',', '.'))

    return { installment: parseInt(installments), valueInstallmentFloat }
  }

  function pricePerVisa () {
    const { installment, valueInstallmentFloat } = separateInstallmentsAndValues(installments)
    const total = installment * valueInstallmentFloat
    return total / quantity
  }

  const reqIp = req.headers['x-forwarded-for'] as string
  const userIp = reqIp ? reqIp.split(',')[0] : 'IP não disponível'

  try {
    const newClient = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          "access-token": process.env.APPMAX_ACCESS_TOKEN,
          "firstname": name,
          "lastname": surname,
          "email": email,
          "telephone": formatTel(telephone),
          "ip": userIp
      })
    })
    const client = await newClient.json()

    if(client.success) {
      const newOrder = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "access-token": process.env.APPMAX_ACCESS_TOKEN,
          "products": [{
            "sku": "835103",
            "name": "Assessoria - eTA Nova Zelândia",
            "qty": quantity,
            "price": pricePerVisa(),
            "digital_product": 1
          }],
          "customer_id": client.data.id
        })
      })
      const order = await newOrder.json()
  
      const newPayment = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/payment/credit-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "access-token": process.env.APPMAX_ACCESS_TOKEN,
          "cart": { "order_id": order.data.id },
          "customer": { "customer_id": order.data.customer_id },
          "payment": {
            "CreditCard": {
              "number": cardNumber,
              "cvv": cvv,
              "month": parseInt(monthExpire),
              "year": parseInt(yearExpire),
              "document_number": documentNumber,
              "name": accountName,
              "installments": separateInstallmentsAndValues(installments).installment,
              "soft_descriptor": "ETAHUB"
            }
          }
        })
      })
      const cardPayment = await newPayment.json()

      if (cardPayment.success) {
        try {
          const payment = await createPayment({
            idClient: `${client.data.id}`,
            idOrder: `${order.data.id}`,
            transactionAmount: order.data.total,
            transactionId: cardPayment.data.pay_reference,
            docNumber: documentNumber,
            status: "Aprovado",
            paymentTypeId: "credit_card",
          }, visas)

          return payment
        } catch(e) {
          console.log(e)
          return null
        }
      } else {
      try {
        const payment = await createPayment({
          idClient: `${client.data.id}`,
          idOrder: `${order.data.id}`,
          transactionAmount: 0.0,
          transactionId: "",
          docNumber: documentNumber,
          status: "Falha no pagamento",
          paymentTypeId: "credit_card",
        }, visas)

        return payment
      } catch(e) {
        console.log(e)
        return null
      }
      }
    }
   } catch (e) {
    console.log(e)
   }
}
