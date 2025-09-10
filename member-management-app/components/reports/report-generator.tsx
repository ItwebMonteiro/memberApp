"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReports, type ReportFilter } from "@/contexts/reports-context"
import { useCenters } from "@/contexts/centers-context"
import { Loader2, FileText } from "lucide-react"

export function ReportGenerator() {
  const { generateReport, isGenerating } = useReports()
  const { centers } = useCenters()

  const [filters, setFilters] = useState<ReportFilter>({
    reportType: "members",
    startDate: "",
    endDate: "",
    centerId: "all", // Updated default value to 'all'
    status: "all", // Updated default value to 'all'
  })

  const handleGenerate = async () => {
    await generateReport(filters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Relatórios
        </CardTitle>
        <CardDescription>Configure os filtros e gere relatórios personalizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Tipo de Relatório</Label>
            <Select
              value={filters.reportType}
              onValueChange={(value: any) => setFilters((prev) => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="members">Relatório de Membros</SelectItem>
                <SelectItem value="financial">Relatório Financeiro</SelectItem>
                <SelectItem value="centers">Relatório de Centros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="center">Centro</Label>
            <Select
              value={filters.centerId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, centerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os centros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os centros</SelectItem> {/* Updated value prop to 'all' */}
                {centers.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {filters.reportType === "members" && (
            <div className="space-y-2">
              <Label htmlFor="status">Status do Membro</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem> {/* Updated value prop to 'all' */}
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-primary hover:bg-primary/90">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando Relatório...
            </>
          ) : (
            "Gerar Relatório"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
