import { Router } from 'express'
import { boothZoneController } from '../controllers/boothZone.controller'

const router = Router()

// GET /api/booth-zones - 전체 조회
router.get('/', boothZoneController.getAll)

// POST /api/booth-zones - 생성
router.post('/', boothZoneController.create)

// DELETE /api/booth-zones/:id - 삭제
router.delete('/:id', boothZoneController.delete)

export default router
