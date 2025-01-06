import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fileCount: number
  isUploading: boolean
  uploadProgress: Record<string, number>
  files: File[]
}

export function UploadDialog({
  isOpen,
  onClose,
  onConfirm,
  fileCount,
  isUploading,
  uploadProgress,
  files
}: UploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {fileCount} files?</DialogTitle>
          <DialogDescription>
            Are you sure you want to upload these files to your gallery?
          </DialogDescription>
        </DialogHeader>
        
        {/* File list with progress */}
        <div className="max-h-[200px] overflow-y-auto">
          {files.map((file) => (
            <div key={file.name} className="py-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{file.name}</span>
                <span className="text-sm">{uploadProgress[file.name] || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[file.name] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

