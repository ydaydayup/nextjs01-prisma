'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Image {
  id: string
  src: string
  alt: string | null
  tags: string[]
}

interface ImageGridProps {
  images: Image[]
  onImageSelect: (id: string) => void
  selectedImages: string[]
}

export function ImageGrid({ images, onImageSelect, selectedImages }: ImageGridProps) {
  const [isLoading, setIsLoading] = useState(true)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div 
          key={image.id}
          className={`relative aspect-video cursor-pointer group ${
            selectedImages.includes(image.id) ? 'ring-2 ring-purple-600' : ''
          }`}
          onClick={() => onImageSelect(image.id)}
        >
          <Image
            src={image.src}
            alt={image.alt || ''}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Optional overlay for selected state */}
          {selectedImages.includes(image.id) && (
            <div className="absolute inset-0 bg-purple-600 bg-opacity-20" />
          )}
          {/* Optional tags display */}
          {image.tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
              {image.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

