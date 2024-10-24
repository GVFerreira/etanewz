import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

async function getVisas() {
  const now = new Date()
  const sevenMinutesAgo = new Date(now.getTime() - 7 * 60 * 1000)
  const seventeenMinutesAgo = new Date(now.getTime() - 17 * 60 * 1000)

  try {
    const visas = await prisma.visa.findMany({
      where: {
        payments: {
          none: {}
        },
        createdAt: {
          gte: seventeenMinutesAgo, // Criado há pelo menos 17 minutos
          lte: sevenMinutesAgo, // Criado no máximo há 7 minutos
        },
      },
      orderBy: {
        createdAt: "asc"
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        codeETA: true,
      }
    })
  
    if (visas) return visas
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function GET() {
  const visas = await getVisas()

  if (visas) {
    for (const visa of visas) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: visa.email,
            bcc: 'contato@etanz.com.br',
            subject: 'NZeTA Nova Zelândia - Finalize sua aplicação',
            template: 'lembrete',
            context: {
              fullname: `${visa.name} ${visa.surname}`,
              codeETA: visa.codeETA,
              visaId: visa.id
            }
          })
        })
      } catch(e) {
        console.log(e)
      }
    }
  }
  console.log(`Script de verifição de checkout abandonado: ${new Date().toLocaleString()}`)
  return NextResponse.json({
    message: `Script de verifição de checkout abandonado: ${new Date().toLocaleString()}`
  })
}