import { Request, Response } from 'express'
import { boothZoneService } from '../services/boothZone.service'

export const boothZoneController = {
    // 모든 부스 구역 조회
    async getAll(req: Request, res: Response) {
        try {
            const zones = await boothZoneService.getAll()

            // 프론트엔드 형식에 맞게 변환
            const formattedZones = zones.map(zone => ({
                id: zone.id,
                name: zone.name,
                color: zone.color,
                icon: zone.icon,
                bounds: zone.bounds,
                center: { lat: zone.centerLat, lng: zone.centerLng },
            }))

            res.json({ success: true, data: formattedZones })
        } catch (error) {
            console.error('Get booth zones error:', error)
            res.status(500).json({ success: false, error: 'Failed to get booth zones' })
        }
    },

    // 부스 구역 생성
    async create(req: Request, res: Response) {
        try {
            const { name, color, icon, bounds, center } = req.body

            console.log('Create booth zone request:', { name, color, icon, bounds, center })

            if (!name || !color || !icon || !bounds || !center) {
                console.log('Missing fields:', {
                    hasName: !!name,
                    hasColor: !!color,
                    hasIcon: !!icon,
                    hasBounds: !!bounds,
                    hasCenter: !!center
                })
                return res.status(400).json({ success: false, error: 'Missing required fields' })
            }

            const zone = await boothZoneService.create({
                name,
                color,
                icon,
                bounds,
                center,
            })

            res.status(201).json({
                success: true,
                data: {
                    id: zone.id,
                    name: zone.name,
                    color: zone.color,
                    icon: zone.icon,
                    bounds: zone.bounds,
                    center: { lat: zone.centerLat, lng: zone.centerLng },
                },
            })
        } catch (error) {
            console.error('Create booth zone error:', error)
            res.status(500).json({ success: false, error: 'Failed to create booth zone' })
        }
    },

    // 부스 구역 삭제
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            await boothZoneService.delete(id)
            res.json({ success: true, message: 'Booth zone deleted' })
        } catch (error) {
            console.error('Delete booth zone error:', error)
            res.status(500).json({ success: false, error: 'Failed to delete booth zone' })
        }
    },
}
