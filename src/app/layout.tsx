import { GoogleTagManager } from '@next/third-parties/google'
import { Lato } from 'next/font/google'
import type { Metadata } from "next"
import "./globals.css"

import { Toaster } from "@/components/ui/toaster"

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', "900" ]
})

export const metadata: Metadata = {
  title: "NZeTA Nova Zelândia",
  description: "Com destino à Oceania."
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html lang="pt-br" className={lato.className}>
        <GoogleTagManager gtmId="GTM-WBH7K4CB" />
        <body className="flex flex-col min-h-screen bg-nzwhite">
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WBH7K4CB"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            >
            </iframe>
          </noscript>
          {children}
          <Toaster />
        </body>
      </html>
    </>
  )
}
