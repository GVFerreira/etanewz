import { AirplaneTilt, Textbox, Wallet } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"

import Accordion from "../components/accordion"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section style={{backgroundImage: "url(./background/landscape-new-zealand.webp)"}} className="bg-center bg-no-repeat bg-cover">
          <div className="container max-w-screen-sm mx-auto py-16 px-5 text-center md:py-36">
            <h1 className="text-6xl font-bold text-white mb-3">eTA Nova Zelândia</h1>
            <p className="text-nzwhite mb-8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium aperiam nam nostrum consectetur magni. Distinctio sunt sequi recusandae iste nesciunt.</p>
            <Link href="#"><p className="inline-block bg-green-600 text-white p-3 font-bold uppercase rounded">Solicitar autorização</p></Link>
          </div>
        </section>

        <section style={{backgroundImage: "url(./background/silhueta.svg)"}} className="bg-top py-16 bg-no-repeat bg-cover">
          <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="max-w-screen-sm my-auto mx-auto p-5 rounded-md space-y-8 bg-white/40 backdrop-blur-sm shadow-xl">
              <div>
                <h2 className="text-3xl font-bold mb-2">O que é esta autorização?</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Eu preciso ter para entrar na Nova Zelândia?</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Por onde solicitar?</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <Link href="#"><p className="inline-block bg-green-500 text-white p-3 mt-6 font-bold uppercase rounded">Solicitar autorização</p></Link>
            </div>
          </div>
        </section>

        <section className="bg-nzblack text-white">
          <div className="container mx-auto py-16 px-5">
            <h2 className="text-4xl font-bold mb-12 text-center">Passo a Passo</h2>
            <div className="space-y-12 md:grid md:grid-cols-3 md:space-y-0 md:text-center md:gap-x-20">
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <Textbox size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Preencha o formulário</h3>
                  <p className="text-nzgrey">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur, nulla?</p>
                </div>
              </div>
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <Wallet size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Realize o pagamento</h3>
                  <p className="text-nzgrey">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur, nulla?</p>
                </div>
              </div>
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <AirplaneTilt size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Receba seu eTA</h3>
                  <p className="text-nzgrey">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur, nulla?</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-nzgrey">
          <div className="container mx-auto max-w-screen-md py-16 px-5 text-center">
            <h2 className="text-4xl font-bold mb-2">Call to Action</h2>
            <p className="text-zinc-800 mb-8">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione autem excepturi corrupti dignissimos ex ipsa illo aliquid exercitationem, dolorum sapiente.</p>
            <Link href="#"><p className="inline-block bg-zinc-900 text-white p-3 font-bold uppercase rounded">Solicitar autorização</p></Link>
          </div>
        </section>

        <section>
          <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <Image src="/background/auckland.webp" quality={100} alt="" width={540} height={540} className="w-full h-full" />
            </div>
            <div className="max-w-screen-sm my-auto py-16 px-5 space-y-8">
              <h2 className="text-4xl font-bold mb-2">Taxa de turismo</h2>
              <div>
                <h3 className="text-2xl font-bold mb-2">O que é?</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Preciso pagar?</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">O que acontece se eu não pagar?</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime adipisci in facere dolore quia voluptate?</p>
              </div>
              <Link href="#"><p className="inline-block bg-green-500 text-white p-3 mt-6 font-bold uppercase rounded">Solicitar autorização</p></Link>
            </div>
          </div>
        </section>

        <section className="bg-nzblack">
          <div className="container mx-auto px-5 py-16">
            <h2 className="text-4xl font-bold text-center text-nzwhite mb-4">Dúvidas Frequentes</h2>
            <div className="max-w-screen-md mx-auto">
              <Accordion />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
