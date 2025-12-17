import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginRoute } from '@/routes/LoginRoute'
import { FundsRoute } from '@/routes/FundsRoute'
import { RequireAuth } from '@/routes/RequireAuth'
import { useAuth } from '@/hooks/useAuth'
import { MessageRoute } from '@/routes/MessageRoute'

export function AppRouter() {
  const { isAuthed } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route
        path="/funds"
        element={
          <RequireAuth>
            <FundsRoute />
          </RequireAuth>
        }
      />

      <Route
        path="/funds/:fundId"
        element={
          <RequireAuth>
            <MessageRoute />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={isAuthed ? '/funds' : '/login'} replace />} />
    </Routes>
  )
}
