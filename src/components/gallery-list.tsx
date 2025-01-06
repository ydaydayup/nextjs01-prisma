'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Gallery } from '@/types/gallery'
import { addGallery, updateGallery, deleteGallery } from '@/lib/db'

interface GalleryListProps {
  initialGalleries: Gallery[]
}

export default function GalleryList({ initialGalleries }: GalleryListProps) {
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries)
  const [newGallery, setNewGallery] = useState({ name: '', description: '' })
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null)

  const handleAddGallery = async () => {
    if (newGallery.name && newGallery.description) {
      const addedGallery = await addGallery(newGallery)
      setGalleries([...galleries, addedGallery])
      setNewGallery({ name: '', description: '' })
    }
  }

  const handleUpdateGallery = async () => {
    if (editingGallery) {
      const updatedGallery = await updateGallery(editingGallery)
      setGalleries(galleries.map(g => g.id === updatedGallery.id ? updatedGallery : g))
      setEditingGallery(null)
    }
  }

  const handleDeleteGallery = async (id: string) => {
    await deleteGallery(id)
    setGalleries(galleries.filter(g => g.id !== id))
  }

  return (
    <>
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Add New Gallery</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Gallery Name"
            value={newGallery.name}
            onChange={(e) => setNewGallery({ ...newGallery, name: e.target.value })}
            className="flex-grow"
          />
          <Input
            placeholder="Description"
            value={newGallery.description}
            onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
            className="flex-grow"
          />
          <Button onClick={handleAddGallery} className="bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Gallery
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Card key={gallery.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <CardTitle>{gallery.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{gallery.description}</p>
              <div className="flex justify-between">
                <Link href={`/gallery/${gallery.id}`} passHref>
                  <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-100">View Gallery</Button>
                </Link>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingGallery(gallery)}
                    className="text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteGallery(gallery.id)}
                    className="text-red-600 border-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90%]">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <CardTitle>Edit Gallery</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Input
                className="mb-4"
                placeholder="Gallery Name"
                value={editingGallery.name}
                onChange={(e) => setEditingGallery({ ...editingGallery, name: e.target.value })}
              />
              <Input
                className="mb-4"
                placeholder="Description"
                value={editingGallery.description}
                onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingGallery(null)}>Cancel</Button>
                <Button onClick={handleUpdateGallery} className="bg-purple-600 hover:bg-purple-700 text-white">Update</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

