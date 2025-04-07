import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

// Types
interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

interface ApiError {
  message: string
  status: number
}

// Query hook
export function useQueryApi<T>(
  key: string[],
  url: string,
  options = {}
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(url)
      return response.data
    },
    ...options,
  })
}

// Mutation hook
export function useMutationApi<T, V = unknown>(
  url: string,
  method: 'post' | 'put' | 'delete' = 'post',
  options = {}
) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: async (data) => {
      const response = await api[method](url, data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries()
    },
    ...options,
  })
} 