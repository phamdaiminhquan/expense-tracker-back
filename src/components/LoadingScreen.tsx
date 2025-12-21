import { useEffect, useState } from 'react'
import capNoelBanner from '@/assets/image/Cap-noel-banner.jpg'

interface LoadingScreenProps {
  onComplete: () => void
  isLoading: boolean
}

export function LoadingScreen({ onComplete, isLoading }: LoadingScreenProps) {
  const [minDisplayTimeElapsed, setMinDisplayTimeElapsed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Minimum display time: 500ms
    const minTimeTimer = setTimeout(() => {
      setMinDisplayTimeElapsed(true)
    }, 500)

    return () => clearTimeout(minTimeTimer)
  }, [])

  useEffect(() => {
    // Only complete when both conditions are met:
    // 1. Minimum display time has elapsed
    // 2. Loading is complete
    if (minDisplayTimeElapsed && !isLoading) {
      // Start exit animation
      setIsExiting(true)
      // Complete after fade out animation
      const timer = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [minDisplayTimeElapsed, isLoading, onComplete])

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-primary/[0.02] to-accent/[0.02] transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,100,0.1),transparent_50%)]" />
      
      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-500 ${
        isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-border/40">
          <img 
            src={capNoelBanner} 
            alt="Finance Capybara Banner" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          
          {/* Loading Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

