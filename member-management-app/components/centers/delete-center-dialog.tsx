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
import { useCenters, type Center } from "@/contexts/centers-context"

interface DeleteCenterDialogProps {
  isOpen: boolean
  onClose: () => void
  center: Center | null
}

export function DeleteCenterDialog({ isOpen, onClose, center }: DeleteCenterDialogProps) {
  const { deleteCenter } = useCenters()

  const handleDelete = () => {
    if (center) {
      deleteCenter(center.id)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Centro</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o centro "{center?.name}"? Esta ação não pode ser desfeita e todos os dados
            relacionados serão perdidos.
            {center?.members && center.members > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Atenção: Este centro possui {center.members} membros cadastrados.
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
