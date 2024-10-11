import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Pix = dynamic(() => import('./pix-component'), { suspense: true })

export default function YourComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Pix />
    </Suspense>
  )
}
