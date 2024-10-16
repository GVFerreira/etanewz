'use server'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import { getUsers } from "./action"

export default async function Users() {
  const users = await getUsers()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user, index) => (
          <TableRow key={index}>
            <TableCell>
              <p>{user.name}</p>
            </TableCell>
            <TableCell>
              <p>{user.email}</p>
            </TableCell>
            <TableCell>
              <a href={`/admin/usuario/${user.id}/edit`} className="flex bg-yellow-500 rounded-full size-10">
                <Pencil className="size-4 m-auto"/>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}