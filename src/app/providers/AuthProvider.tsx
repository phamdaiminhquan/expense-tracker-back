import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  AuthSession,
  clearAuthSession,
  loadAuthSession,
  refreshToken,
  saveAuthSession,
  shouldRefreshSession,
} from '@/lib/auth'

interface AuthContextValue {
  session: AuthSession | null
  currentUser: AuthSession['user'] | null
  currentUserId: string | null
  currentUserName: string | null
  isAuthed: boolean
  isRefreshing: boolean
  login: (next: AuthSession) => void
  logout: () => void
  attemptRefresh: () => Promise<void>
  resolveUserName: (userId: string) => string
}

const AuthContext = createContext<AuthContextValue | null>(null)

function useAuthState(): AuthContextValue {
  const [session, setSession] = useState<AuthSession | null>(() => loadAuthSession())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const login = useCallback((next: AuthSession) => {
    setSession(next)
    saveAuthSession(next)
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const attemptRefresh = useCallback(async () => {
    if (!session || !shouldRefreshSession(session)) return

    setIsRefreshing(true)
    try {
      const refreshed = await refreshToken({ refreshToken: session.refreshToken })
      setSession(refreshed)
      saveAuthSession(refreshed)
    } catch (error) {
      console.error('Refresh token failed', error)
      logout()
    } finally {
      setIsRefreshing(false)
    }
  }, [logout, session])

  useEffect(() => {
    attemptRefresh()
    const id = setInterval(attemptRefresh, 60_000)
    return () => clearInterval(id)
  }, [attemptRefresh])

  const currentUser = session?.user ?? null
  const currentUserId = currentUser?.id ?? null
  const currentUserName = currentUser?.name ?? null

  const resolveUserName = useCallback(
    (userId: string) => {
      if (userId === currentUserId && currentUserName) return currentUserName
      return 'Thành viên'
    },
    [currentUserId, currentUserName]
  )

  const isAuthed = useMemo(() => Boolean(currentUserId && currentUserName), [currentUserId, currentUserName])

  return {
    session,
    currentUser,
    currentUserId,
    currentUserName,
    isAuthed,
    isRefreshing,
    login,
    logout,
    attemptRefresh,
    resolveUserName,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthState()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
