import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-nzwhite">
      <Image src="/etanovazelandia-black.png" width={300} height={300} alt="eTA NZ" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! A página que você está procurando não foi encontrada.</p>
      <Link href="/">
        <Button>Voltar para a página inicial</Button>
      </Link>
    </div>
  )
}
