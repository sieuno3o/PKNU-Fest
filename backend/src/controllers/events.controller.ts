import { Request, Response, NextFunction } from 'express'
import { EventsService } from '../services/events.service'
import { ResponseUtil } from '../utils/response.util'

const eventsService = new EventsService()

export class EventsController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventsService.createEvent(req.body)
      return ResponseUtil.created(res, event, 'Event created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventsService.getEvents(req.query as any)
      return ResponseUtil.paginated(
        res,
        result.events,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      )
    } catch (error) {
      next(error)
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventsService.getEvent(req.params.id)
      return ResponseUtil.success(res, event)
    } catch (error) {
      next(error)
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventsService.updateEvent(req.params.id, req.body)
      return ResponseUtil.success(res, event, 'Event updated successfully')
    } catch (error) {
      next(error)
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventsService.deleteEvent(req.params.id)
      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }

  async getEventLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await eventsService.getEventLocations()
      return ResponseUtil.success(res, locations)
    } catch (error) {
      next(error)
    }
  }

  async createTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlot = await eventsService.createTimeSlot(req.params.id, req.body)
      return ResponseUtil.created(res, timeSlot, 'Time slot created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getTimeSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlots = await eventsService.getTimeSlots(req.params.id)
      return ResponseUtil.success(res, timeSlots)
    } catch (error) {
      next(error)
    }
  }
}
