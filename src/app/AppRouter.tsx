import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginRoute } from '@/routes/LoginRoute'
import { FundsRoute } from '@/routes/FundsRoute'
import { TransactionRoute } from '@/routes/TransactionRoute'
import { RequireAuth } from '@/routes/RequireAuth'
import { useAuth } from '@/hooks/useAuth'

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
            <TransactionRoute />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={isAuthed ? '/funds' : '/login'} replace />} />
    </Routes>
  )
}
