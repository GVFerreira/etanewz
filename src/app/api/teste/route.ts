import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        subject: 'Formulário de contato',
        template: 'contato',
        context: {
          email: 'teste@teste.com',
          name: "Meu Teste",
          subject: "Um teste",
          message: "Estou testando"
        }
      })
    })

    return NextResponse.json({ status: 201, ok: true })
  } catch (e) {
    return NextResponse.json(e, { status: 500 })
  }
}
