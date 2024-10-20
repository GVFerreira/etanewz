import { PropsWithChildren } from 'react'
import { AdminSidebar } from './_components/admin-sidebar'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"

import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu
} from "@/components/ui/dropdown-menu"

// import { auth } from '@/services/auth'

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - NZeTA Nova Zelândia",
}

export const revalidate = 0

export default async function Layout({ children }: PropsWithChildren) {
  // const session = await auth()

  return (
    <div className="grid grid-cols-[14rem_1fr]">
      <AdminSidebar /*user={session?.user}*/ />
      <div className="min-h-screen flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <Link className="lg:hidden" href="#">
            <Image
              src="etanovazelandia.svg"
              alt="eTA Nova Zelândia - Hub"
              width={70}
              height={20}
            />
          </Link>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Seu nome</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}