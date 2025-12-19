import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateBoothZoneInput {
    name: string
    color: string
    icon: string
    bounds: { lat: number; lng: number }[]
    center: { lat: number; lng: number }
}

export const boothZoneService = {
    // 모든 부스 구역 조회
    async getAll() {
        return await prisma.boothZone.findMany({
            orderBy: { createdAt: 'asc' },
        })
    },

    // 부스 구역 생성
    async create(data: CreateBoothZoneInput) {
        return await prisma.boothZone.create({
            data: {
                name: data.name,
                color: data.color,
                icon: data.icon,
                bounds: data.bounds,
                centerLat: data.center.lat,
                centerLng: data.center.lng,
            },
        })
    },

    // 부스 구역 삭제
    async delete(id: string) {
        return await prisma.boothZone.delete({
            where: { id },
        })
    },

    // 전체 삭제
    async deleteAll() {
        return await prisma.boothZone.deleteMany()
    },
}
