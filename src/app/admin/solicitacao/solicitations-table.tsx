'use client'

import { useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Eye, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SolicitationsTable({ visas }: { visas: any[] }) {
  const [open, setOpen] = useState(false)

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
              <p>{visa.payments[0].id}</p>
            </TableCell>
            <TableCell>
              <p>{visa.email}</p>
            </TableCell>
            <TableCell>
              <p>{visa.passportNumber}</p>
            </TableCell>
            <TableCell className="flex flex-row items-center justify-center gap-6">
              <a href={`/admin/usuario/${visa.id}/edit`} className="flex items-center justify-center text-yellow-500">
                <Pencil className="size-6" />
              </a>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Eye className="size-6 text-blue-500" />
                </DialogTrigger>
                <DialogContent className="max-w-full w-full h-full p-0">
                  <div className="container mx-auto h-full flex flex-col">
                    <DialogHeader className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Dados da solicitação</DialogTitle>
                        {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                          <X className="h-6 w-6" />
                        </Button> */}
                      </div>
                    </DialogHeader>
                    <form className="flex-grow overflow-auto p-6">
                      <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" value={`${visa.name} ${visa.surname}`} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={visa.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Passaporte</Label>
                          <Input id="phone" type="tel" value={visa.passportNumber} />
                        </div>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
