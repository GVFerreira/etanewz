'use client'

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"

import { getCheckoutVisas } from "../action"
import { CircleX, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FooterCKO from "@/app/components/footer-cko"
import HeaderCKO from "@/app/components/header-cko"

interface Visas {
  codeETA: string
}

function NegadoContent() {
  const [cartItems, setCartItems] = useState<Visas[]>([])

  const searchParams = useSearchParams()
  const paymentId = searchParams?.get('paymentId')

  useEffect(() => {
    const visasInSession = localStorage.getItem('visasInSession')
    const visaIds = JSON.parse(visasInSession as string)

    if (!visaIds) return

    const fetchData = async () => {
      try {
        let visas = await getCheckoutVisas(visaIds)
        if (visas) {
          const formattedVisas = visas.map((visa) => ({
            codeETA: visa.codeETA
          }))
          setCartItems(formattedVisas)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
          <CircleX className="w-8 h-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Negado!</CardTitle>
        <CardDescription>Seu pagamento foi negado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Detalhes da compra:</h3>
          {cartItems.map((item, index) => (
            <p key={index}>Código de acompanhamento: <b>{item.codeETA}</b></p>
          ))}
          <p>Data: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        <p className="text-center text-muted-foreground">
          Nós enviaremos todas as atualizações do seu processo através do e-mail cadastrado previamente.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto">
          <Link href={`/aplicacao/checkout/outra-tentativa?paymentId=${paymentId}`} className="flex justify-center">
            <Wallet className="mr-2 h-4 w-4" />
            Tentar novamente
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Negado() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderCKO />
      <main style={{ flex: "1 1 0" }} className="flex items-center justify-center p-4">
        <Suspense fallback={<div>Carregando...</div>}>
          <NegadoContent />
        </Suspense>
      </main>
      <FooterCKO />
    </div>
  )
}
