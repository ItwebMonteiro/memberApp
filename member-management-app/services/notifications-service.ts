import { apiClient } from "@/lib/api-client"
import type { Notification, CreateNotificationRequest } from "@/types/api-types"

export class NotificationsService {
  static async getNotifications(status?: string, tipo?: string, centroId?: number): Promise<Notification[]> {
    const params = new URLSearchParams()

    if (status) params.append("status", status)
    if (tipo) params.append("tipo", tipo)
    if (centroId) params.append("centroId", centroId.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/notifications?${queryString}` : "/notifications"

    return await apiClient.get<Notification[]>(endpoint)
  }

  static async getNotification(id: number): Promise<Notification> {
    return await apiClient.get<Notification>(`/notifications/${id}`)
  }

  static async sendNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    return await apiClient.post<Notification>("/notifications", notificationData)
  }

  static async resendNotification(id: number): Promise<void> {
    await apiClient.post(`/notifications/${id}/resend`)
  }

  static async deleteNotification(id: number): Promise<void> {
    await apiClient.delete(`/notifications/${id}`)
  }

  // Método para enviar notificação para todos os membros de um centro
  static async sendToCenterMembers(
    centroId: number,
    titulo: string,
    mensagem: string,
    tipo: "SMS" | "Email" | "Ambos",
  ): Promise<Notification> {
    return await this.sendNotification({
      titulo,
      mensagem,
      tipo,
      centroId,
    })
  }

  // Método para enviar notificação para um membro específico
  static async sendToMember(
    membroId: number,
    titulo: string,
    mensagem: string,
    tipo: "SMS" | "Email" | "Ambos",
  ): Promise<Notification> {
    return await this.sendNotification({
      titulo,
      mensagem,
      tipo,
      membroId,
    })
  }
}
