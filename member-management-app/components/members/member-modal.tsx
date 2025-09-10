"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemberForm } from "@/components/members/member-form"
import type { Member } from "@/contexts/members-context"

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  member?: Member
}

export function MemberModal({ isOpen, onClose, member }: MemberModalProps) {
  const isEditing = !!member

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Membro" : "Novo Membro"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do membro" : "Preencha as informações para cadastrar um novo membro"}
          </DialogDescription>
        </DialogHeader>
        <MemberForm member={member} onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
