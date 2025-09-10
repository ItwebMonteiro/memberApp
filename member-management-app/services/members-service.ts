import { apiClient } from "@/lib/api-client"
import type { Member, CreateMemberRequest, UpdateMemberRequest } from "@/types/api-types"

export class MembersService {
  static async getMembers(search?: string, centroId?: number, activo?: boolean): Promise<Member[]> {
    const params = new URLSearchParams()

    if (search) params.append("search", search)
    if (centroId) params.append("centroId", centroId.toString())
    if (activo !== undefined) params.append("activo", activo.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/members?${queryString}` : "/members"

    return await apiClient.get<Member[]>(endpoint)
  }

  static async getMember(id: number): Promise<Member> {
    return await apiClient.get<Member>(`/members/${id}`)
  }

  static async createMember(memberData: CreateMemberRequest): Promise<Member> {
    return await apiClient.post<Member>("/members", memberData)
  }

  static async updateMember(id: number, memberData: UpdateMemberRequest): Promise<void> {
    await apiClient.put(`/members/${id}`, memberData)
  }

  static async deleteMember(id: number): Promise<void> {
    await apiClient.delete(`/members/${id}`)
  }

  // Método para obter membros de um centro específico
  static async getMembersByCenter(centroId: number): Promise<Member[]> {
    return await this.getMembers(undefined, centroId, true)
  }

  // Método para obter estatísticas de membros
  static async getMembersStats(centroId?: number): Promise<{
    total: number
    activos: number
    inactivos: number
    novosEsteMs: number
  }> {
    const params = new URLSearchParams()
    if (centroId) params.append("centroId", centroId.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/members/stats?${queryString}` : "/members/stats"

    return await apiClient.get(endpoint)
  }
}
