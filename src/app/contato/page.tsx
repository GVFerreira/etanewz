import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/header"
import Footer from "../components/footer"

export default function ContactPage() {
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
            <form className="flex flex-col items-center space-y-6">
              <div className="space-y-2 w-full">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nome
                </label>
                <Input id="name" required />
              </div>
              <div className="space-y-2 w-full">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  E-mail
                </label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2 w-full">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Motivo do contato
                </label>
                <Input id="subject" placeholder="Descreva em poucas palavras" required />
              </div>
              <div className="space-y-2 w-full">
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Nos diga o motivo do seu contato." className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-1/2 m-auto">
                Enviar mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}