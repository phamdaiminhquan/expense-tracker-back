import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AppReadyContextValue {
  isAppReady: boolean
  setAppReady: () => void
}

const AppReadyContext = createContext<AppReadyContextValue | null>(null)

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [isAppReady, setIsAppReady] = useState(false)

  const setAppReady = useCallback(() => {
    setIsAppReady(true)
  }, [])

  return (
    <AppReadyContext.Provider value={{ isAppReady, setAppReady }}>
      {children}
    </AppReadyContext.Provider>
  )
}

export function useAppReady() {
  const ctx = useContext(AppReadyContext)
  if (!ctx) {
    throw new Error('useAppReady must be used within AppReadyProvider')
  }
  return ctx
}

