import { Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/LoginForm'
import { useAuth } from '@/hooks/useAuth'

export function LoginRoute() {
  const navigate = useNavigate()
  const { isAuthed, login } = useAuth()

  if (isAuthed) return <Navigate to="/funds" replace />

  const handleLogin = (session: Parameters<typeof login>[0]) => {
    // Set flag to show loading screen
    sessionStorage.setItem('justLoggedIn', 'true')
    login(session)
    navigate('/funds', { state: { fromLogin: true } })
  }

  return <LoginForm onLogin={handleLogin} />
}
