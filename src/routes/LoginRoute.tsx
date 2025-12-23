import { Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { LoadingScreen } from '@/components/LoadingScreen'
import { useEffect, useState, useRef } from 'react'

export function LoginRoute() {
  const navigate = useNavigate()
  const { isAuthed, login } = useAuth()
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const hasShownInitialBanner = useRef(false)

  if (isAuthed) return <Navigate to="/chat" replace />

  // Show banner when user first enters the app (not authenticated)
  useEffect(() => {
    if (hasShownInitialBanner.current) return
    
    const hasSeenBanner = sessionStorage.getItem('hasSeenInitialBanner')
    if (!hasSeenBanner) {
      hasShownInitialBanner.current = true
      setShowLoadingScreen(true)
      sessionStorage.setItem('hasSeenInitialBanner', 'true')
      
      // Hide banner after minimum display time
      const timer = setTimeout(() => {
        setShowLoadingScreen(false)
      }, 1500) // Show for 1.5 seconds
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleLogin = (session: Parameters<typeof login>[0]) => {
    // Set flag to show loading screen
    sessionStorage.setItem('justLoggedIn', 'true')
    login(session)
    navigate('/chat', { state: { fromLogin: true } })
  }

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen 
          onComplete={handleLoadingComplete}
          isLoading={false}
        />
      )}
      <div className={showLoadingScreen ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500 pointer-events-auto'}>
        <LoginForm onLogin={handleLogin} />
      </div>
    </>
  )
}
