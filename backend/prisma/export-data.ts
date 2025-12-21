import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportData() {
    console.log('Exporting current database data...\n');

    const users = await prisma.user.findMany();
    const foodTrucks = await prisma.foodTruck.findMany({ include: { menu: true } });
    const events = await prisma.event.findMany();
    const boothZones = await prisma.boothZone.findMany();

    console.log('=== USERS ===');
    console.log(JSON.stringify(users, null, 2));

    console.log('\n=== FOOD TRUCKS (with menu) ===');
    console.log(JSON.stringify(foodTrucks, null, 2));

    console.log('\n=== EVENTS ===');
    console.log(JSON.stringify(events, null, 2));

    console.log('\n=== BOOTH ZONES ===');
    console.log(JSON.stringify(boothZones, null, 2));
}

exportData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
