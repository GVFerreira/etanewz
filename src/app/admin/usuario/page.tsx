import { Button } from "@/components/ui/button"
import Link from "next/link"
import Users from "./users"

export default function Usuario() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Usuários</h1>
        <Button className="ml-auto" size="sm">
          <Link href="/admin/usuario/add">
            Adicionar usuário
          </Link>
        </Button>
      </div>
      <div className="border shadow-sm rounded-lg">
        <Users />
      </div>
    </main>
  )
}