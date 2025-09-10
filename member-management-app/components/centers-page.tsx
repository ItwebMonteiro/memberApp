"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MapPin, Users, MoreHorizontal, Search, Edit, Trash2, Eye } from "lucide-react"
import { useCenters, type Center } from "@/contexts/centers-context"
import { CenterModal } from "@/components/centers/center-modal"
import { DeleteCenterDialog } from "@/components/centers/delete-center-dialog"

export function CentersPage() {
  const { centers } = useCenters()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<Center | undefined>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [centerToDelete, setCenterToDelete] = useState<Center | null>(null)

  // Filter centers based on search term
  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCenter = () => {
    setSelectedCenter(undefined)
    setIsModalOpen(true)
  }

  const handleEditCenter = (center: Center) => {
    setSelectedCenter(center)
    setIsModalOpen(true)
  }

  const handleDeleteCenter = (center: Center) => {
    setCenterToDelete(center)
    setIsDeleteDialogOpen(true)
  }

  const totalMembers = centers.reduce((sum, center) => sum + center.members, 0)
  const activeCenters = centers.filter((c) => c.status === "Activo").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestão de Centros</h1>
          <p className="text-muted-foreground">Gerencie todos os centros do sistema</p>
        </div>
        <Button onClick={handleAddCenter} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Centro
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Procurar centros por nome, endereço ou gerente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Centros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{centers.length}</div>
            <p className="text-xs text-muted-foreground">{activeCenters} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Distribuídos em todos os centros</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média por Centro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {centers.length > 0 ? Math.round(totalMembers / centers.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Membros por centro</p>
          </CardContent>
        </Card>
      </div>

      {/* Centers List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Centros</CardTitle>
          <CardDescription>
            {filteredCenters.length} {filteredCenters.length === 1 ? "centro encontrado" : "centros encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCenters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum centro encontrado com os critérios de procura." : "Nenhum centro registado."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddCenter} className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Centro
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            center.status === "Activo"
                              ? "default"
                              : center.status === "Inactivo"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {center.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCenter(center)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCenter(center)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{center.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{center.members} membros</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Gerente: </span>
                      <span className="font-medium">{center.manager}</span>
                    </div>
                    {center.phone && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Telefone: </span>
                        <span>{center.phone}</span>
                      </div>
                    )}
                    {center.email && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">E-mail: </span>
                        <span>{center.email}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CenterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} center={selectedCenter} />

      <DeleteCenterDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        center={centerToDelete}
      />
    </div>
  )
}
