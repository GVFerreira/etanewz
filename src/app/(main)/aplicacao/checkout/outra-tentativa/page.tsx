'use client'

import { Suspense } from "react"
import { getCheckoutVisas, getInstallmentsAppmax, getPayment } from "../action"
import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import Image from "next/image"

// Carrega o Select de forma dinâmica, desabilitando o SSR
const Select = dynamic(() => import('react-select'), { ssr: false })
import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useState } from "react"
import { CreditCard } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

import HeaderCKO from "@/app/components/header-cko"
import FooterCKO from "@/app/components/footer-cko"

interface CartItem {
  id: string
  name: string
  price: number
}

interface CardData {
  name: string
  surname: string
  email: string
  telephone: string
  accountName: string
  cardNumber: string
  monthExpire: number
  yearExpire: number
  cvv: string
  installments: string
  documentNumber: string
  quantity: number
  visas: string[]
}

interface PixData {
  name: string
  surname: string
  email: string
  telephone: string
  accountName: string
  documentNumber: string
  quantity: number
  visas: string[]
}

function CardPaymentFields() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState } = useForm<CardData>()
  const [installments, setInstallments] = useState<{label: string, value: string}[]>([])

  const searchParams = useSearchParams()
  const paymentId = searchParams?.get('paymentId')

  useEffect(() => {
    // fetch para consulta das parcelas
    const fetchData = async () => {
      try {

        const payment = await getPayment(paymentId as string)

        if (!payment) return
        let visas = payment.visas.map((visa) => {
          return visa.visas
        })

        let visaIds = payment.visas.map((visa) => {
          return visa.visas.id
        })

        const response = await getInstallmentsAppmax(payment.visas.length, visaIds)

        const installmentsData = Object.entries(response.data).map(([key, value]) => ({
          // o valor é a descrição da parcela
          label: value as string, 
          value: value as string 
        }))
        
        setInstallments(installmentsData)

        

        localStorage.setItem('visasInSession', JSON.stringify(visaIds))

        if (visas) {
          setValue('quantity', visas.length)
          setValue('name', visas[0].name)
          setValue('surname', visas[0].surname)
          setValue('email', visas[0].email)
          setValue('telephone', visas[0].telephone)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
    
  }, [paymentId, setValue])

  const handleMonthExpire = (selectedOption: any) => setValue('monthExpire', selectedOption.value)
  const handleYearExpire = (selectedOption: any) => setValue('yearExpire', selectedOption.value)
  const handleInstallments = (selectedOption: any) => setValue('installments', selectedOption.value)


  const handleCardPayment: SubmitHandler<CardData> = async (data) => {
    try {
      const payment = await fetch('/api/checkout/card', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      const responsePayment = await payment.json()

      if (responsePayment.status === "Aprovado") {
        router.push("/aplicacao/checkout/obrigado")
      } else {
        router.push("/aplicacao/checkout/negado")
      }
      
      router.refresh()
    } catch (e) {
      console.log(e)
      router.refresh()
      toast({
        variant: "destructive",
        title: 'Erro',
        description: 'Um erro ocorreu ao processar seu pagamento'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCardPayment)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="account-name">Nome completo</Label>
        <Input id="account-name" placeholder="Ex.: João da Silva" {...register('accountName')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="card-number">Número do cartão</Label>
        <Input id="card-number" placeholder="1234 5678 9012 3456" maxLength={16} {...register('cardNumber')}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Data de validade</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select
              options={months}
              className="w-full"
              onChange={handleMonthExpire}
              placeholder="Mês"
              required
            />
            <Select
              options={years}
              className="w-full"
              onChange={handleYearExpire}
              placeholder="Ano"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" {...register('cvv')}/>
        </div>
        <div className="grid gap-2">
          <Label>Parcelas</Label>
          <Select
            options={installments}
            className="w-full"
            onChange={handleInstallments}
            placeholder="Selecione"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="document-number">CPF</Label>
          <Input id="document-number" placeholder="Digite apenas números, sem traços ou hífens" maxLength={11}  {...register('documentNumber')} />
        </div>
      </div>
      <Button type="submit" className="md:w-1/2 m-auto bg-green-600 hover:bg-green-500" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Processando pagamento" : "Pagar com cartão de crédito"}</Button>
    </form>
  )
}

function BankTransferFields() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState } = useForm<PixData>()

  useEffect(() => {
    const visasInSession = localStorage.getItem('visasInSession')
    const visaIds = JSON.parse(visasInSession as string)
  
    if (!visaIds) return
  
    // fetch para consulta das parcelas
    const fetchData = async () => {
      try {
        let visas = await getCheckoutVisas(visaIds)
        if (visas) {
          setValue('visas', visaIds)
          setValue('quantity', visas.length)
          setValue('name', visas[0].name)
          setValue('surname', visas[0].surname)
          setValue('email', visas[0].email)
          setValue('telephone', visas[0].telephone)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
    
  }, [setValue])

  const handlePixPayment: SubmitHandler<PixData> = async (data) => {
    try {
      const payment = await fetch('/api/checkout/pix', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      const responsePayment = await payment.json()

      if (payment.status === 201) {
        localStorage.setItem('qrCode', responsePayment.qrCode)
        localStorage.setItem('qrCodeBase64', responsePayment.qrCodeBase64)
        localStorage.setItem('paymentId', responsePayment.id)
        // Redirecionar para a página de checkout/pix passando os dados como query parameters
        router.push(`/aplicacao/checkout/pix`)
      } else if ( payment.status === 200) {
        console.log("Não foi possível redirecionar a página de QR Code")
        toast({
          variant: "destructive",
          title: 'Falha ao gerar PIX',
          description: 'Um erro ocorreu ao gerar o seu pagamento. Tente novamente mais tarde'
        })
      }
    } catch (e) {
      console.log(e)
      router.refresh()
      toast({
        variant: "destructive",
        title: 'Erro',
        description: 'Um erro ocorreu ao processar seu pagamento'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handlePixPayment)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="account-name">Nome completo</Label>
        <Input id="account-name" placeholder="Ex.: José da Silva" required {...register('accountName')}/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="document-number">CPF</Label>
        <Input id="document-number" placeholder="Ex.: 00000000000" maxLength={11} required {...register('documentNumber')} />
        <p className="text-sm">Digite apenas os números, sem pontos ou hífens.</p>
      </div>
      <Button
        type="submit"
        className="md:w-1/2 m-auto bg-green-600 hover:bg-green-500"
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? "Gerando QR Code" : "Gerar PIX QR Code"}
      </Button>
    </form>
  )
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    const visasInSession = localStorage.getItem('visasInSession')
    const visaIds = JSON.parse(visasInSession as string)

    if (!visaIds) return

    const fetchData = async () => {
      try {
        let visas = await getCheckoutVisas(visaIds)
        if (visas) {
          const formattedVisas = visas.map((visa) => ({
            id: visa.id,
            name: `${visa.name} ${visa.surname}`.toUpperCase(),
            // price: 297
            price: 5
          }))
          setCartItems(formattedVisas)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderCKO />
      <main style={{ flex: "1 1 0" }} className="flex justify-center items-center p-4 md:py-16">
        <Card className="w-full max-w-3xl mx-auto">
          <Suspense fallback={<div>Carregando...</div>}>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Checkout</CardTitle>
              <Image src="/appmax.webp" alt="Appmax" width={744} height={154} className="w-1/3 m-auto" />
              <CardDescription className="text-center">Esta página está protegida por todas as etapas de segurança da Appmax.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Suas solicitações</h3>
                <ul className="space-y-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span>{item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between w-full text-lg font-semibold">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Método de pagamento</h3>
                <RadioGroup
                  defaultValue="card"
                  onValueChange={(value) => setPaymentMethod(value)}
                  className="grid"
                >
                  {/* Seus métodos de pagamento */}
                </RadioGroup>
              </div>
            </CardContent>
          </Suspense>
        </Card>
      </main>
      <FooterCKO />
    </div>
  )
}

const months = [
  { label: "01", value: "1" },
  { label: "02", value: "2" },
  { label: "03", value: "3" },
  { label: "04", value: "4" },
  { label: "05", value: "5" },
  { label: "06", value: "6" },
  { label: "07", value: "7" },
  { label: "08", value: "8" },
  { label: "09", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" }
]

const years = Array.from({ length: 2070 - 2024 + 1 }, (_, i) => {
  const year = (2024 + i).toString()
  return { label: year, value: year }
})
