'use client'

import { useState, useEffect } from 'react'
import { useLoading } from '@/contexts/LoadingContext'

interface IntroLoaderProps {
  duration?: number
}

export function IntroLoader({ duration = 2000 }: IntroLoaderProps) {
  const { isLoading, finishLoading } = useLoading()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {

    if (!isLoading) return

    const interval = 20
    const step = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            finishLoading()
            setTimeout(() => setVisible(false), 500)
          }, 200)
          return 100
        }
        return prev + step
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isLoading, duration, finishLoading])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div className="flex flex-col items-center gap-3 relative">
        <span
          className="text-4xl font-black text-black"
          style={{ fontFamily: 'Rubik, sans-serif' }}
        >
          mini
        </span>
        <div className="w-16 h-0.5 bg-gray-300 overflow-hidden absolute bottom-[-10px] left-1/2 -translate-x-1/2">
          <div
            className="h-full bg-black transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
