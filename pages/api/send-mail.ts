// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import transporter from '@/lib/nodemailer'

interface CustomMailOptions extends nodemailer.SendMailOptions {
  template?: string;
  context?: { [key: string]: any };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { template, subject, email, context  } = req.body

  const mailOptions: CustomMailOptions = {
    from: 'eTA NZ <noreply@etanz.com.br>',
    to: email,
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

    res.status(200).json({ 
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
    res.status(500).json({ message: 'Error sending email' })
  }
}
