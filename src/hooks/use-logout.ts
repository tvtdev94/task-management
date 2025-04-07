import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export function useLogout() {
  const navigate = useNavigate()
  const { reset } = useAuthStore((state) => state.auth)

  const logout = () => {
    reset()
    navigate({ to: '/sign-in' })
  }

  return { logout }
} 