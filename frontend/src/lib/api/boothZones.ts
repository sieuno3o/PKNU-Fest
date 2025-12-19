import api from './client'

export interface BoothZone {
    id: string
    name: string
    color: string
    icon: string
    bounds: { lat: number; lng: number }[]
    center: { lat: number; lng: number }
}

export interface CreateBoothZoneRequest {
    name: string
    color: string
    icon: string
    bounds: { lat: number; lng: number }[]
    center: { lat: number; lng: number }
}

export const boothZoneApi = {
    // 전체 조회
    async getAll(): Promise<BoothZone[]> {
        const response = await api.get('/booth-zones')
        return response.data.data || response.data
    },

    // 생성
    async create(data: CreateBoothZoneRequest): Promise<BoothZone> {
        const response = await api.post('/booth-zones', data)
        return response.data.data || response.data
    },

    // 삭제
    async delete(id: string): Promise<void> {
        await api.delete(`/booth-zones/${id}`)
    },
}
