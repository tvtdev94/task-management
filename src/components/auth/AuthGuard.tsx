import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { accessToken } = useAuthStore((state) => state.auth)

  useEffect(() => {
    if (!accessToken) {
      // Save current URL for redirect after login
      const redirect = window.location.pathname + window.location.search
      window.location.href = `/sign-in?redirect=${encodeURIComponent(redirect)}`
    }
  }, [accessToken])

  // Don't render children if no token
  if (!accessToken) {
    return null
  }

  return <>{children}</>
} 