'use client'

import { useState } from 'react'
import AccordionItem from './accordion-item'

const accordionData = [
  {
    question: "O que é uma eTA?",
    answer: "A eTA (Autorização Eletrônica de Viagem) é um documento eletrônico necessário para viajar para certos países que exigem autorização prévia. Geralmente é aplicável a visitantes que viajam a lazer, turismo ou negócios por um curto período de tempo."
  },
  {
    question: "Quais países exigem uma eTA?",
    answer: "Países como Nova Zelândia e o Canadá são exemplos de destinos que requerem uma eTA para entrada de visitantes de determinadas nacionalidades. Recomendamos verificar os requisitos específicos do país de destino antes de viajar."
  },
  {
    question: "Quem precisa de uma eTA?",
    answer: "A necessidade de uma eTA varia de acordo com a nacionalidade do viajante e o país de destino. Geralmente, cidadãos de países que têm acordos de isenção de visto com o país de destino podem precisar de uma eTA. Consulte as regulamentações locais para obter informações precisas sobre quem precisa de uma eTA."
  },
  {
    question: "Como solicito uma eTA?",
    answer: "O processo de solicitação de eTA pode ser feito por meio de um dos sites de emissão de eTA da eTA Hub . Preencha o formulário online, pague a respectiva taxa e receba a resposta do governo."
  }
]

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div>
      {accordionData.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => toggleAccordion(index)}
        />
      ))}
    </div>
  )
}
