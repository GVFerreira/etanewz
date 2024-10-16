'use client'

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm, SubmitHandler } from "react-hook-form"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Seu nome deve ter no mínimo 3 caracteres",
  }),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(1, {
    message: "Campo obrigatório"
  }),
  message: z.string().min(1, {
    message: "Campo obrigatório"
  })
})

export default function ContactPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const sendEmail = async () => {
      try {
        await fetch('/api/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'contato@etanz.com.br',
            subject: 'Formulário de contato',
            template: 'contato',
            context: {
              email: data.email,
              name: data.name,
              subject: data.subject,
              message: data.message
            }
          })
        })
        toast({
          variant: "success",
          title: "Formulário enviado com sucesso",
          description: `Obrigado por nos contactar, ${data.name}. Em breve responderemos sua solicitação`
        })
      } catch(e) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao enviar o formulário. Tente novamente."
        })
      } finally {
        form.reset()
        router.refresh()
      }
    }

    sendEmail()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Entre em contato</CardTitle>
            <CardDescription>
              Preencha as informaçoões abaixo para que possamos entrar em contato o mais breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-stretch justify-center space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Nome: <Required /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>E-mail: <Required /></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>Assunto: <Required /></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Mensagem: <Required /></FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                <Button type="submit" className="w-1/2 m-auto" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}

function Required() {
  return (
    <span className="text-red-500 bold text-lg">* </span>
  )
}