import { Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/LoginForm'
import { useAuth } from '@/hooks/useAuth'

export function LoginRoute() {
  const navigate = useNavigate()
  const { isAuthed, login } = useAuth()

  // Nếu đã đăng nhập, chuyển thẳng vào app
  if (isAuthed) return <Navigate to="/chat" replace />

  const handleLogin = (session: Parameters<typeof login>[0]) => {
    // Set flag để hiển thị loading screen khi vào app
    sessionStorage.setItem('justLoggedIn', 'true')
    login(session)
    navigate('/chat', { state: { fromLogin: true } })
  }

  return <LoginForm onLogin={handleLogin} />
}
