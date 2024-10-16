'use client'

import { useRouter } from 'next/navigation'
import { updateImage } from "./action"
import Image from "next/image"

import React, { useRef, useState, useEffect } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import LoadingSpinner from "@/app/components/loading-spinner"
import ErrorMessages from "@/app/components/error-messages"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import { v4 as uuidv4 } from 'uuid'

export default function Photo() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()

    // Função de limpeza para parar a câmera quando o componente for desmontado
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onplaying = () => setIsVideoPlaying(true)
        await videoRef.current.play()
        setErrors([])

      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error)
      setErrors(['Não foi possível acessar a câmera.'])
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      setIsVideoPlaying(false)
    }
  }

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current && isVideoPlaying) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL('image/png')
        setImageSrc(imageData)
      } else {
        setErrors(['Ocorreu um erro ao tentar capturar a foto.'])
      }
    } else {
      setErrors(['A câmera não está pronta para capturar a foto.'])
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      if (imageSrc) {
        const blob = await (await fetch(imageSrc)).blob()
        const formData = new FormData()
        formData.append('file', blob, `${uuidv4()}.png`)

        // Primeiro, faça o upload da imagem
        const uploadResponse = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()

        if (uploadResponse.ok && uploadData.imagePath) {
          const analyzeResponse = await fetch('/api/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagePath: `public/${uploadData.imagePath}` }),
          })
          const analyzeData = await analyzeResponse.json()
          if (analyzeResponse.ok) {
            if (analyzeData.valid) {
              try {
                stopCamera()  // Pare a câmera antes de redirecionar
                const visaId = localStorage.getItem("visaId")
                if (visaId) await updateImage(visaId, uploadData.imagePath)
                
                // Redirecionar para /aplicacao/confirmar
                router.push('/aplicacao/confirmar')
              } catch (e: any) {
                setErrors(['Erro ao salvar a imagem.'])
              }
            } else {
              setErrors(analyzeData.errors || [])
            }
          } else {
            setErrors(['Ocorreu um erro ao analisar a foto.'])
          }
        } else {
          setErrors(uploadData.errors || ['Erro no upload da imagem.'])
        }
      } else {
        setErrors(['Nenhuma foto foi capturada ou carregada.'])
      }
    } catch (error) {
      setErrors(['Ocorreu um erro ao processar a imagem.'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto my-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Solicitação de Autorização Eletrônica de Viagem (eTA)</h1>
          <hr />
          <h2 className="text-2xl font-bold">Progresso da sua aplicação</h2>
          <Progress value={50} />
        </div>
        <div className="flex flex-col items-stretch">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Forneça sua foto</h3>
            </CardHeader>
            <hr />
            <CardContent className="space-y-8 py-4">
              <p>
                Forneça uma foto aceitável do seu rosto. Você pode carregar uma foto recente ou usar a câmera do seu
                dispositivo para tirar uma foto.
              </p>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="font-bold">Requisitos para fotos</p>
                  <ul className="list-decimal list-inside">
                    <li>Ser de uma pessoa</li>
                    <li>Olhar diretamente para a câmera</li>
                    <li>Olhos abertos e expressão neutra</li>
                    <li>Sem objetos cobrindo os olhos ou o rosto</li>
                  </ul>
                </div>
              </div>
              <form onSubmit={handleConfirm}>
                <div className="flex flex-col justify-center items-center">
                  <Tabs defaultValue="take" className="md:w-1/2 flex flex-col justify-center items-center">
                    <TabsList className="w-full">
                      <TabsTrigger value="take" className="w-1/2">Usar câmera</TabsTrigger>
                      <TabsTrigger value="photo" className="w-1/2">Carregar uma foto</TabsTrigger>
                    </TabsList>
                    <TabsContent value="take" className="w-full flex flex-col items-center">
                      <p>Posicione seu rosto e pressione o botão &quot;Tirar Foto&quot;.</p>
                      <video ref={videoRef} className="w-8/12 aspect-[3/4] object-cover bg-gray-200 rounded-md mt-4"></video>
                      <canvas ref={canvasRef} className="hidden"></canvas>
                      <Button className="mt-4" type="button" onClick={capturePhoto}>Tirar Foto</Button>
                    </TabsContent>
                    <TabsContent value="photo" className="w-full">
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </TabsContent>
                  </Tabs>

                  {imageSrc && (
                    <div className="w-full flex flex-col items-center mt-4">
                      <p className="font-bold">Sua foto:</p>
                      <Image src={imageSrc} alt="Preview da imagem" className="w-full aspect-[3/4] object-cover max-w-xs max-h-xs border-2 border-gray-300" width={768} height={1024} />
                    </div>
                  )}

                  <ErrorMessages errors={errors} />

                  <Button className="mt-4" type="submit" disabled={loading}>
                    Enviar foto para análise {loading && <LoadingSpinner />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
