import { apiClient } from "@/lib/api-client"
import type { Center, CreateCenterRequest, UpdateCenterRequest } from "@/types/api-types"

export class CentersService {
  static async getCenters(search?: string, activo?: boolean): Promise<Center[]> {
    const params = new URLSearchParams()

    if (search) params.append("search", search)
    if (activo !== undefined) params.append("activo", activo.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/centers?${queryString}` : "/centers"

    return await apiClient.get<Center[]>(endpoint)
  }

  static async getCenter(id: number): Promise<Center> {
    return await apiClient.get<Center>(`/centers/${id}`)
  }

  static async createCenter(centerData: CreateCenterRequest): Promise<Center> {
    return await apiClient.post<Center>("/centers", centerData)
  }

  static async updateCenter(id: number, centerData: UpdateCenterRequest): Promise<void> {
    await apiClient.put(`/centers/${id}`, centerData)
  }

  static async deleteCenter(id: number): Promise<void> {
    await apiClient.delete(`/centers/${id}`)
  }

  // Método auxiliar para obter centros activos (para dropdowns)
  static async getActiveCenters(): Promise<Center[]> {
    return await this.getCenters(undefined, true)
  }
}
