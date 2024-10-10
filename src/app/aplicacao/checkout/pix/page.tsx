import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import FooterCKO from "@/app/components/footer-cko"
import HeaderCKO from "@/app/components/header-cko"
import CopyInput from "./copy-button"

export default function Obrigado() {
  const qrCode = "00020101021226770014BR.GOV.BCB.PIX2555api.itau/pix/qr/v2/87ba55a1-e526-42c3-bc2c-ab41bdbca0a55204000053039865802BR5906APPMAX6012PORTO ALEGRE62070503***6304BC32"
  const base64String = "iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQAAAACgl2eQAAACzUlEQVR4Xu2XQZIbIQxF4SJw/1vkKHARyHtikm57MZXFtLIxNXa30XOVrK8vesr+fv0q7ztv6wOc9QHO+gBn/RswSqmjrtb3XN62Pvd0MxGY/M3R6nTtRXiU6mYmMIytVlfdq7ROlqu6mQ5QpL5aK5UsKdp/AIhSndCqcNtjMxPYilWqgtEzhNHsRaznAfvTSr2s965+j/8w4Fr0iGXaNs72dVYWMLrWpU4hGH1bCg3cbr8iAyAzNrshSma7IN/qiQAJjurQGNUxQs5UbbSWCvQYXViF1PhYunME/yQC0ygd0wJa4WSQm3mfByhUyLSJhoXMk2Jdv+J5AF3CJ8M5jmLzz1hLBDxSj3XYtGLVY+2uZgLAACdAiZbpxghj6yZWAlDoEhumFRO0bmR5VzMB8FQfAtVBNlUN7F6oxwE7pigW6bI7Q6i4zQPisWJoHCIlLKyVbmI9D6iLZinujkjOj9cgzQAiQ/0jpId6jPZMgK3tSYY+0TiOVauWCoRfkYgzfTrZ+Yb+/StWAuAtfRujTNYsp8dMIjDtVp077VoGOo37IlYCYDYkOpxlp22ael1iJQAOLKeH29OMm/Val1gZgPo4w+wT31Qr7JMKxNgYasQ8C7xH/dIAOmYZIuIjRnfD72QCIZZtCqhODLXqQfeq5rMA8R4pscc/AgiGc9tNrAzAKjlHebz4KpWXq1AZQN1xrKvVyRTd7uZNAJZ+ESNXbUzcUnG65AHHNVSmKlyLizW7fsXzwPKpyr7VxS1at2HfW6ESAG5xL2/164J1+riMkwCMmN2tcKD4qmd8WL08wIVpzdaBjmM08LzESgBIqIZzVEogMvXRKw8gPQrVDZhbwTmecFehMoBhSjG/lGiewSqdC9ioW4h9nMsYoXfTgeUURy7vph2TCyhWCGSfMk6qB8ptmCcACmPcFhG2d8PLicB36wOc9QHO+gBn/QDwGzGa517M2/JEAAAAAElFTkSuQmCC"

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderCKO />
      <main style={{flex: "1 1 0"}} className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="size-8">
                <path d="M235.34,116.72,139.28,20.66a16,16,0,0,0-22.56,0L20.66,116.72a16,16,0,0,0,0,22.56l96.06,96.06a16,16,0,0,0,22.56,0l96.06-96.06A16,16,0,0,0,235.34,116.72ZM128,32,184,88H160a8,8,0,0,0-5.66,2.34L128,116.68,101.66,90.34A8,8,0,0,0,96,88H72ZM56,104H92.68l24,24-24,24H56L32,128Zm72,120L72,168H96a8,8,0,0,0,5.66-2.34L128,139.31l26.34,26.35A8,8,0,0,0,160,168h24Zm72-72H163.32l-24-24,24-24H200l24,24Z"></path>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">Pix QR Code</CardTitle>
            <CardDescription>Escaneie o QR Code abaixo através da câmera do seu celular.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              {/* <h3 className="font-semibold mb-2">Detalhes da compra:</h3> */}
              <Image src={`data:image/png;base64,${base64String}`} width={150} height={150} alt="QR CODE" className="w-full"/>
            </div>
            <CopyInput qrCode={qrCode as string} />
            <p className="text-center text-muted-foreground">
              Ou se preferir, copie o copie e cole o código na seção Pix do seu banco
            </p>
          </CardContent>
        </Card>
      </main>
      <FooterCKO />
    </div>
  )
}