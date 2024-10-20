'use client'

import { getVisas } from "./action"
import dynamic from "next/dynamic"
import Link from "next/link"

const Select = dynamic(() => import('react-select'), { ssr: false })
import { SubmitHandler, useForm } from "react-hook-form"
import { Search } from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import Footer from "@/app/components/footer"
import Header from "@/app/components/header"

interface GetData {
  typeData: string
  data: string
}

interface Visa {
  name: string
  email: string
  status: string
  transactionAmount: number
  statusETA: string
  message?: string
  attachmentPath?: string
  createdAt: Date
}

export default function AcompanharSolicitacao() {
  const { register, handleSubmit, formState, setValue } = useForm<GetData>()
  const [result, setResult] = useState<Visa[] | null>(null)

  const handleTypeData = (selectedOption: any) => setValue('typeData', selectedOption.value)

  const onSubmit: SubmitHandler<GetData> = async (data) => {
    const visas = await getVisas(data.typeData, data.data)
    const formattedVisas = visas?.map((visa: any) => ({
      name: `${visa.name} ${visa.surname}`,
      email: visa.email,
      status: visa.payments[0]?.payment.status,
      transactionAmount: visa.payments[0]?.payment.transactionAmount || 0,
      statusETA: visa.statusETA,
      message: visa.message,
      attachmentPath: visa.attachmentPath,
      createdAt: visa.createdAt
    })) || null

    setResult(formattedVisas)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main style={{ flex: "1 1 0" }} className="container py-16">
        <h1 className="text-4xl font-bold mb-3">Acompanhar solicitação</h1>
        <hr className="my-4"/>
        <h2 className="text-xl font-bold mb-3">Verifique o status da sua solicitação</h2>
        <p>Informe seu e-mail, código NZeTA ou nº de passaporte para consultar o progresso da sua aplicação.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-2">
          <div>
            <Label>Escolha:</Label>
            <Select
              options={[{value: "email", label: "E-mail"}, {value: "codeETA", label: "Código NZeTA"}, {value: "passport", label: "Passaporte"}]}
              placeholder="Selecione"
              className="w-full max-w-[300px]"
              onChange={handleTypeData}
              required
            />
          </div>
          <div>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Insira o e-mail, código NZeTA ou nº de passaporte"
                className="bg-white w-full max-w-[300px]"
                required
                {...register('data')}
              />
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Consultando..." : "Consultar"} <Search className="ml-2 size-5"/>
              </Button>
            </div>
          </div>
        </form>
        <hr className="my-6" />
        { result && (
          <>
            <h2 className="text-xl font-bold mb-3">Resultado{result.length > 1 ? "s" : ""}</h2>
            <div className="my-6 grid grid-cols-1 lg:grid-cols-3">
              { 
                result.map((visa: Visa, index: number) => {
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{visa.name}</CardTitle>
                      </CardHeader>
                      <hr className="mb-4" />
                      <CardContent>
                        <p>E-mail cadastrado: {visa.email}</p>
                        <div>
                          Status de pagamento: 
                          <Badge
                            className={
                              `${visa.status === "Aprovado" ?
                                "bg-green-600 hover:bg-green-500 text-green-950" :
                                visa.status === "Negado" ? 
                                  "bg-red-600 hover:bg-red-500 text-red-50" : 
                                  "bg-yellow-600 hover:bg-yellow-500 text-yellow-950"
                              } 
                              ml-1 uppercase 
                            `}
                          >
                            {visa.status ? visa.status : "Sem pagamento"}
                          </Badge>
                        </div>
                        <p>Valor: R$ {visa.transactionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p>Status da aplicação: {visa.statusETA}</p>
                        { visa.message && (
                          <div className="my-2">
                            <p>Mensagem para você:</p>
                            <Textarea value={visa.message} className="w-full" disabled />
                          </div>
                        )}
                        { visa.attachmentPath && (
                          <div className="my-2">
                            <p>Faça o download do seu documento</p>
                            <Button>
                              <a href={visa.attachmentPath} download>
                                Download do NZeTA
                              </a>
                            </Button>
                          </div>
                        )}
                        <hr className="my-4"/>
                        <p>Solicitação enviada em: {new Date(visa.createdAt).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  )
                })
              }
            </div>
          </>
        )}
        <div>
          <h2 className="text-xl font-bold mb-3">Ainda não preencheu sua solicitação?</h2>
          <p>Preencha o formulário clicando no botão abaixo:</p>
          <Link className={buttonVariants({variant: "outline"}) + ` mt-2 border border-green-600 text-green-600`} href="/aplicacao/dados">
            <span className="font-bold uppercase">Solicitar autorização</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// result.map((visa: Visa, index: number) => (
//   <Card key={index}>
//     <CardHeader>
//       <CardTitle>{visa.name}</CardTitle>
//     </CardHeader>
//     <CardContent>
//       <p>E-mail cadastrado: {visa.email}</p>
//       <p>Status de pagamento: {visa.status}</p>
//       <p>Valor pago: R$ {visa.transactionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//       <p>Status da aplicação: {visa.statusETA}</p>
//       <hr className="my-4"/>
//       <p>Solicitação enviada em: {new Date(visa.createdAt).toLocaleString()}</p>
//     </CardContent>
//   </Card>
//   )