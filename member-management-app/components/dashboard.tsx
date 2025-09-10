"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building2, CreditCard, TrendingUp, Plus, Eye } from "lucide-react"
import { useMembers } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"
import { usePayments } from "@/contexts/payments-context"
import { useEffect, useState } from "react"

export function Dashboard() {
  const { members, getStats: getMemberStats } = useMembers()
  const { centers, getStats: getCenterStats } = useCenters()
  const { payments, getPaymentSummary } = usePayments()
  const [isLoading, setIsLoading] = useState(true)

  const memberStats = getMemberStats()
  const centerStats = getCenterStats()
  const paymentSummary = getPaymentSummary()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      title: "Total de Membros",
      value: isLoading ? "..." : memberStats.total.toString(),
      description: `${memberStats.active} activos, ${memberStats.inactive} inactivos`,
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "Centros Activos",
      value: isLoading ? "..." : centerStats.active.toString(),
      description: `${centerStats.total} centros no total`,
      icon: Building2,
      color: "text-chart-2",
    },
    {
      title: "Pagamentos Pendentes",
      value: isLoading ? "..." : `${paymentSummary.totalPending.toLocaleString()} Kz`,
      description: `${paymentSummary.totalOverdue.toLocaleString()} Kz em atraso`,
      icon: CreditCard,
      color: "text-destructive",
    },
    {
      title: "Receita Recebida",
      value: isLoading ? "..." : `${paymentSummary.totalReceived.toLocaleString()} Kz`,
      description: `Taxa de pagamento: ${paymentSummary.paymentRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-chart-5",
    },
  ]

  const quickActions = [
    { label: "Novo Membro", icon: Plus, action: "members" },
    { label: "Novo Centro", icon: Plus, action: "centers" },
    { label: "Ver Relatórios", icon: Eye, action: "reports" },
    { label: "Notificações", icon: Eye, action: "notifications" },
  ]

  const recentActivity = [
    ...members.slice(0, 2).map((member) => ({
      action: "Membro registado",
      member: member.name,
      time: "recente",
      center: member.centerName || "Centro não definido",
    })),
    ...payments
      .filter((p) => p.status === "Pago")
      .slice(0, 2)
      .map((payment) => ({
        action: "Pagamento recebido",
        member: payment.memberName,
        time: payment.paymentDate ? "recente" : "pendente",
        center: payment.centerName,
      })),
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-balance">Painel de Controlo</h1>
        <p className="text-muted-foreground">Visão geral do sistema de gestão de membros</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acções Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividade Recente</CardTitle>
          <CardDescription>Últimas acções realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.member} • {activity.center}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma actividade recente encontrada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
