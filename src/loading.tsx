import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-800 drop-shadow-md">Image Gallery Collections</h1>
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Add New Gallery</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </main>
  )
}

