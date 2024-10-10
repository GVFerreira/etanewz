'use client'

import { useState } from 'react'
import AccordionItem from './accordion-item'

const accordionData = [
  {
    question: "Por que eu preciso desse serviço?",
    answer: "Porque o nosso site disponibiliza um formulário acessível e de fácil preenchimento, em português brasileiro. Você navegará de forma intuitiva e encontrará, em um só lugar, todas as informações claras sobre requisitos e documentação necessários para a aplicação da sua NZeTA. Em 99% dos casos, nossos clientes têm a sua autorização emitida em menos de 12 horas. Além disso, garantimos a segurança dos seus dados pessoais e informações financeiras."
  },
  {
    question: "Meus dados (nome, documentos, e-mail e cartão de crédito) estão seguros?",
    answer: "Sim, seus dados estão 100% seguros. Todo o processamento de nossos pagamentos é efetuado pela Appmax, em uma transação criptografada. Nenhuma informação referente ao seu cartão de crédito é mantida em nosso banco de dados. Além disso, somos totalmente contra spam e quaisquer práticas de violação de privacidade."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Nossos pagamentos são processados através da Appmax, e você pode efetuar o pagamento utilizando cartão de crédito e PIX."
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
