"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/contexts/notifications-context"
import { Mail, MessageSquare, Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function NotificationsHistory() {
  const { notifications } = useNotifications()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviado"
      case "failed":
        return "Falhou"
      case "pending":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma notificação enviada</h3>
          <p className="text-muted-foreground">Use o formulário acima para enviar sua primeira notificação</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Notificações</CardTitle>
        <CardDescription>Últimas notificações enviadas pelo sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  {notification.type === "sms" ? (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <h3 className="font-semibold">
                    {notification.subject || `${notification.type.toUpperCase()} - ${notification.recipient}`}
                  </h3>
                  <Badge className={getStatusColor(notification.status)}>
                    {getStatusIcon(notification.status)}
                    <span className="ml-1">{getStatusLabel(notification.status)}</span>
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {notification.recipient}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(notification.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                Ver Detalhes
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
