import { apiClient } from "@/lib/api-client"
import type { Report, CreateReportRequest } from "@/types/api-types"

export class ReportsService {
  static async getReports(tipo?: string, centroId?: number): Promise<Report[]> {
    const params = new URLSearchParams()

    if (tipo) params.append("tipo", tipo)
    if (centroId) params.append("centroId", centroId.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/reports?${queryString}` : "/reports"

    return await apiClient.get<Report[]>(endpoint)
  }

  static async getReport(id: number): Promise<Report> {
    return await apiClient.get<Report>(`/reports/${id}`)
  }

  static async generateReport(reportData: CreateReportRequest): Promise<Report> {
    return await apiClient.post<Report>("/reports", reportData)
  }

  static async downloadReport(id: number): Promise<Blob> {
    const response = await fetch(`${apiClient["baseURL"]}/reports/${id}/download`, {
      headers: {
        Authorization: `Bearer ${apiClient["token"]}`,
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao fazer download do relatório")
    }

    return await response.blob()
  }

  static async deleteReport(id: number): Promise<void> {
    await apiClient.delete(`/reports/${id}`)
  }

  // Métodos para relatórios específicos
  static async generateMembersReport(
    centroId?: number,
    activo?: boolean,
    formato: "PDF" | "Excel" = "PDF",
  ): Promise<Report> {
    return await this.generateReport({
      nome: "Relatório de Membros",
      tipo: "Membros",
      parametros: { centroId, activo },
      centroId,
      formato,
    })
  }

  static async generatePaymentsReport(
    centroId?: number,
    mesReferencia?: number,
    anoReferencia?: number,
    formato: "PDF" | "Excel" = "PDF",
  ): Promise<Report> {
    return await this.generateReport({
      nome: "Relatório de Pagamentos",
      tipo: "Pagamentos",
      parametros: { centroId, mesReferencia, anoReferencia },
      centroId,
      formato,
    })
  }

  static async generateFinancialReport(
    centroId?: number,
    anoReferencia?: number,
    formato: "PDF" | "Excel" = "PDF",
  ): Promise<Report> {
    return await this.generateReport({
      nome: "Relatório Financeiro",
      tipo: "Financeiro",
      parametros: { centroId, anoReferencia },
      centroId,
      formato,
    })
  }
}
