import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"

interface TagManagerProps {
  isOpen: boolean
  onClose: () => void
  tags: string[]
  onAddTag: (tag: string) => void
  onUpdateTags: (tags: string[]) => void
}

export function TagManager({ isOpen, onClose, tags, onAddTag, onUpdateTags }: TagManagerProps) {
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onAddTag(newTag)
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag"
          />
          <Button onClick={handleAddTag}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Tag key={tag} variant="secondary" className="flex items-center gap-2">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="text-red-500">&times;</button>
            </Tag>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

