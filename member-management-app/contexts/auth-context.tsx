"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthService } from "@/services/auth-service"
import type { User as ApiUser } from "@/types/api-types"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  center?: string
  centroId?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapApiUserToContextUser(apiUser: ApiUser): User {
  if (!apiUser || apiUser.id === undefined || apiUser.id === null) {
    throw new Error("Dados do utilizador inválidos: ID não encontrado")
  }

  return {
    id: apiUser.id.toString(),
    name: apiUser.nome || "Utilizador",
    email: apiUser.email || "",
    role: (apiUser.role?.toLowerCase() || "user") as "admin" | "manager" | "user",
    center: apiUser.centroNome || undefined,
    centroId: apiUser.centroId || undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = AuthService.getStoredToken()
      if (token) {
        try {
          const apiUser = await AuthService.getCurrentUser()
          if (apiUser && apiUser.id !== undefined) {
            setUser(mapApiUserToContextUser(apiUser))
          } else {
            console.error("Dados do utilizador inválidos recebidos da API")
            AuthService.logout()
          }
        } catch (error) {
          console.error("Erro ao validar token:", error)
          AuthService.logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await AuthService.login({ email, password })
      if (response?.user && response.user.id !== undefined) {
        const contextUser = mapApiUserToContextUser(response.user)
        setUser(contextUser)
        setIsLoading(false)
        return true
      } else {
        throw new Error("Resposta de login inválida")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await AuthService.register({
        nome: name,
        email,
        password,
        role: role.charAt(0).toUpperCase() + role.slice(1),
      })
      if (response?.user && response.user.id !== undefined) {
        const contextUser = mapApiUserToContextUser(response.user)
        setUser(contextUser)
        setIsLoading(false)
        return true
      } else {
        throw new Error("Resposta de registo inválida")
      }
    } catch (error) {
      console.error("Erro no registo:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
