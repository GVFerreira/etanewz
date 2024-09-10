'use client'

import { useRef, useEffect, useState } from 'react'

type AccordionType = {
  question: string
  answer: string
  isOpen: boolean
  onToggle: any
}

export default function AccordionItem({ question, answer, isOpen, onToggle }: AccordionType) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState('0px')

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isOpen])

  const handleToggleAccordion = () => {
    onToggle()
  }

  return (
    <div onClick={handleToggleAccordion} className="cursor-pointer mb-3">
      <div className="flex items-center justify-between w-full p-2 bg-white/5 rounded-md">
        <h4 className="text-zinc-100 text-start font-semibold w-full">{question}</h4>
        <span className="text-zinc-300 w-6 h-6" style={{position: 'relative', transform: 'translate(0%, 0%)'}}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: '0', left: '0'}} className={`w-6 h-6 transition-all duration-200 ease-in ${!isOpen ? 'transform rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: '0', left: '0'}} className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
          </svg>
        </span>
      </div>

      <div
        ref={contentRef}
        style={{ maxHeight: `${contentHeight}`, transition: 'max-height 0.5s ease, opacity 0.5s ease', opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p
          className={`text-justify text-md text-zinc-300 py-2`}
          aria-hidden={!isOpen}
        >
          {answer}
        </p>
      </div>
    </div>
  )
}
