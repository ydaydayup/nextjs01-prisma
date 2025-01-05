'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Tag } from "@/components/ui/tag"
import { ImageGrid } from "@/components/image-grid"
import { UploadDialog } from "@/components/upload-dialog"
import { TagManager } from "@/components/tag-manager"
import { ImageTagEditor } from "@/components/image-tag-editor"
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"

interface Image {
  id: number
  src: string
  alt: string
  tags: string[]
}

const initialTags = ["Nature", "Architecture", "Travel", "Food", "Art", "Technology"]

const initialImages: Image[] = [
  { id: 1, src: "/placeholder.svg?height=200&width=300", alt: "Nature image", tags: ["Nature"] },
  { id: 2, src: "/placeholder.svg?height=200&width=300", alt: "Architecture image", tags: ["Architecture"] },
  { id: 3, src: "/placeholder.svg?height=200&width=300", alt: "Travel image", tags: ["Travel", "Nature"] },
  { id: 4, src: "/placeholder.svg?height=200&width=300", alt: "Food image", tags: ["Food"] },
  { id: 5, src: "/placeholder.svg?height=200&width=300", alt: "Art image", tags: ["Art", "Nature"] },
  { id: 6, src: "/placeholder.svg?height=200&width=300", alt: "Technology image", tags: ["Technology"] },
]

export default function GalleryPage() {
  const params = useParams()
  const galleryId = params.id as string

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [images, setImages] = useState<Image[]>(initialImages)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [isImageTagEditorOpen, setIsImageTagEditorOpen] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }

  const filteredImages = selectedTags.length === 0
    ? images
    : images.filter(image => 
        selectedTags.some(tag => image.tags.includes(tag))
      )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDroppedFiles(acceptedFiles)
    setIsDialogOpen(true)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async () => {
    const newImages = droppedFiles.map((file, index) => ({
      id: images.length + index + 1,
      src: URL.createObjectURL(file),
      alt: file.name,
      tags: []
    }))
    setImages(prev => [...prev, ...newImages])
    setIsDialogOpen(false)
    setDroppedFiles([])
  }

  const handleImageSelect = (id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id) 
        : [...prev, id]
    )
  }

  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      setTags(prev => [...prev, newTag])
    }
  }

  const handleUpdateImageTags = (imageIds: number[], tagsToAdd: string[], tagsToRemove: string[]) => {
    setImages(prev => prev.map(image => {
      if (imageIds.includes(image.id)) {
        const updatedTags = [...new Set([...image.tags, ...tagsToAdd])].filter(tag => !tagsToRemove.includes(tag))
        return { ...image, tags: updatedTags }
      }
      return image
    }))
    setSelectedImages([])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-purple-800 drop-shadow-md">Gallery {galleryId}</h1>
        <Link href="/" passHref>
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-100">Back to Galleries</Button>
        </Link>
      </div>
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-purple-300 rounded-lg p-8 mb-8 text-center text-purple-500 cursor-pointer bg-white shadow-inner hover:bg-purple-50 transition-colors duration-300"
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}</p>
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tags</h2>
          <Button onClick={() => setIsTagManagerOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">Manage Tags</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag 
              key={tag} 
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                toggleTag(tag);
              }}
              className={`cursor-pointer ${
                selectedTags.includes(tag) 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'text-purple-600 border-purple-600 hover:bg-purple-100'
              }`}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Images</h2>
        {selectedImages.length > 0 && (
          <Button onClick={() => setIsImageTagEditorOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">Edit Tags for Selected Images</Button>
        )}
      </div>
      <ImageGrid 
        images={filteredImages} 
        onImageSelect={handleImageSelect}
        selectedImages={selectedImages}
      />
      <UploadDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleUpload}
        fileCount={droppedFiles.length}
      />
      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={tags}
        onAddTag={handleAddTag}
        onUpdateTags={setTags}
      />
      <ImageTagEditor
        isOpen={isImageTagEditorOpen}
        onClose={() => setIsImageTagEditorOpen(false)}
        tags={tags}
        onUpdateTags={handleUpdateImageTags}
        selectedImages={selectedImages}
      />
    </main>
  )
}

