export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'
import fs from 'fs'
import path from 'path'

// Função para registrar logs em um arquivo
function logToFile(message: string) {
  const logPath = path.join(process.cwd(), 'abandoned-log.txt')
  const timestamp = new Date().toLocaleString()
  const logMessage = `[${timestamp}] ${message}\n`
  
  fs.appendFile(logPath, logMessage, (err) => {
    if (err) console.error('Erro ao gravar no arquivo de log:', err)
  })
}

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
    logToFile(`Erro ao buscar visas: ${e}`)
    return null
  }
}

export async function GET() {
  const visas = await getVisas()
  logToFile('Script de verifição de checkout abandonado')

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
        logToFile(`Email enviado para ${visa.email} com ID de aplicação ${visa.id}`)
      } catch(e) {
        logToFile(`Erro ao enviar email para ${visa.email}: ${e}`)
      }
    }
  }

  return NextResponse.json({
    message: `Script de verifição de checkout abandonado: ${new Date().toLocaleString()}`
  },
  { 
    headers: {
      'Cache-Control': 'no-store' 
    }
  })
}