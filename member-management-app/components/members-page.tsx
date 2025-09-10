"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, CreditCard } from "lucide-react"
import { useMembers, type Member } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"
import { MemberModal } from "@/components/members/member-modal"
import { DeleteMemberDialog } from "@/components/members/delete-member-dialog"

export function MembersPage() {
  const { members } = useMembers()
  const { centers } = useCenters()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [centerFilter, setCenterFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | undefined>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)

  // Filter members based on search term, status, and center
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.centerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesCenter = centerFilter === "all" || member.centerId === centerFilter

    return matchesSearch && matchesStatus && matchesCenter
  })

  const handleAddMember = () => {
    setSelectedMember(undefined)
    setIsModalOpen(true)
  }

  const handleEditMember = (member: Member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member)
    setIsDeleteDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo": // Updated status from "Ativo" to "Activo"
        return "default"
      case "Inactivo": // Updated status from "Inativo" to "Inactivo"
        return "secondary"
      case "Pendente":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "Activo").length // Updated status filter
  const membersWithDebt = members.filter((m) => m.debt > 0).length
  const totalDebt = members.reduce((sum, member) => sum + member.debt, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestão de Membros</h1>
          <p className="text-muted-foreground">Gerencie todos os membros do sistema</p>
        </div>
        <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">{activeMembers} activos</p>{" "}
            {/* Updated "ativos" to "activos" */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membros Activos</CardTitle> {/* Updated "Ativos" to "Activos" */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {((activeMembers / totalMembers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Com Débito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{membersWithDebt}</div>
            <p className="text-xs text-muted-foreground">Membros em atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Débitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalDebt.toFixed(2)} Kz</div>{" "}
            {/* Changed currency from R$ to Kz */}
            <p className="text-xs text-muted-foreground">Valor em atraso</p>
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
                placeholder="Procurar por nome, email, telefone ou centro..." // Changed "Buscar" to "Procurar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem> {/* Updated status options */}
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={centerFilter} onValueChange={setCenterFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Centro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Centros</SelectItem>
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

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>
            {filteredMembers.length} {filteredMembers.length === 1 ? "membro encontrado" : "membros encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || centerFilter !== "all"
                  ? "Nenhum membro encontrado com os filtros aplicados."
                  : "Nenhum membro registado."}{" "}
                {/* Changed "cadastrado" to "registado" */}
              </p>
              {!searchTerm && statusFilter === "all" && centerFilter === "all" && (
                <Button onClick={handleAddMember} className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Registar Primeiro Membro {/* Changed "Cadastrar" to "Registar" */}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                      {member.debt > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Débito: {member.debt.toFixed(2)} Kz {/* Changed currency from R$ to Kz */}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span>{member.email}</span>
                      <span>{member.phone}</span>
                      <span>{member.centerName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Último pagamento: {member.lastPayment}</span>
                      <span>Membro desde: {new Date(member.joinDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMember(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Histórico de Pagamentos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteMember(member)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar {/* Changed "Excluir" to "Eliminar" */}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} member={selectedMember} />

      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        member={memberToDelete}
      />
    </div>
  )
}
