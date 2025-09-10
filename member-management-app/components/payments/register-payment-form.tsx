"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard } from "lucide-react"
import { usePayments, type Payment } from "@/contexts/payments-context"

interface RegisterPaymentFormProps {
  payment: Payment
  onSuccess: () => void
  onCancel: () => void
}

export function RegisterPaymentForm({ payment, onSuccess, onCancel }: RegisterPaymentFormProps) {
  const [method, setMethod] = useState<Payment["method"]>("PIX")
  const [paidBy, setPaidBy] = useState(payment.memberName)
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { registerPayment } = usePayments()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!method || !paidBy) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      registerPayment(payment.id, method, paidBy, notes)
      onSuccess()
    } catch (err) {
      setError("Erro ao registrar pagamento. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Detalhes do Pagamento</h3>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Membro:</strong> {payment.memberName}
          </p>
          <p>
            <strong>Centro:</strong> {payment.centerName}
          </p>
          <p>
            <strong>Valor:</strong> R$ {payment.amount.toFixed(2)}
          </p>
          <p>
            <strong>Vencimento:</strong> {new Date(payment.dueDate).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Descrição:</strong> {payment.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="method">Método de Pagamento *</Label>
          <Select
            value={method || ""}
            onValueChange={(value: Payment["method"]) => setMethod(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PIX">PIX</SelectItem>
              <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
              <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              <SelectItem value="Transferência">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paidBy">Pago por *</Label>
          <Input
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            placeholder="Nome de quem efetuou o pagamento"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações sobre o pagamento (opcional)"
          disabled={isLoading}
          rows={3}
        />
      </div>

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
              Registrando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Confirmar Pagamento
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
