import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Checkbox } from "@/components/ui/checkbox"

interface Image {
  id: number
  src: string
  alt: string
  tags: string[]
}

interface ImageGridProps {
  images: Image[]
  onImageSelect: (id: number) => void
  selectedImages: number[]
}

export function ImageGrid({ images, onImageSelect, selectedImages }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onCheckedChange={() => onImageSelect(image.id)}
                  className="bg-white bg-opacity-75 rounded"
                />
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex flex-wrap gap-2 mt-2">
                {image.tags.map((tag) => (
                  <Tag key={tag} variant="secondary" className="bg-purple-100 text-purple-600">{tag}</Tag>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

