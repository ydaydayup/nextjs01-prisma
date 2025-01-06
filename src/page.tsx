import GalleryList from '@/components/gallery-list'
import { getGalleries } from '@/lib/db'

export default async function Home() {
  const galleries = await getGalleries()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-800 drop-shadow-md">Image Gallery Collections</h1>
      <GalleryList initialGalleries={galleries} />
    </main>
  )
}

