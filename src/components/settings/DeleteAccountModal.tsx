import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  labels: {
    title: string
    body: string
    placeholder: string
    confirmButton: string
    cancelButton: string
  }
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  labels,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const isConfirmed = confirmText === 'DELETE'

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
      setConfirmText('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">{labels.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {labels.body}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            type="text"
            placeholder={labels.placeholder}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="font-mono"
            autoComplete="off"
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            {labels.cancelButton}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="w-full sm:w-auto"
          >
            {labels.confirmButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
