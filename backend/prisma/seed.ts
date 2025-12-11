import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.foodTruck.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  console.log('Creating users...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pknu.ac.kr',
      password: hashedPassword,
      name: '관리자',
      phone: '010-1111-1111',
      role: 'ADMIN',
      isStudentVerified: true,
      studentEmail: 'admin@pknu.ac.kr',
      verified: true,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@pknu.ac.kr',
      password: hashedPassword,
      name: '김학생',
      phone: '010-2222-2222',
      role: 'USER',
      isStudentVerified: true,
      studentEmail: 'student1@pknu.ac.kr',
      verified: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@pknu.ac.kr',
      password: hashedPassword,
      name: '이학생',
      phone: '010-3333-3333',
      role: 'USER',
      isStudentVerified: true,
      studentEmail: 'student2@pknu.ac.kr',
      verified: true,
    },
  });

  const vendor1 = await prisma.user.create({
    data: {
      email: 'vendor1@example.com',
      password: hashedPassword,
      name: '박사장',
      phone: '010-4444-4444',
      role: 'VENDOR',
      verified: true,
    },
  });

  const vendor2 = await prisma.user.create({
    data: {
      email: 'vendor2@example.com',
      password: hashedPassword,
      name: '최사장',
      phone: '010-5555-5555',
      role: 'VENDOR',
      verified: true,
    },
  });

  console.log('Created users:', {
    admin: admin.email,
    student1: student1.email,
    student2: student2.email,
    vendor1: vendor1.email,
    vendor2: vendor2.email,
  });

  // Create Events
  console.log('Creating events...');
  const event1 = await prisma.event.create({
    data: {
      title: '캠퍼스 보물찾기',
      description: '캠퍼스 곳곳에 숨겨진 보물을 찾아보세요! 선착순 50명에게 푸짐한 상품을 드립니다.',
      category: '게임',
      location: '대학 본관 앞',
      latitude: 35.1335,
      longitude: 129.1025,
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      ],
      isStudentOnly: true,
      capacity: 50,
      status: 'PUBLISHED',
      organizer: '학생회',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: '떡볶이 빨리먹기 대회',
      description: '매운 떡볶이를 가장 빨리 먹는 사람이 우승! 우승자에게는 10만원 상당의 상품권을 드립니다.',
      category: '먹거리',
      location: '학생 식당 앞 광장',
      latitude: 35.1340,
      longitude: 129.1030,
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      ],
      isStudentOnly: true,
      capacity: 20,
      status: 'PUBLISHED',
      organizer: '동아리연합회',
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: '캘리그라피 체험',
      description: '나만의 손글씨로 멋진 작품을 만들어보세요. 초보자도 쉽게 따라할 수 있습니다.',
      category: '체험',
      location: '문화관 2층',
      latitude: 35.1345,
      longitude: 129.1020,
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      images: [],
      isStudentOnly: false,
      capacity: null,
      status: 'PUBLISHED',
      organizer: '미술동아리',
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: '밴드 공연',
      description: '학생 밴드의 열정적인 공연을 감상하세요!',
      category: '공연',
      location: '야외 공연장',
      latitude: 35.1350,
      longitude: 129.1015,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop',
      ],
      isStudentOnly: false,
      capacity: null,
      status: 'ONGOING',
      organizer: '음악동아리',
    },
  });

  console.log('Created events:', {
    event1: event1.title,
    event2: event2.title,
    event3: event3.title,
    event4: event4.title,
  });

  // Create TimeSlots for events with capacity
  console.log('Creating time slots...');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeSlot1 = await prisma.timeSlot.create({
    data: {
      eventId: event1.id,
      startTime: new Date(today.getTime() + 2 * 60 * 60 * 1000), // 2시간 후
      endTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 4시간 후
      capacity: 25,
      reserved: 5,
    },
  });

  const timeSlot2 = await prisma.timeSlot.create({
    data: {
      eventId: event1.id,
      startTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 4시간 후
      endTime: new Date(today.getTime() + 6 * 60 * 60 * 1000), // 6시간 후
      capacity: 25,
      reserved: 10,
    },
  });

  const timeSlot3 = await prisma.timeSlot.create({
    data: {
      eventId: event2.id,
      startTime: new Date(today.getTime() + 3 * 60 * 60 * 1000), // 3시간 후
      endTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 4시간 후
      capacity: 20,
      reserved: 8,
    },
  });

  console.log('Created time slots');

  // Create Reservations
  console.log('Creating reservations...');
  const reservation1 = await prisma.reservation.create({
    data: {
      userId: student1.id,
      eventId: event1.id,
      timeSlotId: timeSlot1.id,
      partySize: 1,
      status: 'CONFIRMED',
      qrCode: `QR-${Date.now()}-1`,
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      userId: student2.id,
      eventId: event2.id,
      timeSlotId: timeSlot3.id,
      partySize: 1,
      status: 'CHECKED_IN',
      qrCode: `QR-${Date.now()}-2`,
      checkedInAt: new Date(),
    },
  });

  const reservation3 = await prisma.reservation.create({
    data: {
      userId: student1.id,
      eventId: event3.id,
      timeSlotId: null,
      partySize: null,
      status: 'CONFIRMED',
      qrCode: `QR-${Date.now()}-3`,
    },
  });

  console.log('Created reservations');

  // Create Food Trucks
  console.log('Creating food trucks...');
  const foodTruck1 = await prisma.foodTruck.create({
    data: {
      name: '맛있는 타코',
      description: '신선한 재료로 만든 정통 멕시칸 타코를 맛보세요!',
      location: '정문 앞 광장',
      latitude: 35.1338,
      longitude: 129.1022,
      ownerId: vendor1.id,
      imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400&h=300&fit=crop',
    },
  });

  const foodTruck2 = await prisma.foodTruck.create({
    data: {
      name: '통닭의 신',
      description: '바삭바삭한 치킨과 다양한 소스를 즐겨보세요!',
      location: '학생회관 뒤편',
      latitude: 35.1342,
      longitude: 129.1028,
      ownerId: vendor2.id,
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    },
  });

  console.log('Created food trucks:', {
    foodTruck1: foodTruck1.name,
    foodTruck2: foodTruck2.name,
  });

  // Create Menu Items
  console.log('Creating menu items...');
  await prisma.menuItem.createMany({
    data: [
      {
        foodTruckId: foodTruck1.id,
        name: '비프 타코',
        description: '육즙 가득한 소고기 타코',
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop',
        available: true,
      },
      {
        foodTruckId: foodTruck1.id,
        name: '치킨 타코',
        description: '부드러운 닭고기 타코',
        price: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop',
        available: true,
      },
      {
        foodTruckId: foodTruck1.id,
        name: '나초',
        description: '치즈 듬뿍 나초',
        price: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop',
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '후라이드 치킨',
        description: '바삭한 후라이드 치킨',
        price: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=200&fit=crop',
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '양념 치킨',
        description: '달콤 매콤한 양념 치킨',
        price: 19000,
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&h=200&fit=crop',
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '감자튀김',
        description: '바삭한 감자튀김',
        price: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
        available: true,
      },
    ],
  });

  console.log('Created menu items');

  // Create Orders
  console.log('Creating orders...');
  const menuItems = await prisma.menuItem.findMany();

  const order1 = await prisma.order.create({
    data: {
      userId: student1.id,
      foodTruckId: foodTruck1.id,
      status: 'READY',
      totalPrice: 15000,
      pickupNumber: 'A001',
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        menuItemId: menuItems[0].id, // 비프 타코
        quantity: 2,
        price: 5000,
      },
      {
        orderId: order1.id,
        menuItemId: menuItems[1].id, // 치킨 타코
        quantity: 1,
        price: 4500,
      },
    ],
  });

  const order2 = await prisma.order.create({
    data: {
      userId: student2.id,
      foodTruckId: foodTruck2.id,
      status: 'PREPARING',
      totalPrice: 22000,
      pickupNumber: 'B001',
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order2.id,
        menuItemId: menuItems[3].id, // 후라이드 치킨
        quantity: 1,
        price: 18000,
      },
      {
        orderId: order2.id,
        menuItemId: menuItems[5].id, // 감자튀김
        quantity: 1,
        price: 3000,
      },
    ],
  });

  console.log('Created orders');

  console.log('Seeding completed successfully!');

  // Print summary
  console.log('\n=== Seed Data Summary ===');
  console.log(`Users: ${await prisma.user.count()}`);
  console.log(`Events: ${await prisma.event.count()}`);
  console.log(`Time Slots: ${await prisma.timeSlot.count()}`);
  console.log(`Reservations: ${await prisma.reservation.count()}`);
  console.log(`Food Trucks: ${await prisma.foodTruck.count()}`);
  console.log(`Menu Items: ${await prisma.menuItem.count()}`);
  console.log(`Orders: ${await prisma.order.count()}`);
  console.log(`Order Items: ${await prisma.orderItem.count()}`);
  console.log('\n=== Test Accounts ===');
  console.log('Admin: admin@pknu.ac.kr / password123');
  console.log('Student 1: student1@pknu.ac.kr / password123');
  console.log('Student 2: student2@pknu.ac.kr / password123');
  console.log('Vendor 1: vendor1@example.com / password123');
  console.log('Vendor 2: vendor2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
