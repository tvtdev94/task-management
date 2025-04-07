import { useMutationApi } from '@/hooks/use-api'
import { LoginCredentials, LoginResponse } from '@/types/auth'
import { mockAuthService } from './mock-auth'
import { useAuthStore } from '@/stores/authStore'

export const authService = {
  login: () => {
    return useMutationApi<LoginResponse, LoginCredentials>(
      '/auth/login',
      'post',
      {
        onSuccess: (data) => {
          const { setUser, setAccessToken } = useAuthStore.getState().auth
          setUser(data.data.user)
          setAccessToken(data.data.accessToken)
        },
        // Use mock service in development
        mutationFn: import.meta.env.VITE_ENABLE_MOCK_API
          ? mockAuthService.login
          : undefined,
      }
    )
  },
} 