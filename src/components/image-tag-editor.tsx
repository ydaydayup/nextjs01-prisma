import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface ImageTagEditorProps {
  isOpen: boolean
  onClose: () => void
  tags: string[]
  onUpdateTags: (imageIds: number[], tagsToAdd: string[], tagsToRemove: string[]) => void
  selectedImages: number[]
}

export function ImageTagEditor({ isOpen, onClose, tags, onUpdateTags, selectedImages }: ImageTagEditorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }

  const handleUpdateTags = () => {
    onUpdateTags(selectedImages, selectedTags, tags.filter(tag => !selectedTags.includes(tag)))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tags for Selected Images</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox 
                id={tag} 
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateTags}>Update Tags</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

