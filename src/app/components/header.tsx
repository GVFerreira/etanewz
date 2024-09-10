"use client"

import { useState } from "react"
import { List, X } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link  from "next/link"

export default function Header() {
  let [open, setOpen] = useState(false)
  
  return (
    <header className="bg-nzblack shadow-sm shadow-slate-500 w-full">
      <div className="container max-w-[1312px] mx-auto flex items-center justify-between px-3 py-4">
        <Link href="/" className="w-auto">
          <Image src="../etanovazelandia.svg" width={100} height={32} alt="Logotipo eTA Nova Zelândia" className="w-32"/>
        </Link>

        <div onClick={()=>setOpen(!open)} className="cursor-pointer md:hidden text-white">
            {
                open ? <X className="size-8"/> : <List className="size-8"/>
            }
        </div>
        
        <ul className={`text-white uppercase md:flex md:items-center md:pb-0 absolute md:static bg-nzblack md:bg-transparent md:z-auto z-10 left-0 w-full md:w-auto md:pl-0 pl-9 top-24 transition-all duration-300 ease-in ${open ? "" : "opacity-0 md:opacity-100"}`}>
            <li className="hover:text-nzgrey md:ml-8 md:my-0 my-7 font-semibold">
                <Link href="/">Início</Link>
            </li>
            <li className="hover:text-nzgrey md:ml-8 md:my-0 my-7 font-semibold">
                <Link href="/acompanhar-solicitacao">Acompanhar Solicitação</Link>
            </li>
            <li className="hover:text-nzgrey md:ml-8 md:my-0 my-7 font-semibold">
                <Link href="/contato">Contato</Link>
            </li>
            <li className="md:ml-8 md:my-0 my-7 font-semibold">
                <Link href="/aplicacao/dados" className="btn uppercase text-black bg-white font-semibold px-4 py-3 rounded duration-500 md:static hover:bg-zinc-200">Solicitar Autorização</Link>
            </li>
        </ul>
      </div>
    </header>
  )
}