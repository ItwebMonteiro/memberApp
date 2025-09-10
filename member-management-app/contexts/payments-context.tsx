"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Payment {
  id: string
  memberId: string
  memberName: string
  centerId: string
  centerName: string
  amount: number
  dueDate: string
  paymentDate?: string
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
  method?: "PIX" | "Cartão de Crédito" | "Cartão de Débito" | "Dinheiro" | "Transferência"
  description: string
  type: "Mensalidade" | "Taxa" | "Multa" | "Outros"
  createdAt: string
  paidBy?: string
  notes?: string
}

export interface PaymentSummary {
  totalReceived: number
  totalPending: number
  totalOverdue: number
  paymentRate: number
}

interface PaymentsContextType {
  payments: Payment[]
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void
  registerPayment: (id: string, method: Payment["method"], paidBy?: string, notes?: string) => void
  getPaymentById: (id: string) => Payment | undefined
  getPaymentsByMember: (memberId: string) => Payment[]
  getPaymentsByCenter: (centerId: string) => Payment[]
  getPaymentSummary: () => PaymentSummary
  generateMonthlyPayments: (month: string, year: string) => void
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined)

// Mock initial data
const initialPayments: Payment[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "João Silva",
    centerId: "1",
    centerName: "Centro Norte",
    amount: 150.0,
    dueDate: "2025-01-15",
    paymentDate: "2025-01-14",
    status: "Pago",
    method: "PIX",
    description: "Mensalidade Janeiro 2025",
    type: "Mensalidade",
    createdAt: "2025-01-01",
    paidBy: "João Silva",
  },
  {
    id: "2",
    memberId: "2",
    memberName: "Maria Santos",
    centerId: "2",
    centerName: "Centro Sul",
    amount: 150.0,
    dueDate: "2025-01-15",
    status: "Pendente",
    description: "Mensalidade Janeiro 2025",
    type: "Mensalidade",
    createdAt: "2025-01-01",
  },
  {
    id: "3",
    memberId: "3",
    memberName: "Pedro Costa",
    centerId: "3",
    centerName: "Centro Leste",
    amount: 150.0,
    dueDate: "2024-12-15",
    status: "Atrasado",
    description: "Mensalidade Dezembro 2024",
    type: "Mensalidade",
    createdAt: "2024-12-01",
  },
  {
    id: "4",
    memberId: "3",
    memberName: "Pedro Costa",
    centerId: "3",
    centerName: "Centro Leste",
    amount: 25.0,
    dueDate: "2024-12-20",
    status: "Atrasado",
    description: "Multa por atraso",
    type: "Multa",
    createdAt: "2024-12-20",
  },
  {
    id: "5",
    memberId: "4",
    memberName: "Ana Oliveira",
    centerId: "1",
    centerName: "Centro Norte",
    amount: 150.0,
    dueDate: "2025-01-15",
    paymentDate: "2025-01-10",
    status: "Pago",
    method: "Cartão de Crédito",
    description: "Mensalidade Janeiro 2025",
    type: "Mensalidade",
    createdAt: "2025-01-01",
    paidBy: "Ana Oliveira",
  },
]

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)

  const addPayment = (paymentData: Omit<Payment, "id" | "createdAt">) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPayments((prev) => [...prev, newPayment])
  }

  const updatePayment = (id: string, paymentData: Partial<Payment>) => {
    setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, ...paymentData } : payment)))
  }

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id))
  }

  const registerPayment = (id: string, method: Payment["method"], paidBy?: string, notes?: string) => {
    const today = new Date().toISOString().split("T")[0]
    updatePayment(id, {
      status: "Pago",
      paymentDate: today,
      method,
      paidBy,
      notes,
    })
  }

  const getPaymentById = (id: string) => {
    return payments.find((payment) => payment.id === id)
  }

  const getPaymentsByMember = (memberId: string) => {
    return payments
      .filter((payment) => payment.memberId === memberId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  const getPaymentsByCenter = (centerId: string) => {
    return payments.filter((payment) => payment.centerId === centerId)
  }

  const getPaymentSummary = (): PaymentSummary => {
    const totalReceived = payments.filter((p) => p.status === "Pago").reduce((sum, payment) => sum + payment.amount, 0)

    const totalPending = payments
      .filter((p) => p.status === "Pendente")
      .reduce((sum, payment) => sum + payment.amount, 0)

    const totalOverdue = payments
      .filter((p) => p.status === "Atrasado")
      .reduce((sum, payment) => sum + payment.amount, 0)

    const totalPayments = payments.length
    const paidPayments = payments.filter((p) => p.status === "Pago").length
    const paymentRate = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0

    return {
      totalReceived,
      totalPending,
      totalOverdue,
      paymentRate,
    }
  }

  const generateMonthlyPayments = (month: string, year: string) => {
    // This would typically integrate with the members context
    // For now, we'll simulate generating payments for existing members
    console.log(`Generating payments for ${month}/${year}`)
  }

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        registerPayment,
        getPaymentById,
        getPaymentsByMember,
        getPaymentsByCenter,
        getPaymentSummary,
        generateMonthlyPayments,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  )
}

export function usePayments() {
  const context = useContext(PaymentsContext)
  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentsProvider")
  }
  return context
}
