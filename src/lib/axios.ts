import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState().auth
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast({
        variant: 'destructive',
        title: 'Session expired!',
      })
      useAuthStore.getState().auth.reset()
      window.location.href = '/sign-in'
    }
    if (error.response?.status === 403) {
      toast({
        variant: 'destructive',
        title: 'Access denied!',
      })
    }
    if (error.response?.status === 500) {
      toast({
        variant: 'destructive',
        title: 'Internal Server Error!',
      })
      window.location.href = '/500'
    }
    return Promise.reject(error)
  }
)

export default api 