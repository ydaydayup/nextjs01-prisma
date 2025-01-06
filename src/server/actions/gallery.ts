import { db } from "@/server/db"
import { auth } from "@/server/auth"

export async function createGallery(name: string, description: string) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Not authenticated")
    }

    return db.gallery.create({
        data: {
            name,
            description,
            userId: session.user.id,
        },
    })
}

export async function updateGallery(id: string, name: string, description: string) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Not authenticated")
    }

    return db.gallery.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: {
            name,
            description,
        },
    })
}

export async function deleteGallery(id: string) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Not authenticated")
    }

    return db.gallery.delete({
        where: {
            id,
            userId: session.user.id,
        },
    })
}

export async function getGalleries() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Not authenticated")
    }

    return db.gallery.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}