import cron from 'node-cron'
import { prisma } from '@/services/database'

async function getVisas() {
  const visas = await prisma.visa.findMany({
    where: {
      payments: {
        none: {}
      }
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
}

export default function scheduleCronJob () {
  cron.schedule('*/5 * * * *', async () => {
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
  })
}
