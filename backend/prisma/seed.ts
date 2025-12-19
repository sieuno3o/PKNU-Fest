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
  await prisma.boothZone.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  console.log('Creating admin user...');
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

  // Create Vendor Users
  console.log('Creating vendor users...');
  const vendor1 = await prisma.user.create({
    data: {
      email: 'vendor1@example.com',
      password: hashedPassword,
      name: '푸드트럭 운영자1',
      phone: '010-4444-4444',
      role: 'VENDOR',
      verified: true,
    },
  });

  console.log('Seeding completed successfully!');

  // Print summary
  console.log('\n=== Seed Data Summary ===');
  console.log(`Users: ${await prisma.user.count()}`);
  console.log(`Events: ${await prisma.event.count()}`);
  console.log(`Booth Zones: ${await prisma.boothZone.count()}`);
  console.log(`Food Trucks: ${await prisma.foodTruck.count()}`);
  console.log('\n=== Test Accounts ===');
  console.log('Admin: admin@pknu.ac.kr / password123');
  console.log('Vendor: vendor1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
