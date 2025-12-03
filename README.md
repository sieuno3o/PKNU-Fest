# PKNU-Fest

부경대학교 축제를 위한 통합 플랫폼

## 프로젝트 개요

PKNU-Fest는 부경대학교 축제 참여자, 운영진, 푸드트럭 운영자를 위한 통합 웹 플랫폼입니다.

### 주요 기능

**참여자 기능**

- GPS 기반 캠퍼스 지도로 행사 및 부스 위치 확인
- 실시간 행사 검색 및 필터링
- 프로그램 예약 및 QR 체크인
- 푸드트럭 스마트 오더 및 간편결제
- 푸시 알림을 통한 실시간 업데이트

**운영진 기능**

- 행사 등록 및 관리 대시보드
- 실시간 예약 현황 모니터링
- 자동 마감 처리
- 공지사항 푸시 발송
- 참여자 통계 및 리포트

**푸드트럭 운영자 기능**

- 메뉴 등록 및 관리
- 실시간 주문 관리
- 픽업번호 자동 발급
- 준비 완료 알림 자동 전송
- 매출 리포트

## 기술 스택

### 프론트엔드

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: Zustand + TanStack Query
- **Map**: Kakao Map API
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod
- **QR Code**: react-qr-code

### 백엔드

- **Runtime**: Node.js
- **Framework**: Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt

### 추가 서비스

- **Push Notifications**: Firebase Cloud Messaging
- **Payment**: 토스페이먼츠

## 프로젝트 구조

```
PKNU-Fest/
├── frontend/               # 프론트엔드 (Vite + React)
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   │   └── ui/        # shadcn/ui 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── Admin/     # 관리자 페이지
│   │   │   └── Vendor/    # 푸드트럭 운영자 페이지
│   │   ├── features/      # 기능별 모듈
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── api/           # API 호출
│   │   ├── stores/        # Zustand 스토어
│   │   ├── types/         # TypeScript 타입
│   │   ├── utils/         # 유틸리티
│   │   └── lib/           # 라이브러리 설정
│   └── package.json
│
└── backend/               # 백엔드 (Node.js + Express)
    ├── src/
    │   ├── controllers/   # 컨트롤러
    │   ├── services/      # 비즈니스 로직
    │   ├── routes/        # 라우팅
    │   ├── middleware/    # 미들웨어
    │   ├── types/         # TypeScript 타입
    │   └── utils/         # 유틸리티
    ├── prisma/            # Prisma 스키마
    │   └── schema.prisma
    └── package.json
```

## 시작하기

### 사전 요구사항

- Node.js (v18 이상)
- PostgreSQL (v14 이상)
- npm 또는 yarn

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd PKNU-Fest
```

2. 프론트엔드 설치

```bash
cd frontend
npm install
cp .env.example .env
# .env 파일을 열어 필요한 환경 변수 설정
```

3. 백엔드 설치

```bash
cd ../backend
npm install
cp .env.example .env
# .env 파일을 열어 필요한 환경 변수 설정
```

4. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성 후
npx prisma migrate dev
npx prisma generate
```

### 개발 서버 실행

1. 백엔드 실행

```bash
cd backend
npm run dev
```

2. 프론트엔드 실행 (새 터미널)

```bash
cd frontend
npm run dev
```

프론트엔드: http://localhost:5173
백엔드: http://localhost:3000

## API 엔드포인트

### 인증

- `POST /api/auth/register` - 회원가입 (일반 이메일)
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 내 정보 조회
- `PUT /api/auth/me` - 내 정보 수정
- `POST /api/auth/verify-student` - 🆕 학생 인증 코드 발송
- `POST /api/auth/confirm-student` - 🆕 학생 인증 코드 확인

### 행사

- `GET /api/events` - 행사 목록 조회 (필터: `?studentOnly=true`)
- `GET /api/events/:id` - 행사 상세 조회
- `POST /api/events` - 행사 등록 (관리자)
  - 지원: `isStudentOnly`, `capacity` (nullable), `thumbnail`, `images`, `status`, `organizer`
- `PUT /api/events/:id` - 행사 수정 (관리자)
- `DELETE /api/events/:id` - 행사 삭제 (관리자)

### 예약

- `GET /api/reservations` - 내 예약 목록
- `POST /api/reservations` - 예약 생성
  - 학생 전용 행사는 학생 인증 필수
  - `partySize` 지원 (1-4명)
- `DELETE /api/reservations/:id` - 예약 취소
- `POST /api/reservations/:id/checkin` - QR 체크인
  - `checkedInAt` 자동 설정

### 푸드트럭

- `GET /api/foodtrucks` - 푸드트럭 목록
- `GET /api/foodtrucks/:id` - 푸드트럭 상세
- `GET /api/foodtrucks/:id/menu` - 메뉴 조회

### 주문

- `POST /api/orders` - 주문 생성
- `GET /api/orders/:id` - 주문 상태 조회
- `PUT /api/orders/:id/status` - 주문 상태 변경 (운영자)

## 데이터베이스 스키마

주요 테이블:

- `users` - 사용자 (학생, 운영진, 푸드트럭 운영자)
- `events` - 행사/프로그램
- `time_slots` - 시간대별 예약
- `reservations` - 예약
- `food_trucks` - 푸드트럭
- `menu_items` - 메뉴
- `orders` - 주문
- `order_items` - 주문 아이템

자세한 스키마는 `backend/prisma/schema.prisma` 참조

## 배포

### 프론트엔드 빌드

```bash
cd frontend
npm run build
```

### 백엔드 빌드

```bash
cd backend
npm run build
npm start
```
