'use client'

import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function AuthForm() {
  const form = useForm()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await signIn("credentials", {
        ...data,
        callbackUrl: "/admin"
      })

      toast({
        variant: "success",
        title: 'Sucesso',
        description: 'Redirencionando você para o painel administrativo',
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Erro',
        description: 'Credenciais inválidas',
      })
    }
  })

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">Login</CardTitle>
        <CardDescription>Insira seu email abaixo para acessar o painel administrativo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="false">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="hub@etanz.com.br"
              required 
              {...form.register('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              placeholder="*********"
              required
              {...form.register('password')}
            />
          </div>
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting} >
            {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
