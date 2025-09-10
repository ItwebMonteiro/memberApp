import { apiClient } from "@/lib/api-client"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/api-types"

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)

    // Guardar token no cliente
    if (response.token) {
      apiClient.setToken(response.token)
    }

    return response
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData)

    // Guardar token no cliente
    if (response.token) {
      apiClient.setToken(response.token)
    }

    return response
  }

  static async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>("/auth/me")
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh")

    // Actualizar token no cliente
    if (response.token) {
      apiClient.setToken(response.token)
    }

    return response
  }

  static logout(): void {
    apiClient.setToken(null)
    // Redirecionar para página de login
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  static getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}
