"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ExitIntent() {
  const [showPopup, setShowPopup] = useState<boolean>(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowPopup(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <Dialog open={showPopup} onOpenChange={handleClosePopup}>
      <DialogContent className="w-11/12 rounded-lg md:w-full">
        <DialogHeader>
          <DialogTitle>Espere!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>Você tem certeza de que deseja cancelar sua aplicação e perder a oportunidade de ter a nossa ajuda para emitir o sua NZeTA, vencendo a burocracia e tendo muito mais agilidade?</p>
          <p>Todos os dias nós identificamos erros de preenchimento de nossos clientes, que iriam complicar a emissão da NZeTA. Nós te ajudamos com isso.</p>
          <p>Além disso, 99% dos nossos clientes têm sua NZeTA aprovada em poucas horas.</p>
          <p>O valor de apenas R$ 297,00 já inclui a taxa do governo neozelandês e o valor da nossa prestação de serviços para assessoria individual na aplicação da sua NZeTA.</p>
          <p>Para confirmar o seu interesse na NZeTA, clique no botão abaixo para retornar ao checkout.</p>
        </DialogDescription>
        <Button onClick={handleClosePopup} className="w-full mt-0 uppercase">
          Continuar minha solicitação
        </Button>
      </DialogContent>
    </Dialog>
  )
}
