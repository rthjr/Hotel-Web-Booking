"use client"
import React from 'react'
import { useRouter } from '@node_modules/next/navigation'
const page = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    }
  return (
    <div>
      <h1>Page 2</h1>
      <p>This is the second page.</p>
      <button onClick={handleBack}>Back</button>
    </div>
  )
}

export default page
