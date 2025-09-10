"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, X } from "lucide-react"
import type { Payment } from "@/contexts/payments-context"

interface PaymentReceiptProps {
  payment: Payment | null
  isOpen: boolean
  onClose: () => void
}

export function PaymentReceipt({ payment, isOpen, onClose }: PaymentReceiptProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  if (!payment) return null

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 1000)
  }

  const handleDownload = () => {
    // Simular download do recibo em PDF
    const element = document.createElement("a")
    element.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(`
RECIBO DE PAGAMENTO
===================

Número: ${payment.id}
Data de Emissão: ${new Date().toLocaleDateString("pt-AO")}

DADOS DO MEMBRO:
Nome: ${payment.memberName}
Centro: ${payment.centerName}

DETALHES DO PAGAMENTO:
Descrição: ${payment.description}
Tipo: ${payment.type}
Valor: ${payment.amount.toFixed(2)} Kz
Status: ${payment.status}
Data de Vencimento: ${new Date(payment.dueDate).toLocaleDateString("pt-AO")}
${payment.paymentDate ? `Data de Pagamento: ${new Date(payment.paymentDate).toLocaleDateString("pt-AO")}` : ""}
${payment.method ? `Método de Pagamento: ${payment.method}` : ""}

Observações: ${payment.notes || "Nenhuma observação"}

Este documento serve como comprovante de pagamento.
    `)
    element.download = `recibo-${payment.id}-${payment.memberName.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Recibo de Pagamento</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descarregar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
              <Printer className="h-4 w-4 mr-2" />
              {isPrinting ? "Imprimindo..." : "Imprimir"}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 print:space-y-4" id="receipt-content">
          {/* Header do Recibo */}
          <div className="text-center space-y-2 print:space-y-1">
            <h1 className="text-2xl font-bold print:text-xl">SISTEMA DE GESTÃO DE MEMBROS</h1>
            <h2 className="text-lg font-semibold text-primary print:text-base">RECIBO DE PAGAMENTO</h2>
            <div className="text-sm text-muted-foreground">
              Número: <span className="font-mono font-semibold">#{payment.id}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Data de Emissão:{" "}
              {new Date().toLocaleDateString("pt-AO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <Separator />

          {/* Dados do Membro */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">DADOS DO MEMBRO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="font-semibold">{payment.memberName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Centro</label>
                  <p className="font-semibold">{payment.centerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Pagamento */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">DETALHES DO PAGAMENTO</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <p className="font-semibold">{payment.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{payment.type}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor</label>
                    <p className="text-2xl font-bold text-primary">{payment.amount.toFixed(2)} Kz</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                    <p className="font-semibold">
                      {new Date(payment.dueDate).toLocaleDateString("pt-AO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {payment.paymentDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Pagamento</label>
                      <p className="font-semibold text-green-600">
                        {new Date(payment.paymentDate).toLocaleDateString("pt-AO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {payment.method && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Método de Pagamento</label>
                    <p className="font-semibold">{payment.method}</p>
                  </div>
                )}

                {payment.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-sm bg-muted p-3 rounded-md">{payment.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">RESUMO FINANCEIRO</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valor Base:</span>
                  <span className="font-semibold">{payment.amount.toFixed(2)} Kz</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto:</span>
                  <span className="font-semibold">0,00 Kz</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa Adicional:</span>
                  <span className="font-semibold">0,00 Kz</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL:</span>
                  <span className="text-primary">{payment.amount.toFixed(2)} Kz</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2 print:space-y-1">
            <p>Este documento serve como comprovante de pagamento.</p>
            <p>Para questões ou esclarecimentos, contacte a administração do centro.</p>
            <div className="text-xs">Documento gerado automaticamente em {new Date().toLocaleString("pt-AO")}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
