"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportGenerator } from "./reports/report-generator"
import { ReportsList } from "./reports/reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { useMembers } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"
import { usePayments } from "@/contexts/payments-context"

export function ReportsPage() {
  const { members } = useMembers()
  const { centers } = useCenters()
  const { payments } = usePayments()

  const activeMembers = members.filter((m) => m.status === "active").length
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = members.filter((m) => m.status === "active").length * 150 - totalRevenue

  const quickReports = [
    {
      name: "Membros Ativos por Centro",
      period: "Atual",
      value: `${activeMembers} membros`,
      icon: FileText,
    },
    {
      name: "Receita Total",
      period: "Janeiro 2025",
      value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
    },
    {
      name: "Pagamentos Pendentes",
      period: "Estimativa",
      value: `R$ ${pendingPayments.toLocaleString("pt-BR")}`,
      icon: BarChart3,
    },
    {
      name: "Total de Centros",
      period: "Ativos",
      value: `${centers.length} centros`,
      icon: PieChart,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Relatórios</h1>
          <p className="text-muted-foreground">Gere relatórios personalizados e extratos detalhados</p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Gerar Relatórios</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="quick">Relatórios Rápidos</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReportsList />
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          {/* Quick Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => {
              const Icon = report.icon
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{report.value}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-sm">{report.name}</h3>
                    <p className="text-xs text-muted-foreground">{report.period}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pre-configured Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Pré-configurados</CardTitle>
              <CardDescription>Relatórios prontos para download imediato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Lista Completa de Membros", description: "Todos os membros cadastrados", type: "members" },
                  {
                    name: "Relatório Financeiro Mensal",
                    description: "Receitas e pagamentos do mês",
                    type: "financial",
                  },
                  { name: "Performance dos Centros", description: "Estatísticas por centro", type: "centers" },
                  { name: "Membros Inadimplentes", description: "Lista de pendências", type: "overdue" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
