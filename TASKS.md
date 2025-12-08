# PKNU-Fest 개발 태스크

## 📱 프론트엔드 - 페이지 구현

### ✅ 완료

- [x] 홈 페이지 (Home)
- [x] 레이아웃 구조 (Header, BottomNavigation, MobileLayout)

### 🔨 진행 예정

#### 1. 인증 페이지

- [x] 로그인 페이지
- [x] 회원가입 페이지
- [x] 학생 인증 페이지

#### 2. 행사 관련 페이지

- [x] 행사 목록 페이지 (필터링, 검색)
- [x] 행사 상세 페이지
- [x] 예약 하기 모달/페이지

#### 3. 지도 페이지

- [x] 카카오 맵 연동
- [x] 마커로 행사/푸드트럭 위치 표시
- [x] 마커 클릭 시 상세 정보 표시

#### 4. 푸드트럭 페이지

- [x] 푸드트럭 목록 페이지
- [x] 푸드트럭 상세 페이지 (메뉴)
- [x] 주문하기 기능 (장바구니 담기 / 바로 결제)
- [x] 장바구니 페이지
- [x] 주문 내역 페이지

#### 5. 마이페이지

- [x] 내 예약 목록 페이지
- [x] QR 코드 표시
- [x] 예약 취소 기능
- [x] 프로필 수정 페이지

#### 6. 관리자 페이지

- [x] 대시보드 (통계)
- [x] 행사 관리 (CRUD)
- [x] 예약 관리
- [x] 체크인 QR 스캐너

#### 7. 푸드트럭 운영자 페이지

- [x] 메뉴 관리
- [x] 주문 관리
- [x] 매출 리포트

## 🎨 UI/UX 개선

- [x] 로딩 스피너 컴포넌트
- [x] 에러 바운더리
- [x] 토스트 알림
- [x] 스켈레톤 로딩
- [x] 빈 상태 UI (Empty State)
- [x] 애니메이션 효과

## 🔧 프론트엔드 - 기능 구현

### 상태 관리

- [x] Zustand 스토어 설정
- [x] 인증 스토어 (authStore.ts - persist 적용)
- [x] 사용자 정보 스토어 (authStore에 통합)
- [x] 예약 스토어 (reservationStore.ts)
- [x] 장바구니 스토어 (cartStore.ts - persist 적용)

### API 연동

- [x] TanStack Query 설정 (queryClient.ts)
- [x] API 클라이언트 설정 (axios - client.ts with interceptors)
- [x] 인증 API 연동 (auth.ts - 10개 엔드포인트)
- [x] 행사 API 연동 (events.ts - CRUD + 필터링)
- [x] 예약 API 연동 (reservations.ts - CRUD + QR 코드)
- [x] 푸드트럭 API 연동 (foodtrucks.ts - 메뉴 관리)
- [x] 주문 API 연동 (orders.ts - 고객/운영자 주문 관리)

### React Query Hooks

- [x] useAuth (10개 인증 관련 훅)
- [x] useEvents (8개 행사 관련 훅)
- [x] useReservations (8개 예약 관련 훅)
- [x] useFoodTrucks (9개 푸드트럭/메뉴 관련 훅)
- [x] useOrders (8개 주문 관련 훅)

### 외부 서비스 연동

- [x] 카카오 맵 API 연동
- [x] 장바구니 기능 (localStorage 기반)
- [x] 장바구니 토스트 알림 (우측 하단)
- [ ] QR 코드 생성/스캔
- [ ] Firebase Push Notification
- [x] 결제 시스템 연동 (Phase 1: 모의 결제)
  - [x] 결제 페이지 (Checkout.tsx)
  - [x] 결제 성공 페이지 (PaymentSuccess.tsx)
  - [x] 결제 API 엔드포인트 (processPayment, cancelPayment)
  - [x] Order 모델 결제 필드 추가 (paymentId, paymentMethod, paymentStatus, paidAt)
  - [x] 결제 수단 선택 UI (카드/카카오페이/토스페이)
  - [ ] Phase 2: 실제 토스페이먼츠 API 연동 (향후 사업자 등록 후)

### 기타

- [x] Zod Validation 스키마 (백엔드 validation.schemas.ts)
- [ ] React Hook Form 설정 (프론트엔드)
- [x] 에러 핸들링 (ErrorBoundary + Toast)
- [x] 로그인 토큰 관리 (Zustand persist + axios interceptors)
- [x] TypeScript 타입 안전성 (User, Reservation, Order, Payment 등 인터페이스 정의)
- [ ] Protected Route 설정 (role-based access control)

## 🖥️ 백엔드 - 인프라

### 데이터베이스

- [x] PostgreSQL 연결 설정
- [x] Prisma 마이그레이션 실행
- [x] 시드 데이터 작성

### API 테스트

- [x] 인증 API 테스트
- [x] 행사 API 테스트
- [x] 예약 API 테스트
- [x] 푸드트럭/주문 API 테스트

### 실시간 기능

- [x] Socket.io 설정
- [x] 실시간 예약 현황 업데이트
- [x] 주문 상태 변경 알림

### 외부 서비스

- [ ] Firebase Admin SDK 설정 (푸시 알림) - 설정 파일 준비됨, 실제 연동 미완료
- [x] 토스페이먼츠 유틸리티 작성 (payment.util.ts)
- [x] 이메일 발송 설정 (학생 인증)
  - [x] Gmail SMTP 설정 완료 (pknufest@gmail.com)
  - [x] 학생 인증 이메일 발송 기능 (email.util.ts)
- [x] 결제 처리 로직 (모의 결제 - Phase 1)

### 배포

- [ ] 환경 변수 설정
- [ ] 프로덕션 빌드 테스트
- [ ] 배포 환경 준비

## 📝 문서화

- [ ] API 문서 작성 (Swagger/Postman)
- [ ] 컴포넌트 문서화
- [ ] README 업데이트

## 🧪 테스트

- [ ] 단위 테스트 작성
- [ ] 통합 테스트
- [ ] E2E 테스트

---

## 📊 현재 구현 상태 요약

### ✅ 완전히 구현된 기능

1. **인증 시스템**
   - 회원가입/로그인/로그아웃
   - 학생 이메일 인증 (이메일 발송 기능)
   - JWT 토큰 관리
   - 역할 기반 접근 제어 (USER, ADMIN, VENDOR)

2. **행사 관리**
   - 행사 CRUD (생성/조회/수정/삭제)
   - 행사 필터링 및 검색
   - 학생 전용 행사 설정
   - 시간대별 예약 시스템

3. **예약 시스템**
   - 예약 생성/조회/취소
   - 학생 전용 행사 예약 제한
   - 예약 상태 관리

4. **지도 기능**
   - 카카오 맵 연동
   - 행사/푸드트럭 위치 마커 표시
   - 마커 클릭 시 상세 정보

5. **푸드트럭 & 주문**
   - 푸드트럭 목록/상세
   - 메뉴 관리 (운영자)
   - 장바구니 기능 (localStorage)
   - 주문 생성/관리
   - 주문 상태 추적 (RECEIVED → PREPARING → READY → COMPLETED)

6. **결제 시스템 (Phase 1: 모의 결제)**
   - 결제 페이지 UI
   - 결제 수단 선택 (카드/카카오페이/토스페이)
   - 모의 결제 처리 (실제 API 호출 없음)
   - 결제 완료/취소 로직
   - 매출 통계 기능

7. **관리자 대시보드**
   - 통계 대시보드
   - 행사 관리
   - 예약 관리
   - 사용자 관리

8. **푸드트럭 운영자 대시보드**
   - 주문 관리
   - 메뉴 관리
   - 매출 리포트

9. **실시간 기능**
   - Socket.io 연결
   - 예약 현황 실시간 업데이트
   - 주문 상태 변경 알림

10. **UI/UX**
    - 반응형 모바일 레이아웃
    - 토스트 알림 시스템
    - 에러 바운더리
    - 로딩 스피너
    - 빈 상태 UI

### ⚠️ 부분적으로 구현된 기능

1. **QR 코드**
   - [ ] QR 코드 생성 (예약 시)
   - [ ] QR 코드 스캔 (체크인)
   - QR Scanner 페이지는 있지만 실제 구현 필요

2. **푸시 알림**
   - [ ] Firebase Cloud Messaging 연동
   - [ ] 실시간 푸시 알림 발송
   - Firebase 유틸리티 파일은 준비되어 있음

3. **보호된 라우트**
   - [ ] 역할 기반 라우트 보호 (Protected Route)
   - 백엔드 미들웨어는 있지만 프론트엔드 라우트 가드 필요

### ❌ 미구현 기능 (향후 계획)

1. **Phase 2: 실제 결제 연동**
   - [ ] 각 푸드트럭별 토스페이먼츠 API 키 등록
   - [ ] API 키 암호화/복호화
   - [ ] 실제 토스페이먼츠 SDK 연동
   - [ ] 웹훅 설정
   - ⚠️ 사업자 등록번호 필요

2. **소셜 로그인**
   - [ ] 카카오 로그인
   - [ ] 구글 로그인

3. **고급 기능**
   - [ ] 사용자 리뷰 시스템
   - [ ] 공유 기능
   - [ ] 다크 모드
   - [ ] 다국어 지원

4. **테스트 & 배포**
   - [ ] 단위/통합/E2E 테스트
   - [ ] API 문서화 (Swagger)
   - [ ] 프로덕션 배포

---

## 🎯 다음 우선순위 작업

### 즉시 가능 (사업자 등록 불필요)

1. **QR 코드 시스템 구현**
   - react-qr-code 라이브러리 사용
   - QR 생성 (예약 번호 기반)
   - QR 스캔 (관리자용)

2. **Protected Route 설정**
   - role별 접근 제어
   - 미인증 사용자 리다이렉트

3. **Firebase Push Notification**
   - FCM 토큰 관리
   - 주문/예약 상태 변경 시 푸시

### 향후 계획 (사업자 등록 필요)

1. **실제 결제 연동 (Phase 2)**
   - 각 푸드트럭 사업자 등록
   - 토스페이먼츠 가맹점 계약
   - API 키 등록 및 암호화
