import { LoginCredentials, LoginResponse } from '@/types/auth'

// Mock user data
const mockUser = {
  accountNo: 'TEST001',
  email: 'test@example.com',
  role: ['user'],
  exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
}

// Mock access token
const mockToken = 'mock_access_token_123'

// Mock login function
export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        data: {
          accessToken: mockToken,
          user: mockUser,
        },
        message: 'Login successful',
        status: 200,
      }
    }

    // Throw error for invalid credentials
    throw {
      message: 'Invalid email or password',
      status: 401,
    }
  },
} 