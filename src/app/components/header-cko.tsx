"use client"

import { useState } from "react"
import { List, X } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link  from "next/link"

export default function HeaderCKO() {
  let [open, setOpen] = useState(false)
  
  return (
    <header className="bg-nzblack shadow-sm shadow-slate-500 w-full">
      <div className="container max-w-[1312px] mx-auto flex items-center justify-between px-3 py-4">
        <Link href="/" className="w-auto">
          <Image src="/etanovazelandia.svg" width={80} height={26} alt="Logotipo eTA Nova Zelândia" className="w-24"/>
        </Link>
      </div>
    </header>
  )
}