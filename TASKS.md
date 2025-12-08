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
- [ ] QR 코드 생성/스캔
- [ ] Firebase Push Notification
- [ ] 토스페이먼츠 연동

### 기타

- [ ] React Hook Form + Zod 설정
- [x] 에러 핸들링 (ErrorBoundary + Toast)
- [x] 로그인 토큰 관리 (Zustand persist + axios interceptors)
- [x] TypeScript 타입 안전성 (User, Reservation 등 인터페이스 정의)
- [ ] Protected Route 설정

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

- [x] Firebase Admin SDK 설정 (푸시 알림)
- [x] 토스페이먼츠 API 연동
- [x] 이메일 발송 설정 (학생 인증)

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
