'use client'

import { useState } from 'react'
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CopyInput({ qrCode }: { qrCode: string }) {
  const [inputValue, setInputValue] = useState(qrCode)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    if (inputValue) {
      try {
        await navigator.clipboard.writeText(inputValue)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl flex space-x-2">
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Enter text to copy"
          value={inputValue}
          disabled
          className="w-full"
        />
      </div>
      <Button 
        onClick={handleCopy}
        disabled={!inputValue}
        className="whitespace-nowrap"
      >
        {isCopied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </>
        )}
      </Button>
    </div>
  )
}