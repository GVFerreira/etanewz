import type { Metadata } from "next"
import { Lato } from 'next/font/google'
import "./globals.css"

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', "900" ]
})

export const metadata: Metadata = {
  title: "eTA Nova Zelândia",
  description: "Com destino à Oceania."
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={lato.className}>
      <body className="flex flex-col min-h-screen bg-nzwhite">
        {children}
      </body>
    </html>
  )
}
