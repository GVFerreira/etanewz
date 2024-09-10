'use server'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import { getVisas } from "../actions"

export default async function Solicitations() {
  const visas = await getVisas()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Passaporte</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visas.map((visa: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <p>{visa.name + " " + visa.surname}</p>
            </TableCell>
            <TableCell>
              <p>{visa.email}</p>
            </TableCell>
            <TableCell>
              <p>{visa.passportNumber}</p>
            </TableCell>
            <TableCell>
              <a href={`/admin/usuario/${visa.id}/edit`} className="flex items-center justify-center text-yellow-500">
                <Pencil className="size-6"/>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}