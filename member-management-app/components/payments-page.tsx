"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, CreditCard, Plus, MoreHorizontal, Edit, Trash2, Receipt } from "lucide-react"
import { usePayments, type Payment } from "@/contexts/payments-context"
import { useCenters } from "@/contexts/centers-context"
import { PaymentModal } from "@/components/payments/payment-modal"
import { MemberStatement } from "@/components/payments/member-statement"
import { PaymentReceipt } from "@/components/payments/payment-receipt"

export function PaymentsPage() {
  const { payments, getPaymentSummary, deletePayment } = usePayments()
  const { centers } = useCenters()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [centerFilter, setCenterFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>()
  const [modalMode, setModalMode] = useState<"create" | "edit" | "register">("create")
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesCenter = centerFilter === "all" || payment.centerId === centerFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesCenter && matchesType
  })

  const summary = getPaymentSummary()

  const handleAddPayment = () => {
    setSelectedPayment(undefined)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleRegisterPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalMode("register")
    setIsModalOpen(true)
  }

  const handleDeletePayment = (payment: Payment) => {
    if (confirm(`Tem certeza que deseja eliminar o pagamento "${payment.description}"?`)) {
      deletePayment(payment.id)
    }
  }

  const handleViewReceipt = (payment: Payment) => {
    setSelectedReceiptPayment(payment)
    setIsReceiptOpen(true)
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestão de Pagamentos</h1>
          <p className="text-muted-foreground">Controlo de mensalidades e pagamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleAddPayment} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="statements">Extractos</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-5">{summary.totalReceived.toFixed(2)} Kz</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">{summary.totalPending.toFixed(2)} Kz</div>
                <p className="text-xs text-muted-foreground">A receber</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{summary.totalOverdue.toFixed(2)} Kz</div>
                <p className="text-xs text-muted-foreground">Vencidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.paymentRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Média geral</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Procurar por membro, centro ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full lg:w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Mensalidade">Mensalidade</SelectItem>
                    <SelectItem value="Taxa">Taxa</SelectItem>
                    <SelectItem value="Multa">Multa</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={centerFilter} onValueChange={setCenterFilter}>
                  <SelectTrigger className="w-full lg:w-[160px]">
                    <SelectValue placeholder="Centro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pagamentos</CardTitle>
              <CardDescription>
                {filteredPayments.length}{" "}
                {filteredPayments.length === 1 ? "pagamento encontrado" : "pagamentos encontrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || centerFilter !== "all" || typeFilter !== "all"
                      ? "Nenhum pagamento encontrado com os filtros aplicados."
                      : "Nenhum pagamento registado."}
                  </p>
                  {!searchTerm && statusFilter === "all" && centerFilter === "all" && typeFilter === "all" && (
                    <Button onClick={handleAddPayment} className="mt-4 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Pagamento
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{payment.memberName}</h3>
                          <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                          <Badge variant="outline">{payment.type}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <span>{payment.centerName}</span>
                          <span>Vencimento: {new Date(payment.dueDate).toLocaleDateString("pt-BR")}</span>
                          {payment.paymentDate && (
                            <span>Pago em: {new Date(payment.paymentDate).toLocaleDateString("pt-BR")}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">{payment.amount.toFixed(2)} Kz</span>
                          <span className="text-muted-foreground">{payment.description}</span>
                          {payment.method && <span className="text-muted-foreground">via {payment.method}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {payment.status !== "Pago" && payment.status !== "Cancelado" && (
                          <Button
                            size="sm"
                            onClick={() => handleRegisterPayment(payment)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Registar
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewReceipt(payment)}>
                              <Receipt className="h-4 w-4 mr-2" />
                              Ver Comprovante
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePayment(payment)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements">
          <MemberStatement />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={selectedPayment}
        mode={modalMode}
      />

      {/* Payment Receipt */}
      <PaymentReceipt payment={selectedReceiptPayment} isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} />
    </div>
  )
}
