"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMembers, type Member } from "@/contexts/members-context"

interface DeleteMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  member: Member | null
}

export function DeleteMemberDialog({ isOpen, onClose, member }: DeleteMemberDialogProps) {
  const { deleteMember } = useMembers()

  const handleDelete = () => {
    if (member) {
      deleteMember(member.id)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Membro</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o membro "{member?.name}"? Esta ação não pode ser desfeita e todos os dados
            relacionados serão perdidos.
            {member?.debt && member.debt > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Atenção: Este membro possui débito de R$ {member.debt.toFixed(2)}.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
