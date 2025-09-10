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
import { useMembers, type Member } from "@/contexts/members-context"
import { useCenters } from "@/contexts/centers-context"

interface MemberFormProps {
  member?: Member
  onSuccess: () => void
  onCancel: () => void
}

export function MemberForm({ member, onSuccess, onCancel }: MemberFormProps) {
  const [name, setName] = useState(member?.name || "")
  const [email, setEmail] = useState(member?.email || "")
  const [phone, setPhone] = useState(member?.phone || "")
  const [centerId, setCenterId] = useState(member?.centerId || "")
  const [status, setStatus] = useState<"Ativo" | "Inativo" | "Pendente">(member?.status || "Ativo")
  const [address, setAddress] = useState(member?.address || "")
  const [birthDate, setBirthDate] = useState(member?.birthDate || "")
  const [document, setDocument] = useState(member?.document || "")
  const [emergencyContact, setEmergencyContact] = useState(member?.emergencyContact || "")
  const [emergencyPhone, setEmergencyPhone] = useState(member?.emergencyPhone || "")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { addMember, updateMember } = useMembers()
  const { centers } = useCenters()
  const isEditing = !!member

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!name || !email || !phone || !centerId) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedCenter = centers.find((c) => c.id === centerId)
      const memberData = {
        name,
        email,
        phone,
        centerId,
        centerName: selectedCenter?.name || "",
        status,
        lastPayment: member?.lastPayment || new Date().toLocaleDateString("pt-BR"),
        debt: member?.debt || 0,
        address,
        birthDate,
        document,
        emergencyContact,
        emergencyPhone,
      }

      if (isEditing) {
        updateMember(member.id, memberData)
      } else {
        addMember(memberData)
      }

      onSuccess()
    } catch (err) {
      setError("Erro ao salvar membro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo do membro"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="center">Centro *</Label>
            <Select value={centerId} onValueChange={setCenterId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um centro" />
              </SelectTrigger>
              <SelectContent>
                {centers
                  .filter((center) => center.status === "Ativo")
                  .map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "Ativo" | "Inativo" | "Pendente") => setStatus(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Adicionais</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Endereço completo"
            disabled={isLoading}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">CPF</Label>
          <Input
            id="document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="000.000.000-00"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contato de Emergência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Nome do Contato</Label>
            <Input
              id="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Nome do contato de emergência"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Telefone do Contato</Label>
            <Input
              id="emergencyPhone"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
          </div>
        </div>
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
            "Atualizar Membro"
          ) : (
            "Criar Membro"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
