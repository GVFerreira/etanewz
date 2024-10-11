'use server'

import { prisma } from '@/services/database'

export async function getVisas() {
  const visas = prisma.visa.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      payments: {
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