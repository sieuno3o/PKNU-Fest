import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.foodTruck.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.boothZone.deleteMany();
  await prisma.user.deleteMany();

  // Hash password (password123)
  const hashedPassword = '$2b$10$H4A4sphWa.7YlpdJ8Iw60OIp98ce0ku13Te1SFpLqVdvJ9fb0RGqa';

  // ============================================
  // 1. Create Users
  // ============================================
  console.log('👤 Creating users...');

  // Admin
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

  // Vendor 1 - 타코비
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

  // Vendor 2 - 버거킹덤 (추가)
  const vendor2 = await prisma.user.create({
    data: {
      email: 'vendor2@example.com',
      password: hashedPassword,
      name: '푸드트럭 운영자2',
      phone: '010-5555-5555',
      role: 'VENDOR',
      verified: true,
    },
  });

  // Vendor 3 - 치킨스토리 (추가)
  const vendor3 = await prisma.user.create({
    data: {
      email: 'vendor3@example.com',
      password: hashedPassword,
      name: '푸드트럭 운영자3',
      phone: '010-6666-6666',
      role: 'VENDOR',
      verified: true,
    },
  });

  // Test User (테스트용 일반 사용자)
  const testUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: '테스트 사용자',
      phone: '010-7777-7777',
      role: 'USER',
      isStudentVerified: true,
      studentEmail: 'student@pukyong.ac.kr',
      studentId: '2024001234',
      department: '컴퓨터공학과',
      grade: 3,
      verified: true,
    },
  });

  // ============================================
  // 2. Create Food Trucks & Menus
  // ============================================
  console.log('🚚 Creating food trucks...');

  // Food Truck 1: 타코비 (기존 데이터)
  const foodTruck1 = await prisma.foodTruck.create({
    data: {
      name: '타코비',
      description: '타코야끼~~~~',
      location: '푸드트럭',
      latitude: 35.1341860820515,
      longitude: 129.1047141022075,
      ownerId: vendor1.id,
      imageUrl: 'https://takobi.co.kr/mobile/sub/img/logo.png',
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        foodTruckId: foodTruck1.id,
        name: '기본 타코야끼',
        description: '10알이 제공됩니다.',
        price: 5000,
        imageUrl: 'https://takobi.co.kr/sub/img/sub_02_01_tab_detail_box_photo_01.jpg',
        available: true,
      },
      {
        foodTruckId: foodTruck1.id,
        name: '치즈 타코야끼',
        description: '모짜렐라 치즈가 듬뿍! 10알',
        price: 6000,
        imageUrl: 'https://takobi.co.kr/sub/img/sub_02_01_tab_detail_box_photo_01.jpg',
        available: true,
      },
      {
        foodTruckId: foodTruck1.id,
        name: '매운 타코야끼',
        description: '청양고추 + 불닭소스 10알',
        price: 5500,
        imageUrl: 'https://takobi.co.kr/sub/img/sub_02_01_tab_detail_box_photo_01.jpg',
        available: true,
      },
    ],
  });

  // Food Truck 2: 버거킹덤 (추가)
  const foodTruck2 = await prisma.foodTruck.create({
    data: {
      name: '버거킹덤',
      description: '수제 버거의 진수! 100% 한우 패티로 만든 프리미엄 버거',
      location: '푸드트럭',
      latitude: 35.1342560820515,
      longitude: 129.1048141022075,
      ownerId: vendor2.id,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        foodTruckId: foodTruck2.id,
        name: '클래식 버거',
        description: '한우 패티 + 신선한 야채 + 특제 소스',
        price: 8000,
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '치즈 버거',
        description: '체다 치즈 2장 추가',
        price: 9000,
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '더블 버거',
        description: '패티 2장 + 베이컨',
        price: 12000,
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '감자튀김',
        description: '바삭한 감자튀김',
        price: 3000,
        available: true,
      },
      {
        foodTruckId: foodTruck2.id,
        name: '콜라',
        description: '시원한 콜라 500ml',
        price: 2000,
        available: true,
      },
    ],
  });

  // Food Truck 3: 치킨스토리 (추가)
  const foodTruck3 = await prisma.foodTruck.create({
    data: {
      name: '치킨스토리',
      description: '바삭바삭 닭강정과 치킨! 축제의 필수 간식',
      location: '푸드트럭',
      latitude: 35.1340860820515,
      longitude: 129.1049141022075,
      ownerId: vendor3.id,
      imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        foodTruckId: foodTruck3.id,
        name: '닭강정 (소)',
        description: '달콤한 닭강정 300g',
        price: 7000,
        available: true,
      },
      {
        foodTruckId: foodTruck3.id,
        name: '닭강정 (대)',
        description: '달콤한 닭강정 500g',
        price: 10000,
        available: true,
      },
      {
        foodTruckId: foodTruck3.id,
        name: '양념치킨',
        description: '매콤달콤 양념치킨',
        price: 15000,
        available: true,
      },
      {
        foodTruckId: foodTruck3.id,
        name: '후라이드치킨',
        description: '바삭한 후라이드',
        price: 15000,
        available: true,
      },
    ],
  });

  // ============================================
  // 3. Create Events (기존 데이터)
  // ============================================
  console.log('🎉 Creating events...');

  await prisma.event.createMany({
    data: [
      {
        title: '고분자화학소재공학부',
        description: '낮 부스:\n찜질방\n낮 부스 참여 방법:\n랜덤 도구로 쌀을 퍼서 10.1g 맞추기\n낮 부스 운영시간:\n날짜:  2025-05-28\n시간: 14:00 ~ 18:00\n낮 부스 경품:\n1등 신세계 상품권 100,000원\n2등 배달의 민족 상품권 50,000원\n3등 올리브영 상품권 30,000원',
        category: '게임',
        location: '잔디광장',
        latitude: 35.13469771858645,
        longitude: 129.1054787069478,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EA%B3%A0%EB%B6%84%EC%9E%90%ED%99%94%ED%95%99%EC%86%8C%EC%9E%AC%EA%B3%B5%ED%95%99%EB%B6%80.png',
        images: [],
        status: 'PUBLISHED',
      },
      {
        title: '건축공학과',
        description: '낮 부스:\n경상도 일짱을 가려라/키스타임(야구 컨셉)\n낮 부스 참여 방법:\n1. 펀치기계\n2. 매칭이벤트\n낮 부스 운영시간:\n날짜: 2025-05-28\n시간: 14:00 ~ 18:00\n낮 부스 경품:\n1등: 배달의민족 50,000원권(남자)\n1등: 배달의민족 50,000원권(여자)\n당첨: 신세계상품권 100,000원권',
        category: '게임',
        location: '잔디광장',
        latitude: 35.13468807906586,
        longitude: 129.1053852152895,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EA%B1%B4%EC%B6%95%EA%B3%B5%ED%95%99%EA%B3%BC.png',
        images: [],
        status: 'PUBLISHED',
      },
      {
        title: '공과대학',
        description: '1. 야구공 딱 대!\n\n야 : 야구 보러 갈래?\n구 : 구래~\n낮 부스 참여 방법:\n1) 야구공 딱 대!\n\n-9개의 칸에 한 글자씩 기입(ex: 공, 대, 인, 경)\n야구공 3개를 참여자에게 주고 9개의 칸 중에 공, 대를 두 개 다 맞추는 사람에게 1등 상품 지급',
        category: '게임',
        location: '잔디광장',
        latitude: 35.13467843947228,
        longitude: 129.1052917236496,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/03/%EB%8C%80%EC%A7%80-7.png',
        images: [],
        capacity: 50,
        reservationEnabled: true,
        reservationType: 'FIRST_COME',
        status: 'PUBLISHED',
      },
      {
        title: '기계공학과',
        description: '낮 부스:\n너 혹시 신병이니?\n낮 부스 참여 방법:\n1. 고무줄 총쏘기\n2. 수류탄 던지기\n3. 점수합산 후 상품 수령\n낮 부스 운영시간:\n날짜: 2025-05-29\n시간: 14:00 ~ 18:00\n낮 부스 경품:\n1등: 30만원 상당의 상품\n2등: 10만원 상당의 상품\n3등: 5만원 상당의 상품',
        category: '게임',
        location: '잔디광장',
        latitude: 35.13470275897477,
        longitude: 129.1055775650739,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EA%B8%B0%EA%B3%84%EA%B3%B5%ED%95%99%EB%B6%80.png',
        images: [],
        status: 'PUBLISHED',
      },
      {
        title: '나노융합반도체공학부',
        description: '낮 부스:\n나노오락실\n낮 부스 참여 방법:\n1. 참가비용 1000원을 지불한 뒤 피지컬, 뇌지컬 랜덤게임 중에 선택한다(학생회비 납부자 1회 무료)\n2. 게임통에 있는 종이를 한 장 꺼낸다\n3. 뇌지컬 게임은 10 문제 중 9문제를 맞추면 상품 피지컬 게임은 정해진 근사값을 맞추면 상품을 지급한다',
        category: '게임',
        location: '잔디광장',
        latitude: 35.13470794223003,
        longitude: 129.1056681995308,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EB%82%98%EB%85%B8%EC%9C%B5%ED%95%A9%EB%B0%98%EB%8F%84%EC%B2%B4.png',
        images: [],
        status: 'PUBLISHED',
      },
      {
        title: '부경네컷',
        description: '다시는 오지 않을 지금,\n우리의 청춘을 영원히 간직할 수 있도록\n단 5일, 청춘의 찬가가 울리는 이 순간을 사진으로 새겨보세요.',
        category: '포토',
        location: '대운동장',
        latitude: 35.13320593769997,
        longitude: 129.1061478266291,
        startTime: new Date('2025-12-19T05:16:00.000Z'),
        endTime: new Date('2025-12-19T08:16:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EC%B2%AD%EC%B6%98%EC%A1%B0%EA%B0%81.png',
        images: [],
        status: 'PUBLISHED',
      },
      {
        title: '부경싱어',
        description: '마침내 청춘의 계절이 우리 앞에 펼쳐졌습니다.\n국립부경대학교의 찬란한 축제, 대동제가 시작됩니다.\n이 순간, 오롯이 여러분의 청춘이 빛날 시간입니다.\n모창실력을 마음껏 펼쳐보세요',
        category: '공연',
        location: '잔디광장',
        latitude: 35.1347604020995,
        longitude: 129.1066678042462,
        startTime: new Date('2025-12-19T06:00:00.000Z'),
        endTime: new Date('2025-12-19T08:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EB%B6%80%EA%B2%BD%EC%8B%B1%EC%96%B4.png',
        images: [],
        capacity: 30,
        reservationEnabled: true,
        reservationType: 'FIRST_COME',
        status: 'PUBLISHED',
      },
      {
        title: '생태공학과',
        description: '낮 부스:\n응답하라 생태공학\n낮 부스 참여 방법:\n1. 소지품 매칭\n2. 컨텐츠 참여자들 옛날 간식 증정',
        category: '매칭',
        location: '잔디광장',
        latitude: 35.13471753387869,
        longitude: 129.1057644324598,
        startTime: new Date('2025-12-19T00:00:00.000Z'),
        endTime: new Date('2025-12-19T07:00:00.000Z'),
        thumbnail: 'https://pknufestival.kr/wp-content/uploads/2025/05/%EC%83%9D%ED%83%9C%EB%A1%9C%EA%B3%A0.png',
        images: [],
        status: 'PUBLISHED',
      },
    ],
  });

  // ============================================
  // 4. Create Booth Zones (기존 데이터)
  // ============================================
  console.log('📍 Creating booth zones...');

  await prisma.boothZone.createMany({
    data: [
      {
        name: '부스',
        color: '#A7F3D0',
        icon: '🎪',
        bounds: [
          { lat: 35.13471551768109, lng: 129.1052323445545 },
          { lat: 35.13425316706294, lng: 129.1052615745662 },
          { lat: 35.13431435205026, lng: 129.1062778529626 },
          { lat: 35.13479739860119, lng: 129.106224479839 },
        ],
        centerLat: 35.13452010884887,
        centerLng: 129.1057490629806,
      },
      {
        name: '행사',
        color: '#FDE68A',
        icon: '🎵',
        bounds: [
          { lat: 35.13435762385818, lng: 129.1068987594753 },
          { lat: 35.13484766457262, lng: 129.1068318579889 },
          { lat: 35.13480175937804, lng: 129.1062328195611 },
          { lat: 35.13431430438762, lng: 129.1062805941741 },
        ],
        centerLat: 35.13458033804911,
        centerLng: 129.1065610077999,
      },
      {
        name: '부스',
        color: '#A7F3D0',
        icon: '🎪',
        bounds: [
          { lat: 35.13331605291969, lng: 129.1057749538121 },
          { lat: 35.13337251680659, lng: 129.1065442824252 },
          { lat: 35.13343408028317, lng: 129.1065019901955 },
          { lat: 35.133475567474, lng: 129.1064482109661 },
          { lat: 35.1335150887455, lng: 129.1063779265539 },
          { lat: 35.13354119401176, lng: 129.1063018115889 },
          { lat: 35.13355608748238, lng: 129.1062226653044 },
          { lat: 35.13355521772758, lng: 129.1061431128885 },
          { lat: 35.13354543570514, lng: 129.1060578460512 },
          { lat: 35.13351548199005, lng: 129.1059665747753 },
          { lat: 35.1334738875691, lng: 129.1058969430018 },
          { lat: 35.13342304731736, lng: 129.1058407851891 },
          { lat: 35.13337412536552, lng: 129.1058038737164 },
        ],
        centerLat: 35.13346906026137,
        centerLng: 129.1061446904976,
      },
      {
        name: '행사',
        color: '#FDE68A',
        icon: '🎵',
        bounds: [
          { lat: 35.13331389633693, lng: 129.1057694134508 },
          { lat: 35.1333634616127, lng: 129.1065467915048 },
          { lat: 35.13329284292761, lng: 129.1065915927389 },
          { lat: 35.13247570734535, lng: 129.1066829748547 },
          { lat: 35.1324172060898, lng: 129.1066787250129 },
          { lat: 35.1323634946115, lng: 129.1066581443595 },
          { lat: 35.13231208267848, lng: 129.1066348806163 },
          { lat: 35.13225650064834, lng: 129.1065923128615 },
          { lat: 35.13221232100937, lng: 129.1065418118568 },
          { lat: 35.1321750399879, lng: 129.1064832615513 },
          { lat: 35.13214465757253, lng: 129.10641666194 },
          { lat: 35.13212797705884, lng: 129.1063394459259 },
          { lat: 35.13211790916285, lng: 129.1062706273978 },
          { lat: 35.1321191006399, lng: 129.1062020989487 },
          { lat: 35.13213595994304, lng: 129.1061394588495 },
          { lat: 35.13215281921465, lng: 129.1060768187229 },
          { lat: 35.13217643410312, lng: 129.1060143525922 },
          { lat: 35.1322087705744, lng: 129.1059685652974 },
          { lat: 35.13224570609947, lng: 129.1059174116913 },
          { lat: 35.13230271794682, lng: 129.1058777446531 },
          { lat: 35.13235048399819, lng: 129.1058515512801 },
          { lat: 35.13240261085994, lng: 129.1058336973283 },
          { lat: 35.13322870598866, lng: 129.1057452799163 },
        ],
        centerLat: 35.13243027853958,
        centerLng: 129.1062536357979,
      },
      {
        name: '푸드트럭',
        color: '#FED7AA',
        icon: '🍔',
        bounds: [
          { lat: 35.1342755724395, lng: 129.1046204208318 },
          { lat: 35.13431317984399, lng: 129.1050492097129 },
          { lat: 35.1341573235385, lng: 129.1050726207942 },
          { lat: 35.134119763813, lng: 129.1046410915204 },
        ],
        centerLat: 35.13421645990874,
        centerLng: 129.1048458357148,
      },
      {
        name: '행사',
        color: '#FDE68A',
        icon: '🎵',
        bounds: [
          { lat: 35.13554670885936, lng: 129.1039428439097 },
          { lat: 35.13557926322259, lng: 129.1041438830632 },
          { lat: 35.13529907725036, lng: 129.1041915205966 },
          { lat: 35.13536887132416, lng: 129.1049721802926 },
          { lat: 35.13526725077685, lng: 129.1049860184075 },
          { lat: 35.13519980387512, lng: 129.1041999351545 },
          { lat: 35.1349084536919, lng: 129.1042418000462 },
          { lat: 35.13489381928289, lng: 129.1040467086702 },
        ],
        centerLat: 35.13525790603541,
        centerLng: 129.1043406112676,
      },
    ],
  });

  // ============================================
  // Summary
  // ============================================
  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📊 === Seed Data Summary ===');
  console.log(`👤 Users: ${await prisma.user.count()}`);
  console.log(`🚚 Food Trucks: ${await prisma.foodTruck.count()}`);
  console.log(`🍽️  Menu Items: ${await prisma.menuItem.count()}`);
  console.log(`🎉 Events: ${await prisma.event.count()}`);
  console.log(`📍 Booth Zones: ${await prisma.boothZone.count()}`);

  console.log('\n🔑 === Test Accounts ===');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ 역할          │ 이메일                   │ 비밀번호     │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 관리자        │ admin@pknu.ac.kr         │ password123  │');
  console.log('│ 벤더 (타코비) │ vendor1@example.com      │ password123  │');
  console.log('│ 벤더 (버거)   │ vendor2@example.com      │ password123  │');
  console.log('│ 벤더 (치킨)   │ vendor3@example.com      │ password123  │');
  console.log('│ 일반 사용자   │ user@example.com         │ password123  │');
  console.log('└─────────────────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
