"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from "@/contexts/notifications-context"
import { useMembers } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"
import { Loader2, Send, Mail, MessageSquare } from "lucide-react"

export function NotificationForm() {
  const { sendNotification, sendBulkNotification, templates, isSending } = useNotifications()
  const { members } = useMembers()
  const { centers } = useCenters()

  const [formData, setFormData] = useState({
    type: "email" as "email" | "sms",
    recipient: "",
    subject: "",
    message: "",
    templateId: "",
    targetGroup: "all",
    centerId: "",
  })

  const handleSend = async () => {
    if (formData.targetGroup === "single") {
      await sendNotification({
        type: formData.type,
        recipient: formData.recipient,
        subject: formData.subject,
        message: formData.message,
      })
    } else {
      let recipients: string[] = []

      if (formData.targetGroup === "all") {
        recipients = members.map((m) => (formData.type === "email" ? m.email : m.phone))
      } else if (formData.targetGroup === "center" && formData.centerId) {
        recipients = members
          .filter((m) => m.centerId === formData.centerId)
          .map((m) => (formData.type === "email" ? m.email : m.phone))
      } else if (formData.targetGroup === "active") {
        recipients = members
          .filter((m) => m.status === "active")
          .map((m) => (formData.type === "email" ? m.email : m.phone))
      }

      const template = templates.find((t) => t.id === formData.templateId)
      if (template) {
        await sendBulkNotification(recipients, template, {
          centro: centers.find((c) => c.id === formData.centerId)?.name || "Sistema",
          mes: "Janeiro",
          valor: "150,00",
        })
      }
    }

    // Reset form
    setFormData({
      type: "email",
      recipient: "",
      subject: "",
      message: "",
      templateId: "",
      targetGroup: "all",
      centerId: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Enviar Notificação
        </CardTitle>
        <CardDescription>Configure e envie notificações por SMS ou e-mail</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Notificação</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === "sms" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, type: "sms" }))}
                className={formData.type === "sms" ? "bg-primary hover:bg-primary/90" : ""}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                type="button"
                variant={formData.type === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, type: "email" }))}
                className={formData.type === "email" ? "bg-primary hover:bg-primary/90" : ""}
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Destinatários</Label>
            <Select
              value={formData.targetGroup}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, targetGroup: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os membros</SelectItem>
                <SelectItem value="active">Membros ativos</SelectItem>
                <SelectItem value="center">Por centro</SelectItem>
                <SelectItem value="single">Destinatário único</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.targetGroup === "center" && (
            <div className="space-y-2">
              <Label>Centro</Label>
              <Select
                value={formData.centerId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, centerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar centro" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.targetGroup === "single" && (
            <div className="space-y-2">
              <Label>{formData.type === "email" ? "E-mail" : "Telefone"}</Label>
              <Input
                value={formData.recipient}
                onChange={(e) => setFormData((prev) => ({ ...prev, recipient: e.target.value }))}
                placeholder={formData.type === "email" ? "email@exemplo.com" : "+5511999999999"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Template (Opcional)</Label>
            <Select
              value={formData.templateId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, templateId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum template</SelectItem>
                {templates
                  .filter((t) => t.type === formData.type)
                  .map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.type === "email" && (
          <div className="space-y-2">
            <Label>Assunto</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Assunto do e-mail"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Mensagem</Label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Digite sua mensagem aqui..."
            className="min-h-[120px]"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={isSending || !formData.message}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Notificação
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
