import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-nzgrey flex flex-col justify-center pt-20 pb-4">
      <div className="w-full container mx-auto px-5 hub:px-0">
        <div className="flex flex-row items-start gap-x-2 mb-6">
            <p>Este site faz parte da</p>
            <Image src="/../etahub.svg" width={100} height={100} alt="Logotipo eTA Hub" className="inline h-5 w-auto" />
        </div>
        <div className="mb-14 grid grid-cols-1 gap-x-40 gap-y-14 w-full md:grid-cols-3 md:gap-x-14 md:gap-y-10">
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Navegue</h4>
            <nav>
              <ul className="space-y-4 underline">
                <li><Link href="/" className="hover:text-zinc-600">Início</Link></li>
                <li><Link href="/aplicacao/dados" className="hover:text-zinc-600">Solicitar Autorização Eletrônica de Viagem</Link></li>
                <li><Link href="/acompanhar-solicitacao" className="hover:text-zinc-600">Acompanhar Autorização Eletrônica de Viagem</Link></li>
                <li><Link href="/contato" className="hover:text-zinc-600">Contato</Link></li>
              </ul>
            </nav>
          </div>
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Links importantes</h4>
            <nav>
              <ul className="space-y-4 underline">
                <li><Link href="/artigos" className="hover:text-zinc-600">Artigos</Link></li>
                <li><Link href="/cadastur" className="hover:text-zinc-600">Certificado Cadastur</Link></li>
                <li><Link href="/politica-privacidade" className="hover:text-zinc-600">Política de Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-zinc-600">Termos e Condições</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Image src="/selo-siteseguro.webp" width={200} height={22} alt="Selo Google" className="h-14 w-auto bg-white px-2 py-2 rounded-sm" />
              <Image src="/appmax.webp" width={200} height={22} alt="Selo Appmax" className="h-14 w-auto bg-white px-6 py-4 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t-zinc-700"/>
      <div className="w-full container mx-auto flex flex-col justify-between pt-4 px-3 md:flex-row">
        <div className="text-center text-zinc-800 text-xs hub:mt-0">
          <p className="mb-1">Todos os direitos reservados © {currentYear}.<span className="mb-1 font-semibold text-zinc-700"> eTA Hub Negócios Digitais Ltda</span></p>
        </div>
        <div className="flex justify-center items-center mt-2 text-center text-zinc-800 text-xs md:mt-0">
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