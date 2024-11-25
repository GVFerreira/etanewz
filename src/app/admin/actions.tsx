'use server'

import { prisma } from '@/services/database'

export async function getVisas() {
  const visas = prisma.visa.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      payments: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          payment: true // Adicionando os dados de pagamento
        }
      }
    }
  })

  return visas
}

export async function getPayments() {
  const visas = prisma.payment.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      visas: {
        include: {
          visas: true // Adicionando os dados de pagamento
        }
      }
    }
  })

  return visas
}

export async function updateStatus(data: {id: string, name: string, statusETA: string, email: string, codeETA: string, attachment: string | null}) {
  try {
    const visa = await prisma.visa.update({
      where: {
        id: data.id
      },
      data: {
        statusETA: data.statusETA,
        attachmentPath: data.attachment
      }
    })

    if (data.statusETA === "Aprovado" || data.statusETA === "Recusado") {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          bcc: 'contato@etanz.com.br',
          subject: `SOLICITAÇÃO ${data.codeETA} - NZeTA`,
          template: data.statusETA === 'Aprovado' ? 'documento' : 'documento-negado',
          attachments: [
            {
              filename: visa.attachmentPath?.split('/').pop(),
              path: `${process.env.NEXT_PUBLIC_APP_URL}/${visa.attachmentPath}`
            }
          ],
          context: {
            clientName: data.name,
            codeETA: data.codeETA,
          }
        })
      })
    }

    return visa
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function updateEmail(data: {id: string, email: string}) {
  try {
    const visa = await prisma.visa.update({
      where: {
        id: data.id
      },
      data: {
        email: data.email
      }
    })

    return visa
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function sendMessage(data: {id: string, message: string}) {
  try {
    const visa = await prisma.visa.update({
      where: {
        id: data.id
      },
      data: {
        message: data.message
      }
    })

    return visa
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function deleteVisa(id: string) {
  try {
    const visa = await prisma.visa.delete({
      where: {
        id
      }
    })

    return visa
  } catch(e) {
    console.log(e)
    return null
  }
}