import Image from "next/image"
import Link from "next/link"

export default function FooterCKO() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-nzgrey flex flex-col justify-center py-4">
      <div className="w-full container mx-auto flex flex-col justify-between px-3 md:flex-row">
        <div className="text-center text-zinc-800 text-xs hub:mt-0">
        <p className="mb-1">Todos os direitos reservados © {currentYear}.<span className="mb-1 font-semibold text-zinc-700"> eTA Hub Negócios Digitais Ltda</span></p>
        </div>
        <div className="flex justify-center items-center text-center text-zinc-800 text-xs hub:mt-0">
          <p>
            <a href="https://instagram.com/eudevgustavo" className="transition-all duration-200 ease-in hover:text-lime-700">
            Criado e desenvolvido por <Image src="/gvf.svg" width={100} height={100} alt="GVF" className="inline h-3 w-auto"/>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
  }