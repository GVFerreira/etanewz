import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "eTA Nova Zelândia",
  description: "Com destino à Oceania."
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen bg-nzwhite">
        {children}
      </body>
    </html>
  )
}
