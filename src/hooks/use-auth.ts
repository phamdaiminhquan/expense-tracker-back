import { useContext } from 'react'
import { AuthProvider, useAuth as useAuthFromProvider } from '@/app/providers/AuthProvider'

// NOTE: This hook is now provided via context. Ensure `AuthProvider` wraps the app.
export function useAuth() {
  // Re-export to keep backward compatibility for existing imports
  return useAuthFromProvider()
}

// Re-export provider for convenience in non-App composition scenarios
export { AuthProvider }
