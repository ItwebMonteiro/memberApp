"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { usePayments } from "@/contexts/payments-context"
import { useMembers } from "@/contexts/members-context"

export function MemberStatement() {
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const { payments, getPaymentsByMember } = usePayments()
  const { members } = useMembers()

  const selectedMember = members.find((m) => m.id === selectedMemberId)
  const memberPayments = selectedMemberId ? getPaymentsByMember(selectedMemberId) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "default"
      case "Pendente":
        return "secondary"
      case "Atrasado":
        return "destructive"
      case "Cancelado":
        return "outline"
      default:
        return "secondary"
    }
  }

  const totalPaid = memberPayments.filter((p) => p.status === "Pago").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = memberPayments.filter((p) => p.status !== "Pago").reduce((sum, p) => sum + p.amount, 0)

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString("pt-AO")} Kz`
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-AO")
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error)
      return "Data inválida"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extrato de Conta Corrente</CardTitle>
          <CardDescription>Visualize o histórico financeiro de um membro específico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Seleccionar Membro</label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um membro" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.centerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedMemberId && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedMember && (
        <>
          {/* Member Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro - {selectedMember.name}</CardTitle>
              <CardDescription>{selectedMember.centerName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-chart-5">{formatCurrency(totalPaid)}</div>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{formatCurrency(totalPending)}</div>
                  <p className="text-sm text-muted-foreground">Total Pendente</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{memberPayments.length}</div>
                  <p className="text-sm text-muted-foreground">Total de Lançamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>{memberPayments.length} lançamentos encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              {memberPayments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum lançamento encontrado para este membro.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {memberPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{payment.description}</h3>
                          <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                          <Badge variant="outline">{payment.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>Vencimento: {formatDate(payment.dueDate)}</span>
                          {payment.paymentDate && (
                            <span className="ml-4">Pago em: {formatDate(payment.paymentDate)}</span>
                          )}
                        </div>
                        {payment.method && (
                          <div className="text-sm text-muted-foreground">
                            Método: {payment.method}
                            {payment.paidBy && ` • Pago por: ${payment.paidBy}`}
                          </div>
                        )}
                        {payment.notes && <div className="text-sm text-muted-foreground">Obs: {payment.notes}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(payment.amount)}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
