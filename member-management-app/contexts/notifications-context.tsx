"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Notification {
  id: string
  type: "sms" | "email" | "system"
  recipient: string
  subject?: string
  message: string
  status: "pending" | "sent" | "failed"
  sentAt?: string
  createdAt: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: "sms" | "email"
  subject?: string
  content: string
  variables: string[]
}

interface NotificationsContextType {
  notifications: Notification[]
  templates: NotificationTemplate[]
  sendNotification: (notification: Omit<Notification, "id" | "status" | "createdAt">) => Promise<void>
  sendBulkNotification: (
    recipients: string[],
    template: NotificationTemplate,
    variables?: Record<string, string>,
  ) => Promise<void>
  createTemplate: (template: Omit<NotificationTemplate, "id">) => void
  updateTemplate: (id: string, template: Partial<NotificationTemplate>) => void
  deleteTemplate: (id: string) => void
  markAsRead: (id: string) => void
  isSending: boolean
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "email",
      recipient: "joao@email.com",
      subject: "Mensalidade em Atraso",
      message: "Sua mensalidade de Janeiro está em atraso. Por favor, regularize sua situação.",
      status: "sent",
      sentAt: "2025-01-08T10:30:00Z",
      createdAt: "2025-01-08T10:25:00Z",
    },
    {
      id: "2",
      type: "sms",
      recipient: "+5511999999999",
      message: "Lembrete: Sua mensalidade vence amanhã. Centro Norte.",
      status: "sent",
      sentAt: "2025-01-07T14:00:00Z",
      createdAt: "2025-01-07T13:55:00Z",
    },
  ])

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Lembrete de Pagamento",
      type: "email",
      subject: "Lembrete: Mensalidade {mes} - {centro}",
      content: "Olá {nome}, sua mensalidade de {mes} no {centro} vence em {dias} dias. Valor: R$ {valor}.",
      variables: ["nome", "mes", "centro", "dias", "valor"],
    },
    {
      id: "2",
      name: "Mensalidade em Atraso",
      type: "sms",
      content: "{nome}, sua mensalidade está em atraso. Regularize em {centro}. Valor: R$ {valor}",
      variables: ["nome", "centro", "valor"],
    },
    {
      id: "3",
      name: "Boas-vindas",
      type: "email",
      subject: "Bem-vindo ao {centro}!",
      content: "Olá {nome}, seja bem-vindo ao {centro}! Sua matrícula foi realizada com sucesso.",
      variables: ["nome", "centro"],
    },
  ])

  const [isSending, setIsSending] = useState(false)

  const sendNotification = useCallback(async (notification: Omit<Notification, "id" | "status" | "createdAt">) => {
    setIsSending(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      status: Math.random() > 0.1 ? "sent" : "failed", // 90% success rate
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])
    setIsSending(false)
  }, [])

  const sendBulkNotification = useCallback(
    async (recipients: string[], template: NotificationTemplate, variables: Record<string, string> = {}) => {
      setIsSending(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newNotifications: Notification[] = recipients.map((recipient) => {
        let content = template.content
        let subject = template.subject

        // Replace variables in content and subject
        Object.entries(variables).forEach(([key, value]) => {
          content = content.replace(new RegExp(`{${key}}`, "g"), value)
          if (subject) {
            subject = subject.replace(new RegExp(`{${key}}`, "g"), value)
          }
        })

        return {
          id: `${Date.now()}-${Math.random()}`,
          type: template.type,
          recipient,
          subject,
          message: content,
          status: Math.random() > 0.1 ? "sent" : "failed",
          createdAt: new Date().toISOString(),
          sentAt: new Date().toISOString(),
        }
      })

      setNotifications((prev) => [...newNotifications, ...prev])
      setIsSending(false)
    },
    [],
  )

  const createTemplate = useCallback((template: Omit<NotificationTemplate, "id">) => {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: Date.now().toString(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }, [])

  const updateTemplate = useCallback((id: string, updates: Partial<NotificationTemplate>) => {
    setTemplates((prev) => prev.map((template) => (template.id === id ? { ...template, ...updates } : template)))
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: "sent" } : notification)),
    )
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        templates,
        sendNotification,
        sendBulkNotification,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        markAsRead,
        isSending,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
