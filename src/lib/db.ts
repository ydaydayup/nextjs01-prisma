import { Gallery } from '@/types/gallery'

// Simulate database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getGalleries(): Promise<Gallery[]> {
  // Simulate fetching data from a database
  await delay(1000)

  return [
    { id: '1', name: 'Nature', description: 'Beautiful landscapes and wildlife' },
    { id: '2', name: 'Architecture', description: 'Stunning buildings and structures' },
    { id: '3', name: 'Food', description: 'Delicious cuisines from around the world' },
  ]
}

export async function addGallery(gallery: Omit<Gallery, 'id'>): Promise<Gallery> {
  await delay(500)

  const newGallery: Gallery = {
    ...gallery,
    id: Date.now().toString(),
  }

  return newGallery
}

export async function updateGallery(gallery: Gallery): Promise<Gallery> {
  await delay(500)

  return gallery
}

export async function deleteGallery(id: string): Promise<void> {
  await delay(500)
}

