import prisma from '../utils/prisma'
import { NotFoundError, ForbiddenError } from '../utils/error.util'
import { CreateFoodTruckInput, CreateMenuItemInput } from '../utils/validation.schemas'

export class FoodTrucksService {
  async createFoodTruck(ownerId: string, data: CreateFoodTruckInput) {
    const foodTruck = await prisma.foodTruck.create({
      data: {
        ...data,
        ownerId,
      },
    })

    return foodTruck
  }

  async getFoodTrucks() {
    const foodTrucks = await prisma.foodTruck.findMany({
      include: {
        menu: {
          where: { available: true },
          take: 5,
        },
        _count: {
          select: { orders: true },
        },
      },
    })

    return foodTrucks
  }

  async getFoodTruck(id: string) {
    const foodTruck = await prisma.foodTruck.findUnique({
      where: { id },
      include: {
        menu: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    return foodTruck
  }

  async updateFoodTruck(id: string, userId: string, data: Partial<CreateFoodTruckInput>) {
    const foodTruck = await prisma.foodTruck.findUnique({ where: { id } })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    if (foodTruck.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to update this food truck')
    }

    const updated = await prisma.foodTruck.update({
      where: { id },
      data,
    })

    return updated
  }

  async deleteFoodTruck(id: string) {
    await prisma.foodTruck.delete({ where: { id } })
    return { message: 'Food truck deleted successfully' }
  }

  async getFoodTruckLocations() {
    const foodTrucks = await prisma.foodTruck.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        latitude: true,
        longitude: true,
      },
    })

    return foodTrucks
  }

  // Menu management
  async createMenuItem(foodTruckId: string, userId: string, data: CreateMenuItemInput) {
    const foodTruck = await prisma.foodTruck.findUnique({ where: { id: foodTruckId } })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    if (foodTruck.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to add menu items')
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        ...data,
        foodTruckId,
      },
    })

    return menuItem
  }

  async getMenu(foodTruckId: string) {
    const menu = await prisma.menuItem.findMany({
      where: { foodTruckId },
      orderBy: { createdAt: 'desc' },
    })

    return menu
  }

  async updateMenuItem(id: string, userId: string, data: Partial<CreateMenuItemInput>) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { foodTruck: true },
    })

    if (!menuItem) {
      throw new NotFoundError('Menu item not found')
    }

    if (menuItem.foodTruck.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to update this menu item')
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data,
    })

    return updated
  }

  async deleteMenuItem(id: string, userId: string) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { foodTruck: true },
    })

    if (!menuItem) {
      throw new NotFoundError('Menu item not found')
    }

    if (menuItem.foodTruck.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this menu item')
    }

    await prisma.menuItem.delete({ where: { id } })
    return { message: 'Menu item deleted successfully' }
  }
}
