export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    accountNo: string
    email: string
    role: string[]
    exp: number
  }
} 