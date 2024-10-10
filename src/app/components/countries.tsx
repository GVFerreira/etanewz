'use client'

import { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function Countries() {
  const [isSouthAmericaOpen, setIsSouthAmericaOpen] = useState(true)

  return (
    <div className="p-4">
      {/* Desktop: 3 colunas */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 p-4">
        <div className="flex flex-col space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">América do Sul</h3>
            <div className="space-y-2 text-center">
              <p>Brasil 🇧🇷</p>
              <p>Argentina</p>
              <p>Chile</p>
              <p>Uruguai</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">América do Norte</h3>
            <div className="space-y-2 text-center">
              <p>Canadá</p>
              <p>Estados Unidos</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">América Central e Caribe</h3>
            <div className="space-y-2 text-center">
              <p>Bahamas</p>
              <p>Barbados</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">Europa</h3>
            <div className="space-y-2 text-center">
              <p>Alemanha</p>
              <p>Áustria</p>
              <p>Bélgica</p>
              <p>Dinamarca</p>
              <p>Espanha</p>
              <p>Finlândia</p>
              <p>França</p>
              <p>Grécia</p>
              <p>Holanda</p>
              <p>Hungria</p>
              <p>Irlanda</p>
              <p>Islândia</p>
              <p>Itália</p>
              <p>Noruega</p>
              <p>Polônia</p>
              <p>Portugal</p>
              <p>Reino Unido</p>
              <p>Suécia</p>
              <p>Suíça</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">África</h3>
            <div className="space-y-2 text-center">
              <p>Ilhas Maurício</p>
              <p>Seychelles</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">Ásia</h3>
            <div className="space-y-2 text-center">
              <p>Emirados Árabes Unidos</p>
              <p>Israel</p>
              <p>Hong Kong</p>
              <p>Japão</p>
              <p>Malásia</p>
              <p>Singapura</p>
              <p>Coreia do Sul</p>
              <p>Taiwan</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl text-center font-bold mb-4">Oceania</h3>
            <div className="space-y-2 text-center">
              <p>Austrália</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Acordeão */}
      <div className="lg:hidden text-white">
        <Accordion type="single" collapsible defaultValue="south-america">
          <AccordionItem value="south-america">
            <AccordionTrigger className="text-2xl font-bold">América do Sul</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Brasil 🇧🇷</p>
              <p>Argentina</p>
              <p>Chile</p>
              <p>Uruguai</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="north-america">
            <AccordionTrigger className="text-2xl font-bold">América do Norte</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Canadá</p>
              <p>Estados Unidos</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="central-america">
            <AccordionTrigger className="text-2xl font-bold">América Central e Caribe</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Bahamas</p>
              <p>Barbados</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="europe">
            <AccordionTrigger className="text-2xl font-bold">Europa</AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-2 text-center">
              <div className="space-y-2">
                <p>Alemanha</p>
                <p>Áustria</p>
                <p>Bélgica</p>
                <p>Dinamarca</p>
                <p>Espanha</p>
                <p>Finlândia</p>
                <p>França</p>
                <p>Grécia</p>
                <p>Holanda</p>
              </div>
              <div className="space-y-2">
                <p>Hungria</p>
                <p>Irlanda</p>
                <p>Islândia</p>
                <p>Itália</p>
                <p>Noruega</p>
                <p>Polônia</p>
                <p>Portugal</p>
                <p>Reino Unido</p>
                <p>Suécia</p>
                <p>Suíça</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="africa">
            <AccordionTrigger className="text-2xl font-bold">África</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Ilhas Maurício</p>
              <p>Seychelles</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="asia">
            <AccordionTrigger className="text-2xl font-bold">Ásia</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Emirados Árabes Unidos</p>
              <p>Israel</p>
              <p>Hong Kong</p>
              <p>Japão</p>
              <p>Malásia</p>
              <p>Singapura</p>
              <p>Coreia do Sul</p>
              <p>Taiwan</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="oceania">
            <AccordionTrigger className="text-2xl font-bold">Oceania</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Austrália</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
