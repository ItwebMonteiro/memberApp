"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CenterForm } from "@/components/centers/center-form"
import type { Center } from "@/contexts/centers-context"

interface CenterModalProps {
  isOpen: boolean
  onClose: () => void
  center?: Center
}

export function CenterModal({ isOpen, onClose, center }: CenterModalProps) {
  const isEditing = !!center

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Centro" : "Novo Centro"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do centro" : "Preencha as informações para criar um novo centro"}
          </DialogDescription>
        </DialogHeader>
        <CenterForm center={center} onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
