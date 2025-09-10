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
import { useCenters, type Center } from "@/contexts/centers-context"

interface CenterFormProps {
  center?: Center
  onSuccess: () => void
  onCancel: () => void
}

export function CenterForm({ center, onSuccess, onCancel }: CenterFormProps) {
  const [name, setName] = useState(center?.name || "")
  const [address, setAddress] = useState(center?.address || "")
  const [manager, setManager] = useState(center?.manager || "")
  const [phone, setPhone] = useState(center?.phone || "")
  const [email, setEmail] = useState(center?.email || "")
  const [status, setStatus] = useState<"Ativo" | "Inativo" | "Em Construção">(center?.status || "Ativo")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { addCenter, updateCenter } = useCenters()
  const isEditing = !!center

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!name || !address || !manager) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const centerData = {
        name,
        address,
        manager,
        phone,
        email,
        status,
      }

      if (isEditing) {
        updateCenter(center.id, centerData)
      } else {
        addCenter(centerData)
      }

      onSuccess()
    } catch (err) {
      setError("Erro ao salvar centro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Centro *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Centro Norte"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={status}
            onValueChange={(value: "Ativo" | "Inativo" | "Em Construção") => setStatus(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
              <SelectItem value="Em Construção">Em Construção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço *</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Endereço completo do centro"
          disabled={isLoading}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manager">Gerente *</Label>
          <Input
            id="manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            placeholder="Nome do gerente"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="centro@email.com"
          disabled={isLoading}
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
              {isEditing ? "Atualizando..." : "Criando..."}
            </>
          ) : isEditing ? (
            "Atualizar Centro"
          ) : (
            "Criar Centro"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
