import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/LoginForm'
import { useAuth } from '@/hooks/useAuth'

export function LoginRoute() {
  const { isAuthed, login } = useAuth()

  if (isAuthed) return <Navigate to="/funds" replace />

  return <LoginForm onLogin={login} />
}
