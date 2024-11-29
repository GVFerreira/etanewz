'use server'

import { NextResponse } from 'next/server'
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
    return null
  }
}

async function getVisasEmail(visasArray: string[]) {
  try {
    const visas = await prisma.visa.findMany({
      where: {
        id: { in: visasArray }
      }
    })

    return visas
  } catch (e) {
    console.log(e)
    return null
  }
}

// Handler da função POST em /app/api/checkout/payment/route.ts
export async function POST(req: Request) {
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
  } = await req.json()

  function formatTel(numberTel: string) { return numberTel.replace(/\D/g, '').slice(0, 11) } 

  function separateInstallmentsAndValues(inputForm: string) {
    let stringOriginal = inputForm
    let indiceR$ = stringOriginal.indexOf('R$')
    let installments = stringOriginal.substr(0, 2)
    let valueInstallment = stringOriginal.substr(indiceR$ + 3)
    let valueInstallmentFloat = parseFloat(valueInstallment.replace('.', '').replace(',', '.'))

    return { installment: parseInt(installments), valueInstallmentFloat }
  }

  function pricePerVisa() {
    const { installment, valueInstallmentFloat } = separateInstallmentsAndValues(installments)
    const total = installment * valueInstallmentFloat
    return total / quantity
  }

  const reqIp = req.headers.get('x-forwarded-for') || 'IP não disponível'
  const userIp = reqIp.split(',')[0]

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

    if (client.success) {
      const newOrder = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APPMAX}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "access-token": process.env.APPMAX_ACCESS_TOKEN,
          "products": [{
            "sku": "835103",
            "name": "Assessoria - NZeTA Nova Zelândia",
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
              "year": parseInt(yearExpire.slice(-2)),
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

          const dataVisas = await getVisasEmail(visas)
          if (dataVisas) {
            for (const visa of dataVisas) {
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: visa.email,
                  bcc: 'contato@etanz.com.br',
                  subject: 'Pagamento aprovado',
                  template: 'pagamento-aprovado',
                  context: {
                    codeETA: visa.codeETA,
                  }
                })
              })
            }
          }

          return NextResponse.json(payment, { status: 201 })
        } catch (e) {
          console.log(e)
          return NextResponse.json(e, { status: 500 })
        }
      } else {
        try {
          const payment = await createPayment({
            idClient: `${client.data.id}`,
            idOrder: `${order.data.id}`,
            transactionAmount: order.data.total,
            transactionId: "",
            docNumber: documentNumber,
            status: "Negado",
            paymentTypeId: "credit_card",
          }, visas)

          const dataVisas = await getVisasEmail(visas)

          if (dataVisas) {
            for (const visa of dataVisas) {
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: visa.email,
                  bcc: 'contato@etanz.com.br',
                  subject: 'Pagamento Recusado',
                  template: 'pagamento-recusado',
                  context: {
                    codeETA: visa.codeETA,
                    paymentId: payment?.id
                  }
                })
              })
            }
          }


          return NextResponse.json(payment, { status: 200 })
        } catch (e) {
          console.log(e)
          return NextResponse.json(e, { status: 500 })
        }
      }
    }
  } catch (e) {
    console.log(e)
    return NextResponse.json(e, { status: 500 })
  }
}
