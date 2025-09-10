import { apiClient } from "@/lib/api-client"
import type { Payment, CreatePaymentRequest } from "@/types/api-types"

export class PaymentsService {
  static async getPayments(
    membroId?: number,
    centroId?: number,
    status?: string,
    mesReferencia?: number,
    anoReferencia?: number,
  ): Promise<Payment[]> {
    const params = new URLSearchParams()

    if (membroId) params.append("membroId", membroId.toString())
    if (centroId) params.append("centroId", centroId.toString())
    if (status) params.append("status", status)
    if (mesReferencia) params.append("mesReferencia", mesReferencia.toString())
    if (anoReferencia) params.append("anoReferencia", anoReferencia.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/payments?${queryString}` : "/payments"

    return await apiClient.get<Payment[]>(endpoint)
  }

  static async getPayment(id: number): Promise<Payment> {
    return await apiClient.get<Payment>(`/payments/${id}`)
  }

  static async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    return await apiClient.post<Payment>("/payments", paymentData)
  }

  static async updatePayment(id: number, paymentData: Partial<CreatePaymentRequest>): Promise<void> {
    await apiClient.put(`/payments/${id}`, paymentData)
  }

  static async deletePayment(id: number): Promise<void> {
    await apiClient.delete(`/payments/${id}`)
  }

  // Método para obter extrato de um membro
  static async getMemberStatement(membroId: number, ano?: number): Promise<Payment[]> {
    const params = new URLSearchParams()
    if (ano) params.append("ano", ano.toString())

    const queryString = params.toString()
    const endpoint = queryString
      ? `/payments/member/${membroId}/statement?${queryString}`
      : `/payments/member/${membroId}/statement`

    return await apiClient.get<Payment[]>(endpoint)
  }

  // Método para gerar mensalidades automáticas
  static async generateMonthlyPayments(
    mesReferencia: number,
    anoReferencia: number,
    centroId?: number,
  ): Promise<{ mensalidadesGeradas: number }> {
    return await apiClient.post("/payments/generate-monthly", {
      mesReferencia,
      anoReferencia,
      centroId,
    })
  }

  // Método para obter estatísticas de pagamentos
  static async getPaymentsStats(centroId?: number): Promise<{
    totalRecebido: number
    totalPendente: number
    totalAtrasado: number
    pagamentosEsteMs: number
  }> {
    const params = new URLSearchParams()
    if (centroId) params.append("centroId", centroId.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/payments/stats?${queryString}` : "/payments/stats"

    return await apiClient.get(endpoint)
  }
}
