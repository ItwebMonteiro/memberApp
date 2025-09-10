"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { MembersService } from "@/services/members-service"
import type { Member as ApiMember } from "@/types/api-types"

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  centerId: string
  centerName: string
  status: "Activo" | "Inactivo" | "Pendente"
  lastPayment: string
  debt: number
  joinDate: string
  address?: string
  birthDate?: string
  document?: string
  emergencyContact?: string
  emergencyPhone?: string
  emergencyRelation?: string
  observations?: string
}

interface MembersContextType {
  members: Member[]
  addMember: (member: Omit<Member, "id" | "joinDate">) => Promise<void>
  updateMember: (id: string, member: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  getMemberById: (id: string) => Member | undefined
  getMembersByCenter: (centerId: string) => Member[]
  updateMemberDebt: (id: string, amount: number) => void
  refreshMembers: () => Promise<void>
  isLoading: boolean
}

const MembersContext = createContext<MembersContextType | undefined>(undefined)

function mapApiMemberToContextMember(apiMember: ApiMember): Member {
  const safeId = apiMember.id?.toString() || Math.random().toString(36).substr(2, 9)
  const safeCentroId = apiMember.centroId?.toString() || "1"

  // Função auxiliar para datas seguras
  const safeDate = (dateValue: string | null | undefined, fallback: string = new Date().toISOString()) => {
    if (!dateValue) return fallback
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? fallback : date.toISOString()
  }

  const safeLocalDate = (dateValue: string | null | undefined, fallback = "Nunca") => {
    if (!dateValue) return fallback
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? fallback : date.toLocaleDateString("pt-AO")
  }

  return {
    id: safeId,
    name: apiMember.nome || "Nome não definido",
    email: apiMember.email || "",
    phone: apiMember.telefone || "",
    centerId: safeCentroId,
    centerName: apiMember.centroNome || "Centro não definido",
    status: apiMember.activo ? "Activo" : "Inactivo",
    lastPayment: safeLocalDate(apiMember.dataUltimoPagamento),
    debt: apiMember.totalDevido || 0,
    joinDate: safeDate(apiMember.dataRegisto).split("T")[0],
    address: apiMember.endereco || "",
    birthDate: safeDate(apiMember.dataNascimento).split("T")[0],
    document: apiMember.numeroIdentificacao || "",
    emergencyContact: apiMember.contactoEmergenciaNome || "",
    emergencyPhone: apiMember.contactoEmergenciaTelefone || "",
    emergencyRelation: apiMember.contactoEmergenciaRelacao || "",
    observations: apiMember.observacoes || "",
  }
}

function mapContextMemberToApiMember(contextMember: Partial<Member>) {
  return {
    nome: contextMember.name || "",
    email: contextMember.email || "",
    telefone: contextMember.phone,
    endereco: contextMember.address || "",
    dataNascimento: contextMember.birthDate || new Date().toISOString(),
    numeroIdentificacao: contextMember.document,
    centroId: Number.parseInt(contextMember.centerId || "1"),
    contactoEmergenciaNome: contextMember.emergencyContact,
    contactoEmergenciaTelefone: contextMember.emergencyPhone,
    contactoEmergenciaRelacao: contextMember.emergencyRelation,
    observacoes: contextMember.observations,
    activo: contextMember.status === "Activo",
  }
}

export function MembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshMembers = async () => {
    try {
      setIsLoading(true)
      const apiMembers = await MembersService.getMembers()
      const contextMembers = apiMembers.map(mapApiMemberToContextMember)
      setMembers(contextMembers)
    } catch (error) {
      console.error("Erro ao carregar membros:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshMembers()
  }, [])

  const addMember = async (memberData: Omit<Member, "id" | "joinDate">) => {
    try {
      const apiMemberData = mapContextMemberToApiMember(memberData)
      const newApiMember = await MembersService.createMember(apiMemberData)
      const newContextMember = mapApiMemberToContextMember(newApiMember)
      setMembers((prev) => [...prev, newContextMember])
    } catch (error) {
      console.error("Erro ao adicionar membro:", error)
      throw error
    }
  }

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      const apiMemberData = mapContextMemberToApiMember(memberData)
      const numericId = Number.parseInt(id) || 0
      await MembersService.updateMember(numericId, apiMemberData)
      setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...memberData } : member)))
    } catch (error) {
      console.error("Erro ao actualizar membro:", error)
      throw error
    }
  }

  const deleteMember = async (id: string) => {
    try {
      const numericId = Number.parseInt(id) || 0
      await MembersService.deleteMember(numericId)
      setMembers((prev) => prev.filter((member) => member.id !== id))
    } catch (error) {
      console.error("Erro ao eliminar membro:", error)
      throw error
    }
  }

  const getMemberById = (id: string) => {
    return members.find((member) => member.id === id)
  }

  const getMembersByCenter = (centerId: string) => {
    return members.filter((member) => member.centerId === centerId)
  }

  const updateMemberDebt = (id: string, amount: number) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, debt: member.debt + amount } : member)))
  }

  return (
    <MembersContext.Provider
      value={{
        members,
        addMember,
        updateMember,
        deleteMember,
        getMemberById,
        getMembersByCenter,
        updateMemberDebt,
        refreshMembers,
        isLoading,
      }}
    >
      {children}
    </MembersContext.Provider>
  )
}

export function useMembers() {
  const context = useContext(MembersContext)
  if (context === undefined) {
    throw new Error("useMembers must be used within a MembersProvider")
  }
  return context
}
