"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CentersService } from "@/services/centers-service"
import type { Center as ApiCenter } from "@/types/api-types"

export interface Center {
  id: string
  name: string
  address: string
  members: number
  status: "Activo" | "Inactivo" | "Em Construção"
  manager: string
  phone?: string
  email?: string
  createdAt: string
  valorMensalidade: number
  description?: string
}

interface CentersContextType {
  centers: Center[]
  addCenter: (center: Omit<Center, "id" | "members" | "createdAt">) => Promise<void>
  updateCenter: (id: string, center: Partial<Center>) => Promise<void>
  deleteCenter: (id: string) => Promise<void>
  getCenterById: (id: string) => Center | undefined
  refreshCenters: () => Promise<void>
  isLoading: boolean
}

const CentersContext = createContext<CentersContextType | undefined>(undefined)

function mapApiCenterToContextCenter(apiCenter: ApiCenter): Center {
  const safeId = apiCenter.id?.toString() || Math.random().toString(36).substr(2, 9)

  // Função auxiliar para data segura
  const safeDate = (dateValue: string | null | undefined, fallback: string = new Date().toISOString()) => {
    if (!dateValue) return fallback
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? fallback : date.toISOString()
  }

  return {
    id: safeId,
    name: apiCenter.nome || "Centro sem nome",
    address: apiCenter.endereco || "",
    members: apiCenter.totalMembros || 0,
    status: apiCenter.activo ? "Activo" : "Inactivo",
    manager: apiCenter.responsavel || "Não definido",
    phone: apiCenter.telefone || "",
    email: apiCenter.email || "",
    createdAt: safeDate(apiCenter.dataCriacao).split("T")[0],
    valorMensalidade: apiCenter.valorMensalidade || 0,
    description: apiCenter.descricao || "",
  }
}

function mapContextCenterToApiCenter(contextCenter: Partial<Center>) {
  return {
    nome: contextCenter.name || "",
    endereco: contextCenter.address || "",
    telefone: contextCenter.phone,
    email: contextCenter.email,
    responsavel: contextCenter.manager,
    valorMensalidade: contextCenter.valorMensalidade || 0,
    descricao: contextCenter.description,
    activo: contextCenter.status === "Activo",
  }
}

export function CentersProvider({ children }: { children: ReactNode }) {
  const [centers, setCenters] = useState<Center[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshCenters = async () => {
    try {
      setIsLoading(true)
      const apiCenters = await CentersService.getCenters()
      const contextCenters = apiCenters.map(mapApiCenterToContextCenter)
      setCenters(contextCenters)
    } catch (error) {
      console.error("Erro ao carregar centros:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshCenters()
  }, [])

  const addCenter = async (centerData: Omit<Center, "id" | "members" | "createdAt">) => {
    try {
      const apiCenterData = mapContextCenterToApiCenter(centerData)
      const newApiCenter = await CentersService.createCenter(apiCenterData)
      const newContextCenter = mapApiCenterToContextCenter(newApiCenter)
      setCenters((prev) => [...prev, newContextCenter])
    } catch (error) {
      console.error("Erro ao adicionar centro:", error)
      throw error
    }
  }

  const updateCenter = async (id: string, centerData: Partial<Center>) => {
    try {
      const apiCenterData = mapContextCenterToApiCenter(centerData)
      const numericId = Number.parseInt(id) || 0
      await CentersService.updateCenter(numericId, apiCenterData)
      setCenters((prev) => prev.map((center) => (center.id === id ? { ...center, ...centerData } : center)))
    } catch (error) {
      console.error("Erro ao actualizar centro:", error)
      throw error
    }
  }

  const deleteCenter = async (id: string) => {
    try {
      const numericId = Number.parseInt(id) || 0
      await CentersService.deleteCenter(numericId)
      setCenters((prev) => prev.filter((center) => center.id !== id))
    } catch (error) {
      console.error("Erro ao eliminar centro:", error)
      throw error
    }
  }

  const getCenterById = (id: string) => {
    return centers.find((center) => center.id === id)
  }

  return (
    <CentersContext.Provider
      value={{
        centers,
        addCenter,
        updateCenter,
        deleteCenter,
        getCenterById,
        refreshCenters,
        isLoading,
      }}
    >
      {children}
    </CentersContext.Provider>
  )
}

export function useCenters() {
  const context = useContext(CentersContext)
  if (context === undefined) {
    throw new Error("useCenters must be used within a CentersProvider")
  }
  return context
}
