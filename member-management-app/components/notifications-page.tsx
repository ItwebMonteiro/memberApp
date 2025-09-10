"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NotificationForm } from "./notifications/notification-form"
import { NotificationsHistory } from "./notifications/notifications-history"
import { useNotifications } from "@/contexts/notifications-context"
import { Mail, MessageSquare, TrendingUp, Users } from "lucide-react"

export function NotificationsPage() {
  const { notifications } = useNotifications()

  const smsCount = notifications.filter((n) => n.type === "sms" && n.status === "sent").length
  const emailCount = notifications.filter((n) => n.type === "email" && n.status === "sent").length
  const totalSent = notifications.filter((n) => n.status === "sent").length
  const totalNotifications = notifications.length
  const deliveryRate = totalNotifications > 0 ? ((totalSent / totalNotifications) * 100).toFixed(1) : "0"

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Sistema de Notificações</h1>
          <p className="text-muted-foreground">Envie SMS e e-mails para os membros do sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{smsCount}</span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-sm">SMS Enviados</h3>
            <p className="text-xs text-muted-foreground">Total no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{emailCount}</span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-sm">E-mails Enviados</h3>
            <p className="text-xs text-muted-foreground">Total no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{deliveryRate}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-sm">Taxa de Entrega</h3>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalNotifications}</span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-sm">Total de Envios</h3>
            <p className="text-xs text-muted-foreground">Todas as notificações</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <NotificationForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <NotificationsHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
