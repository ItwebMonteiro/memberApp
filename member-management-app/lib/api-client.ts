// Cliente HTTP configurado para comunicar com a Web API C#
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  errors?: string[]
}

const mockData = {
  users: [
    {
      id: 1,
      email: "admin@sistema.com",
      password: "123456", // Em produção seria hash
      name: "Administrador",
      role: "Admin",
      isActive: true,
    },
    {
      id: 2,
      email: "gerente@norte.com",
      password: "123456",
      name: "Gerente Norte",
      role: "Manager",
      centerId: 1,
      isActive: true,
    },
  ],
  centers: [
    {
      id: 1,
      name: "Centro Norte",
      address: "Rua das Flores, 123",
      phone: "+244 923 456 789",
      email: "norte@sistema.com",
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Centro Sul",
      address: "Avenida da Paz, 456",
      phone: "+244 923 789 456",
      email: "sul@sistema.com",
      isActive: true,
      createdAt: "2024-01-20T14:30:00Z",
    },
  ],
  members: [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      phone: "+244 923 111 222",
      centerId: 1,
      status: "Activo",
      joinDate: "2024-01-10T00:00:00Z",
      monthlyFee: 15000,
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "+244 923 333 444",
      centerId: 1,
      status: "Activo",
      joinDate: "2024-02-01T00:00:00Z",
      monthlyFee: 15000,
    },
  ],
}

class ApiClient {
  private baseURL: string
  private token: string | null = null
  private useMockData = false

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Carregar token do localStorage se disponível
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  private mockLogin(email: string, password: string) {
    const user = mockData.users.find((u) => u.email === email && u.password === password)
    if (user) {
      const token = `mock_token_${user.id}_${Date.now()}`
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          centerId: user.centerId,
        },
      }
    }
    throw new Error("Email ou palavra-passe incorrectos")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado ou inválido
          this.setToken(null)
          window.location.href = "/login"
          throw new Error("Sessão expirada. Faça login novamente.")
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return response.text() as unknown as T
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("API não disponível, usando dados mock")
        this.useMockData = true
        return this.handleMockRequest<T>(endpoint, options)
      }

      console.error("Erro na requisição API:", error)
      throw error
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET"

    // Simular delay da rede
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Login
    if (endpoint === "/auth/login" && method === "POST") {
      const body = JSON.parse(options.body as string)
      return this.mockLogin(body.email, body.password) as T
    }

    // Centros
    if (endpoint === "/centers" && method === "GET") {
      return mockData.centers as T
    }

    // Membros
    if (endpoint === "/members" && method === "GET") {
      return mockData.members as T
    }

    // Dashboard stats
    if (endpoint === "/dashboard/stats" && method === "GET") {
      return {
        totalMembers: mockData.members.length,
        activeMembers: mockData.members.filter((m) => m.status === "Activo").length,
        totalCenters: mockData.centers.length,
        activeCenters: mockData.centers.filter((c) => c.isActive).length,
        monthlyRevenue: mockData.members.reduce((sum, m) => sum + m.monthlyFee, 0),
        pendingPayments: 2,
      } as T
    }

    // Default: retornar array vazio ou objeto vazio
    if (method === "GET") {
      return (endpoint.includes("/") ? [] : {}) as T
    }

    return {} as T
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
