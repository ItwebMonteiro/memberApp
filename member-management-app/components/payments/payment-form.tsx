"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { usePayments, type Payment } from "@/contexts/payments-context"
import { useMembers } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"

interface PaymentFormProps {
  payment?: Payment
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ payment, onSuccess, onCancel }: PaymentFormProps) {
  const [memberId, setMemberId] = useState(payment?.memberId || "")
  const [amount, setAmount] = useState(payment?.amount?.toString() || "")
  const [dueDate, setDueDate] = useState(payment?.dueDate || "")
  const [type, setType] = useState<Payment["type"]>(payment?.type || "Mensalidade")
  const [description, setDescription] = useState(payment?.description || "")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { addPayment, updatePayment } = usePayments()
  const { members } = useMembers()
  const { centers } = useCenters()
  const isEditing = !!payment

  const selectedMember = members.find((m) => m.id === memberId)
  const selectedCenter = centers.find((c) => c.id === selectedMember?.centerId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!memberId || !amount || !dueDate || !description) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    const amountNumber = Number.parseFloat(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError("Por favor, insira um valor válido")
      setIsLoading(false)
      return
    }

    if (!selectedMember || !selectedCenter) {
      setError("Membro ou centro não encontrado")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const paymentData = {
        memberId,
        memberName: selectedMember.name,
        centerId: selectedMember.centerId,
        centerName: selectedCenter.name,
        amount: amountNumber,
        dueDate,
        status: payment?.status || ("Pendente" as const),
        type,
        description,
        paymentDate: payment?.paymentDate,
        method: payment?.method,
        paidBy: payment?.paidBy,
        notes: payment?.notes,
      }

      if (isEditing) {
        updatePayment(payment.id, paymentData)
      } else {
        addPayment(paymentData)
      }

      onSuccess()
    } catch (err) {
      setError("Erro ao salvar pagamento. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="member">Membro *</Label>
          <Select value={memberId} onValueChange={setMemberId} disabled={isLoading || isEditing}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um membro" />
            </SelectTrigger>
            <SelectContent>
              {members
                .filter((member) => member.status === "Ativo")
                .map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.centerName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select value={type} onValueChange={(value: Payment["type"]) => setType(value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mensalidade">Mensalidade</SelectItem>
              <SelectItem value="Taxa">Taxa</SelectItem>
              <SelectItem value="Multa">Multa</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Data de Vencimento *</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do pagamento"
          disabled={isLoading}
          rows={2}
        />
      </div>

      {selectedMember && selectedCenter && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Centro:</strong> {selectedCenter.name}
          </p>
          <p className="text-sm">
            <strong>Membro:</strong> {selectedMember.name} ({selectedMember.email})
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Atualizando..." : "Criando..."}
            </>
          ) : isEditing ? (
            "Atualizar Pagamento"
          ) : (
            "Criar Pagamento"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
