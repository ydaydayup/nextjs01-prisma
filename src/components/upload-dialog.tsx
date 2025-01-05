import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fileCount: number
}

export function UploadDialog({ isOpen, onClose, onConfirm, fileCount }: UploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            You have selected {fileCount} image{fileCount !== 1 ? 's' : ''} to upload. Do you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

