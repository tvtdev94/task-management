import { useMutationApi } from '@/hooks/use-api'
import { LoginCredentials, LoginResponse } from '@/types/auth'

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
      }
    )
  },
} 