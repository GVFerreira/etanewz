// app/api/send-email/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import transporter from '@/lib/nodemailer'

interface CustomMailOptions extends nodemailer.SendMailOptions {
  template?: string
  context?: { [key: string]: any }
}

export async function POST(req: Request) {
  const { template, bcc, subject, email, context } = await req.json()

  const mailOptions: CustomMailOptions = {
    from: 'eTA NZ <noreply@etanz.com.br>',
    to: email,
    bcc,
    subject,
    template,
    context,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log({
      to: email,
      message: `Email sent successfully! Template: ${template}`,
      date: new Date().toLocaleString()
    })

    return NextResponse.json({
      message: `Email sent successfully! Template: ${template}`,
      date: new Date().toLocaleString()
    })
  } catch (error) {
    console.error(error)
    console.log({
      to: email,
      message: `Error sending email! Template: ${template}`,
      date: new Date().toLocaleString()
    })
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 })
  }
}
