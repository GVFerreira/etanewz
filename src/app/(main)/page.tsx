import { AirplaneTilt, Textbox, Wallet } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

import Accordion from "../components/accordion"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import Countries from "../components/countries"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section style={{backgroundImage: "url(./background/landscape-new-zealand.webp)"}} className="bg-center bg-no-repeat bg-cover">
          <div className="container max-w-screen-sm mx-auto py-16 px-5 text-center md:py-36">
            <h1 className="text-6xl font-bold text-white mb-3">eTA Nova Zelândia</h1>
            <p className="text-nzwhite mb-8">Autorização Eletrônica de Viagem à Nova Zelândia</p>
            <Link href="/aplicacao/dados"><p className="inline-block bg-green-600 text-white p-3 font-bold uppercase rounded">Solicitar autorização</p></Link>
          </div>
        </section>

        <section style={{backgroundImage: "url(./background/silhueta.svg)"}} className="bg-top py-16 bg-no-repeat bg-cover">
          <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="max-w-screen-sm my-auto mx-auto p-5 rounded-md space-y-8 bg-white/40 backdrop-blur-sm shadow-xl">
              <div>
                <h2 className="text-3xl font-bold mb-2">O que é esta autorização?</h2>
                <p>A NZeTA (New Zealand Electronic Travel Authorization) é um documento eletrônico exigido para viajantes elegíveis que desejam entrar na Nova Zelândia por via aérea.</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Eu preciso ter para entrar na Nova Zelândia?</h2>
                <p>A NZeTA é obrigatória para <b>xxxxxxxxxxxxxxxx</b>, que estão viajando a passeio, para estudos (com duração máxima de 3 meses) ou para negócios. A NZeTA é válida por até dois anos ou até que o passaporte do viajante expire, o que ocorrer primeiro.</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Por onde solicitar?</h2>
                <p>O processo de solicitação da NZeTA é realizado on-line e geralmente leva apenas alguns minutos. Para solicitar a sua NZeTA você precisará de um passaporte válido, um endereço de e-mail, uma foto do seu rosto (ou um dispositivo eletrônico capaz de tirar sua foto) e de um meio de pagamento para a taxa de serviço. A foto do seu rosto precisa atender os requisitos do governo da Nova Zelândia.</p>
              </div>
              <Link href="/aplicacao/dados"><p className="inline-block bg-green-600 text-white p-3 mt-6 font-bold uppercase rounded">Solicitar autorização</p></Link>
            </div>
          </div>
        </section>

        <section className="bg-nzblack text-white">
          <div className="container mx-auto py-16 px-5">
            <h2 className="text-4xl font-bold mb-4 text-center">Passo a Passo</h2>
            <p className="text-center text-nzgrey mb-12">Ao viajar de avião para a Nova Zelândia, seja a lazer, estudos ou negócios, você deve solicitar uma autorização eletrônica de viagem (NZeTA).<br />Confira abaixo o passo a passo simples para você garantir a sua autorização.</p>
            <div className="space-y-12 md:grid md:grid-cols-3 md:space-y-0 md:text-center md:gap-x-20">
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <Textbox size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Preencha o formulário</h3>
                  <p className="text-nzgrey">Informe seus dados de viagem para solicitar a Autorização e anexe sua foto.</p>
                </div>
              </div>
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <Wallet size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Realize o pagamento</h3>
                  <p className="text-nzgrey">Faça o pagamento de <b>R$ 297,00</b> em um ambiente totalmente SEGURO para finalizar a solicitação. Este valor inclui a taxa de serviço, a taxa consular e o IVL cobrado pelo governo.</p>
                </div>
              </div>
              <div className="flex justify-start items-center gap-6 md:flex-col">
                <div>
                  <AirplaneTilt size={60} className="text-nzgrey"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Receba seu eTA</h3>
                  <p className="text-nzgrey">Após aprovado, você receberá o seu documento de viagem no e-mail informado no formulário, em até <b>12 horas</b>.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-nzblack">
          <div className="container mx-auto py-16">
            <h2 className="text-4xl text-white md:w-2/3 mx-auto font-bold mb-12 text-center">Países que necessitam emitir a Autorização Eletrônica de Viagem da Nova Zelândia (NZeTA)</h2>
            <Countries />
          </div>
        </section>

        <div style={{backgroundImage: "url(/leaf.png)"}} className="bg-no-repeat bg-[length:60rem] bg-center pb-16">
          <section>
            <div className="container mx-auto max-w-screen-md py-16 px-5 text-center">
              <h2 className="text-4xl font-bold mb-2">Planejando sua viagem para a Nova Zelândia?</h2>
              <p className="text-zinc-800 mb-8">Preencha o formulário de solicitação do eTA e esteja pronto para explorar a incrível beleza da Nova Zelândia. Não perca tempo, garanta sua eTA antes da viagem!</p>
              <Link href="/aplicacao/dados"><p className="inline-block bg-green-600 text-white p-3 font-bold uppercase rounded">Solicitar autorização</p></Link>
            </div>
          </section>

          <section>
            <div className="container mx-auto grid grid-cols-1 gap-x-12 md:grid-cols-2">
              <div className="max-w-screen-sm my-auto p-5 space-y-8 bg-white/40 backdrop-blur-sm shadow-xl rounded">
                <h2 className="text-4xl font-bold mb-12">Taxa de turismo</h2>
                <div>
                  <h3 className="text-2xl font-bold mb-2">O que é?</h3>
                  <p>O IVL (International Visitor Levy) é uma taxa imposta a visitantes internacionais que entram na Nova Zelândia. Esse valor arrecadado é destinado a apoiar a infraestrutura turística do país e a proteger o meio ambiente natural da Nova Zelândia.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">Preciso pagar?</h3>
                  <p>Sim, a maioria dos visitantes internacionais deve pagar o IVL ao solicitar um visto de turista ou ao obter a NZeTA (New Zealand Electronic Travel Authority), exceto os cidadãos de países isentos e aqueles que possuem status de residência permanente na Nova Zelândia.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">O que acontece se eu não pagar?</h3>
                  <p>Se você não pagar o IVL, não será possível concluir sua solicitação de visto ou NZeTA, o que impede sua entrada na Nova Zelândia. O pagamento da taxa é obrigatório como parte do processo de autorização de viagem.</p>
                </div>
              </div>
              <div></div>
            </div>
          </section>
        </div>

        <section className="bg-nzblack">
          <div className="container mx-auto flex flex-col items-center px-5 py-16">
            <h2 className="text-4xl font-bold text-center text-nzwhite mb-12">Dúvidas Frequentes</h2>
            <div className="max-w-screen-md mx-auto">
              <Accordion />
            </div>
            <Link href="/aplicacao/dados"><p className="inline-block bg-green-600 text-white p-3 font-bold uppercase rounded mt-12">Solicitar autorização</p></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
