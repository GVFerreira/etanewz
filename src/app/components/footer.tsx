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
          <div className="md:text-center">
            <h4 className="text-lg font-semibold mb-4">Navegue</h4>
            <nav>
              <ul className="space-y-4">
                <li><Link href="/">Início</Link></li>
                <li><Link href="#">Solicitar Autorização Eletrônica de Viagem</Link></li>
                <li><Link href="#">Acompanhar Autorização Eletrônica de Viagem</Link></li>
                <li><Link href="#">Contato</Link></li>
              </ul>
            </nav>
          </div>
          <div className="md:text-center">
            <h4 className="text-lg font-semibold mb-4">Links importantes</h4>
            <nav>
              <ul className="space-y-4">
                <li><Link href="#">Artigos</Link></li>
                <li><Link href="#">Certificado Cadastur</Link></li>
                <li><Link href="#">Política de Privacidade</Link></li>
                <li><Link href="#">Termos e Condições</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <Image src="/cadastur.png" width={200} height={22} alt="Selo Cadastur" className="w-8/12 mx-auto" />
          </div>
        </div>
      </div>
      <hr className="border-t-zinc-700"/>
      <div className="w-full mx-auto flex flex-col justify-between pt-4 px-3 md:flex-row">
        <div className="mt-6 text-center text-zinc-800 text-xs hub:mt-0">
          <p className="mb-1">Todos os direitos reservados © {currentYear}.<span className="mb-1 text-zinc-700"> eTA Hub Negócios Digitais Ltda. CNPJ: 53.053.965/0001-09</span></p>
          <p className="mb-1">Av. Ipiranga, 40 – Sala 905 – bairro Praia de Belas - CEP 90.160-090 - Porto Alegre/RS</p>
        </div>
        <div className="flex justify-center items-center mt-6 text-center text-zinc-800 text-xs hub:mt-0">
          <p>
            <a href="https://instagram.com/eudevgustavo" className="transition-all duration-200 ease-in hover:text-lime-700">
            Criado e desenvolvido por <Image src="../gvf.svg" width={100} height={100} alt="GVF" className="inline h-3 w-auto"/>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
  }