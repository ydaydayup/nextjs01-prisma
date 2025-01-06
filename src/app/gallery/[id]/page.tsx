'use client'

import {useState, useCallback, useEffect} from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Tag } from "@/components/ui/tag"
import { ImageGrid } from "@/components/image-grid"
import { UploadDialog } from "@/components/upload-dialog"
import { TagManager } from "@/components/tag-manager"
import { ImageTagEditor } from "@/components/image-tag-editor"
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { supabase } from "@/server/db"
import { toast } from "sonner"

interface Image {
  id: string
  src: string
  alt: string | null
  tags: string[]
}

// Add file validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp']
};
// const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// const ACCEPTED_FILE_TYPES = Object.keys(ACCEPTED_MIME_TYPES);
const ACCEPTED_FILE_TYPES = Object.keys(ACCEPTED_MIME_TYPES);

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
  const [images, setImages] = useState<Image[]>([])  // 初始化为空数组
  const [isLoading, setIsLoading] = useState(true)  // 添加加载状态
  const [tags, setTags] = useState<string[]>(initialTags)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [isImageTagEditorOpen, setIsImageTagEditorOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // 添加获取图片的函数
  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    try {
      // 从数据库获取图片记录
      const { data: imageRecords, error } = await supabase
        .from('images')
        .select('*')
        .eq('gallery_id', galleryId)

      if (error) {
        throw error
      }

      if (imageRecords) {
        const formattedImages: Image[] = imageRecords.map(record => ({
          id: record.id,
          src: record.public_url,
          alt: record.alt_text,
          tags: record.tags || []
        }))
        setImages(formattedImages)
      }

    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load gallery images')
    } finally {
      setIsLoading(false)
    }
  }, [galleryId])

  // 组件加载时获取图片
  useEffect(() => {
    fetchImages()
  }, [fetchImages])

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
    // Validate files before setting them
    const validFiles = acceptedFiles.filter(file => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported image type`)
        return false
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setDroppedFiles(validFiles)
      setIsDialogOpen(true)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE
  })

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      const uploadedImages: Image[] = [];

      for (const file of droppedFiles) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${galleryId}/${fileName}`;

        // Upload file to Supabase Storage with progress tracking
        const { error: uploadError, data } = await supabase.storage
          .from('gallery')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: Math.round((progress.loaded / progress.total) * 100)
              }))
            }
          });

        if (uploadError) {
          toast.error(`Error uploading ${file.name}: ${uploadError.message}`)
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // Create new image record
        const newImage = {
          id: crypto.randomUUID(),
          src: publicUrl,
          alt: file.name,
          tags: []
        };

        // Add to database
        const { error: dbError } = await supabase
          .from('images')
          .insert({
            gallery_id: galleryId,
            storage_path: filePath,
            public_url: publicUrl,
            alt_text: file.name,
            tags: []
          });

        if (dbError) {
          toast.error(`Error saving ${file.name} to database: ${dbError.message}`)
          continue;
        }

        uploadedImages.push(newImage);
        toast.success(`Successfully uploaded ${file.name}`)
      }

      setImages(prev => [...prev, ...uploadedImages]);
      setIsDialogOpen(false);
      setDroppedFiles([]);

    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('An unexpected error occurred during upload')
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  };

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
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <ImageGrid 
          images={filteredImages} 
          onImageSelect={handleImageSelect}
          selectedImages={selectedImages}
        />
      )}
      <UploadDialog 
        isOpen={isDialogOpen} 
        onClose={() => {
          if (!isUploading) {
            setIsDialogOpen(false)
            setDroppedFiles([])
            setUploadProgress({})
          }
        }}
        onConfirm={handleUpload}
        fileCount={droppedFiles.length}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        files={droppedFiles}
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

