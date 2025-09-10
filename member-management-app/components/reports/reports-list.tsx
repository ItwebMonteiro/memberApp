"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useReports } from "@/contexts/reports-context"
import { Download, Trash2, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ReportsList() {
  const { reports, exportReport, deleteReport } = useReports()

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "members":
        return "Membros"
      case "financial":
        return "Financeiro"
      case "centers":
        return "Centros"
      default:
        return "Personalizado"
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "members":
        return "bg-blue-100 text-blue-800"
      case "financial":
        return "bg-green-100 text-green-800"
      case "centers":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum relatório gerado</h3>
          <p className="text-muted-foreground">Use o gerador acima para criar seu primeiro relatório</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Gerados</CardTitle>
        <CardDescription>Histórico de relatórios criados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{report.title}</h3>
                  <Badge className={getReportTypeColor(report.type)}>{getReportTypeLabel(report.type)}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(report.generatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                  <div>
                    {report.data.length} registro{report.data.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => exportReport(report.id, "excel")}>
                  <Download className="h-4 w-4 mr-1" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport(report.id, "pdf")}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteReport(report.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
