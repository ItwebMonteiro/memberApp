"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useMembers } from "./members-context"
import { useCenters } from "./centers-context"
import { usePayments } from "./payments-context"

export interface ReportFilter {
  centerId?: string
  startDate?: string
  endDate?: string
  status?: string
  reportType: "members" | "financial" | "centers" | "custom"
}

export interface ReportData {
  id: string
  title: string
  type: string
  data: any[]
  generatedAt: string
  filters: ReportFilter
}

interface ReportsContextType {
  reports: ReportData[]
  generateReport: (filters: ReportFilter) => Promise<ReportData>
  exportReport: (reportId: string, format: "pdf" | "excel") => void
  deleteReport: (reportId: string) => void
  isGenerating: boolean
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<ReportData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const { members } = useMembers()
  const { centers } = useCenters()
  const { payments } = usePayments()

  const generateReport = useCallback(
    async (filters: ReportFilter): Promise<ReportData> => {
      setIsGenerating(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let data: any[] = []
      let title = ""

      switch (filters.reportType) {
        case "members":
          data = members
            .filter((member) => !filters.centerId || member.centerId === filters.centerId)
            .filter((member) => !filters.status || member.status === filters.status)
          title = "Relatório de Membros"
          break

        case "financial":
          data = payments.filter((payment) => {
            if (filters.startDate && payment.date < filters.startDate) return false
            if (filters.endDate && payment.date > filters.endDate) return false
            if (filters.centerId) {
              const member = members.find((m) => m.id === payment.memberId)
              if (!member || member.centerId !== filters.centerId) return false
            }
            return true
          })
          title = "Relatório Financeiro"
          break

        case "centers":
          data = centers.map((center) => {
            const centerMembers = members.filter((m) => m.centerId === center.id)
            const centerPayments = payments.filter((p) => {
              const member = members.find((m) => m.id === p.memberId)
              return member?.centerId === center.id
            })

            return {
              ...center,
              totalMembers: centerMembers.length,
              activeMembers: centerMembers.filter((m) => m.status === "active").length,
              totalRevenue: centerPayments.reduce((sum, p) => sum + p.amount, 0),
              averageRevenue:
                centerPayments.length > 0
                  ? centerPayments.reduce((sum, p) => sum + p.amount, 0) / centerPayments.length
                  : 0,
            }
          })
          title = "Relatório de Centros"
          break
      }

      const report: ReportData = {
        id: Date.now().toString(),
        title,
        type: filters.reportType,
        data,
        generatedAt: new Date().toISOString(),
        filters,
      }

      setReports((prev) => [report, ...prev])
      setIsGenerating(false)

      return report
    },
    [members, centers, payments],
  )

  const exportReport = useCallback(
    (reportId: string, format: "pdf" | "excel") => {
      const report = reports.find((r) => r.id === reportId)
      if (!report) return

      // Simulate export functionality
      const blob = new Blob([JSON.stringify(report.data, null, 2)], {
        type: format === "pdf" ? "application/pdf" : "application/vnd.ms-excel",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${report.title.toLowerCase().replace(/\s+/g, "-")}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [reports],
  )

  const deleteReport = useCallback((reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId))
  }, [])

  return (
    <ReportsContext.Provider
      value={{
        reports,
        generateReport,
        exportReport,
        deleteReport,
        isGenerating,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider")
  }
  return context
}
