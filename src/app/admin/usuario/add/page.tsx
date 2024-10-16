'use client'

import { useRouter } from "next/navigation"
import { createUser } from "./../action"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function AddUser() {
  const route = useRouter()
  const form = useForm()

  const formSubmit = form.handleSubmit(async (data) => {
    if(data.password_one !== data.password_two) {
      route.refresh()
      toast({
        title: 'Erro',
        description: 'As senhas digitadas não são iguais.'
      })
    } else {
      try {
        await createUser(data)
        toast({
          variant: "success",
          title: 'Sucesso',
          description: 'Usuário criado com sucesso.'
        })
        route.push("/admin/usuario")

      } catch (e: any) {
        console.log(e)
        route.refresh()
        toast({
          variant: "destructive",
          title: 'Erro',
          description: e.message || 'Um erro ocorreu ao criar o usuário.'
        })

      } finally {
        route.refresh()
      }
    }
  })

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Criar usuário</h1>
      </div>
      <div className="grid grid-cols-2 space-x-4">
        <form onSubmit={formSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium dark:text-gray-300" htmlFor="name">Nome</label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="name"
                type="text"
                required
                {...form.register('name')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium dark:text-gray-300" htmlFor="email">E-mail</label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="email"
                type="email"
                required
                {...form.register('email')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium dark:text-gray-300" htmlFor="password-one">Digite sua senha</label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="password-one"
                type="password"
                required
                {...form.register('password_one')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium dark:text-gray-300" htmlFor="password-two">Digite sua senha novamente</label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="password-two"
                type="password"
                required
                {...form.register('password_two')}
              />
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Criando...' : 'Criar usuario'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}