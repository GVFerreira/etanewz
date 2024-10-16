import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Image from "next/image";

export default function Cadastur() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main style={{flex: "1 1 0"}} className="container flex flex-col justify-center items-center p-16">
        <h1 className="text-6xl font-bold text-center mb-10">Certificado CADASTUR</h1>
        <Image src="/certificado-cadastur.webp" width={350} height={248} alt="Certificado CADASTUR - eTA Hub" className="w-8/12" />
      </main>
      <Footer />
    </div>
  )
}