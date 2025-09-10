"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/payments/payment-form"
import { RegisterPaymentForm } from "@/components/payments/register-payment-form"
import type { Payment } from "@/contexts/payments-context"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment?: Payment
  mode: "create" | "edit" | "register"
}

export function PaymentModal({ isOpen, onClose, payment, mode }: PaymentModalProps) {
  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Novo Pagamento"
      case "edit":
        return "Editar Pagamento"
      case "register":
        return "Registrar Pagamento"
      default:
        return "Pagamento"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Preencha as informações para criar um novo pagamento"
      case "edit":
        return "Atualize as informações do pagamento"
      case "register":
        return "Confirme o recebimento do pagamento"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        {mode === "register" && payment ? (
          <RegisterPaymentForm payment={payment} onSuccess={onClose} onCancel={onClose} />
        ) : (
          <PaymentForm payment={payment} onSuccess={onClose} onCancel={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
