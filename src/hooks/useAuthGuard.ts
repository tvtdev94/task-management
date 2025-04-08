import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuthGuard() {
  const { accessToken } = useAuthStore((state) => state.auth)

  useEffect(() => {
    if (!accessToken) {
      // Save current URL for redirect after login
      const redirect = window.location.pathname + window.location.search
      window.location.href = `/sign-in?redirect=${encodeURIComponent(redirect)}`
    }
  }, [accessToken])

  return {
    isAuthenticated: !!accessToken
  }
} 