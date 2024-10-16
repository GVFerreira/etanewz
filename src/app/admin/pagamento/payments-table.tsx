'use client'

import { useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Eye, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentsTable({ payments }: { payments: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Clientes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Método de pagamento</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              { payment.visas.map(({visas}: any, index: number) => (
                <p key={index}>{visas.name + " " + visas.surname}</p>
              )) }
            </TableCell>
            <TableCell>
              <p>{payment.status}</p>
            </TableCell>
            <TableCell>
              <p>{payment.transactionAmount}</p>
            </TableCell>
            <TableCell>
              <p>{payment.paymentTypeId === "pix" ? "Pix" : "Cartão de crédito"}</p>
            </TableCell>
            <TableCell className="flex flex-row items-center justify-center gap-6">
              {/* <a href={`/admin/pagamento/${payment.id}/edit`} className="flex items-center justify-center text-yellow-500">
                <Pencil className="size-6" />
              </a> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
