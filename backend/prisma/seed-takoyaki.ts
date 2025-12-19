import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Takoyaki Example ---');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Takoyaki Vendor User
    const vendorEmail = 'takoyaki@example.com';
    let vendor = await prisma.user.findUnique({ where: { email: vendorEmail } });

    if (!vendor) {
        console.log('Creating Takoyaki vendor user...');
        vendor = await prisma.user.create({
            data: {
                email: vendorEmail,
                password: hashedPassword,
                name: '타코킹 (타코야끼 운영자)',
                phone: '010-5555-5555',
                role: 'VENDOR',
                verified: true,
            },
        });
    } else {
        console.log('Takoyaki vendor user already exists.');
    }

    // 2. Create Takoyaki Food Truck
    let foodTruck = await prisma.foodTruck.findFirst({
        where: { ownerId: vendor.id },
    });

    if (!foodTruck) {
        console.log('Creating Takoyaki food truck...');
        foodTruck = await prisma.foodTruck.create({
            data: {
                name: '타코킹 타코야끼',
                description: '겉바속촉 정통 오사카식 타코야끼 전문점입니다!',
                location: '공연장 입구 (대운동장 남측)',
                latitude: 35.1328,
                longitude: 129.1032,
                ownerId: vendor.id,
                imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000&auto=format&fit=crop',
            },
        });
    } else {
        console.log('Takoyaki food truck already exists.');
    }

    // 3. Create Menu Items
    const menuItems = [
        { name: '오리지널 타코야끼 (8알)', price: 5000, description: '가장 기본적인 고소한 타코야끼' },
        { name: '네기 타코야끼 (8알)', price: 6000, description: '아삭아삭한 파가 듬뿍 올라간 타코야끼' },
        { name: '명란 마요 타코야끼 (8알)', price: 6500, description: '짭조름한 명란과 마요네즈의 환상 궁합' },
        { name: '콜라 (500ml)', price: 2000, description: '시원한 제로 콜라' },
    ];

    console.log('Checking menu items...');
    for (const item of menuItems) {
        const existingItem = await prisma.menuItem.findFirst({
            where: { foodTruckId: foodTruck.id, name: item.name },
        });

        if (!existingItem) {
            console.log(`Adding menu item: ${item.name}`);
            await prisma.menuItem.create({
                data: {
                    ...item,
                    foodTruckId: foodTruck.id,
                    available: true,
                },
            });
        }
    }

    console.log('\n--- Takoyaki Seeding Completed ---');
    console.log('Login: takoyaki@example.com / password123');
}

main()
    .catch((e) => {
        console.error('Error seeding Takoyaki:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
