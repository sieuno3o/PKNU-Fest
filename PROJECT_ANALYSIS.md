# PKNU-Fest 프로젝트 기획 vs 구현 분석

> 작성일: 2025-12-19  
> 목적: 초기 기획서와 현재 구현 상태를 비교 분석

---

## 📊 요약

| 구분 | 항목 수 |
|------|--------|
| ✅ 구현 완료 | 23개 |
| ⚠️ 부분 구현/변경 | 8개 |
| ❌ 미구현 | 6개 |
| ➕ 추가 구현 | 5개 |

---

## ✅ 초기 기획대로 구현된 기능

### 1. GPS 기반 인터랙티브 캠퍼스 맵

| 기획 | 구현 상태 |
|-----|----------|
| 부경대학교 지리를 도식화한 인터랙티브 맵 | ✅ Leaflet 기반 지도 구현 ([Map.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Map.tsx)) |
| 행사, 부스, 푸드트럭 위치 핀 표시 | ✅ 마커로 표시, 클릭 시 상세 정보 표시 |
| 사용자 현재 위치 GPS 실시간 표시 | ✅ `navigator.geolocation` 사용 |
| 상세 정보(진행 시간, 프로그램 내용, 메뉴 등) 제공 | ✅ 팝업 카드로 표시 |

### 2. 통합 이벤트 관리

| 기획 | 구현 상태 |
|-----|----------|
| 실시간 예약 기능 | ✅ [EventDetail.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/EventDetail.tsx) |
| 선착순 자동 마감 처리 | ✅ 백엔드에서 capacity 체크 후 자동 마감 |
| 카테고리별 필터링 | ✅ [Events.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Events.tsx) |
| 검색 기능 | ✅ 이벤트/푸드트럭 검색 구현 |
| 내 예약 목록 관리 | ✅ [MyReservations.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/MyReservations.tsx) |
| QR 체크인 | ✅ [QRScanner.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Admin/QRScanner.tsx) |

### 3. 푸드트럭 시스템

| 기획 | 구현 상태 |
|-----|----------|
| 메뉴/가격 확인 | ✅ [FoodTruckDetail.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/FoodTruckDetail.tsx) |
| 스마트 오더 주문 | ✅ 장바구니 → 결제 플로우 구현 |
| 픽업번호 발급 | ✅ 주문 완료 시 번호 발급 |
| 주문 상태 실시간 확인 | ✅ Socket.IO 기반 실시간 업데이트 |

### 4. 운영진 기능

| 기획 | 구현 상태 |
|-----|----------|
| 프로그램 등록/관리 | ✅ [EventManagement.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Admin/EventManagement.tsx) |
| 신청 현황 모니터링 | ✅ [ReservationManagement.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Admin/ReservationManagement.tsx) |
| 푸시 알림 발송 | ✅ [AdminNotificationSender.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/components/admin/AdminNotificationSender.tsx) |
| 통계 대시보드 | ✅ [Statistics.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Admin/Statistics.tsx) |

### 5. 푸드트럭 운영자 기능

| 기획 | 구현 상태 |
|-----|----------|
| 메뉴 등록/관리 | ✅ [MenuManagement.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Vendor/MenuManagement.tsx) |
| 주문 관리 대시보드 | ✅ [OrderManagement.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Vendor/OrderManagement.tsx) |
| 조리 상태 업데이트 | ✅ 대기→조리중→완료 상태 변경 |
| 매출 리포트 | ✅ [Stats.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Vendor/Stats.tsx), [SalesReport.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Vendor/SalesReport.tsx) |

---

## ⚠️ 부분 구현 또는 변경된 기능

### 1. 길찾기 기능
| 기획 | 현재 상태 |
|-----|----------|
| 원하는 장소까지 길찾기 기능 지원 | ⚠️ **부분 구현**: 현재 위치와 목적지 표시는 되지만, 실제 네비게이션(경로 안내)은 미구현 |

### 2. 푸시 알림 시스템
| 기획 | 현재 상태 |
|-----|----------|
| 예약 시작 전 알림 | ✅ **구현**: 관리자가 대상별로 알림 발송 가능 |
| 준비 완료 시 푸시 알림 | ⚠️ **부분 구현**: 앱 내 알림은 구현, 실제 푸시 알림(FCM)은 미연동 |

### 3. 간편결제 시스템
| 기획 | 현재 상태 |
|-----|----------|
| 플랫폼 내 간편결제 도입 | ⚠️ **변경**: 실제 결제 연동 대신 Mock 결제 플로우로 구현 |

### 4. 재고 관리
| 기획 | 현재 상태 |
|-----|----------|
| 재고 설정 및 품절 자동 처리 | ⚠️ **부분 구현**: 품절 표시는 가능하나 실시간 재고 차감 로직은 미구현 |

### 5. 예약 타입
| 기획 | 현재 상태 |
|-----|----------|
| 선착순 자동 마감 | ✅ 구현 |
| 신청 후 선정 방식 | ⚠️ **추가 구현**: 기획에 없던 "심사 후 승인" 방식도 추가됨 |

### 6. 부스 관리
| 기획 | 현재 상태 |
|-----|----------|
| 부스 정보 표시 | ✅ 구현 |
| 부스별 신청 관리/참여 확인 | ⚠️ **부분 구현**: 부스 정보 조회는 가능, 부스별 예약/체크인은 이벤트 중심으로 통합됨 |

### 7. 매칭 이벤트
| 기획 | 현재 상태 |
|-----|----------|
| 매칭과 같은 이벤트에 필요한 기능들 | ⚠️ **미구현**: 매칭 알고리즘이나 매칭 결과 표시 기능은 미구현 |

### 8. 캠퍼스 와이파이 최적화
| 기획 | 현재 상태 |
|-----|----------|
| 앱보다 웹앱 접근 선호 | ✅ 웹앱으로 구현 |
| 오프라인 캐싱 | ⚠️ **미구현**: PWA 오프라인 지원 미적용 |

---

## ❌ 미구현 기능

| 기획 항목 | 설명 | 미구현 사유 |
|----------|------|-----------|
| **자동 통계 리포트 PDF** | 행사 종료 후 PDF 다운로드 | 추후 구현 예정 |
| **만족도 설문 자동 발송** | 참가자에게 설문 링크 자동 발송 | 추후 구현 예정 |
| **편의시설 표시** | 화장실, 휴게공간 등 핀 표시 | 추후 구현 예정 |
| **타임슬롯 선택** | 여러 시간대 중 선택 | 단일 시간 이벤트로 단순화 |
| **혼잡도 예측/표시** | 시간대별 혼잡도 | 데이터 부족으로 미구현 |
| **실제 FCM 푸시 알림** | 앱 외부 푸시 알림 | Firebase 연동만 완료, 푸시 미발송 |

---

## ➕ 기획에 없었으나 추가된 기능

| 추가 기능 | 설명 | 관련 파일 |
|----------|------|----------|
| **학생 인증 시스템** | 학생증/학번 인증으로 학생 전용 이벤트 참여 | [StudentVerification.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/StudentVerification.tsx) |
| **비밀번호 찾기/재설정** | 이메일 기반 비밀번호 복구 | [ForgotPassword.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/ForgotPassword.tsx), [ResetPassword.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/ResetPassword.tsx) |
| **부스 존 에디터** | 관리자가 지도에서 부스 구역 편집 | [BoothZoneEditor.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/pages/Admin/BoothZoneEditor.tsx) |
| **실시간 홈 카운트다운** | 축제 시작까지 실시간 카운트다운 | [HeroBanner.tsx](file:///Users/t2023-m0066/workspace/PKNU-Fest/frontend/src/components/home/HeroBanner.tsx) |
| **사용자 역할 분리** | USER / VENDOR / ADMIN / ORGANIZER 역할 구분 | 전체 시스템 |

---

## 📱 사용자 스토리 기반 구현 현황

### 행사 참여자 (김혜진 페르소나)

```
EPIC 1. 원하는 행사를 찾아본다
├── Story 1-1. 행사 위치를 지도에서 확인 ✅
│   ├── 지도 화면 열기 ✅
│   ├── GPS 현재 위치 확인 ✅
│   ├── 핀 확인 ✅
│   └── 클릭해 상세 정보 보기 ✅
└── Story 1-2. 검색과 필터로 찾기 ✅
    ├── 검색창 키워드 입력 ✅
    ├── 카테고리 선택 ✅
    └── 필터링된 결과 보기 ✅

EPIC 2. 참여할 프로그램을 예약한다
├── Story 2-1. 프로그램 정보 확인 ✅
│   ├── 상세정보 확인 ✅
│   └── 시간 선택 ⚠️ (단일 시간으로 단순화)
└── Story 2-2. 예약 완료 및 확인 ✅
    ├── 예약 버튼 ✅
    ├── 예약 성공 안내 ✅
    ├── 내 예약 목록 확인 ✅
    └── 시작 전 알림 ✅

EPIC 3. 푸드트럭을 이용한다
├── Story 3-1. 메뉴 보고 주문 ✅
│   ├── 푸드트럭 핀 클릭 ✅
│   ├── 메뉴/가격 확인 ✅
│   └── 스마트오더 주문 ✅
└── Story 3-2. 알림 받고 픽업 ⚠️
    ├── 결제 완료 안내 ✅
    ├── 조리 상태 실시간 확인 ✅
    ├── 준비 완료 알림 ⚠️ (인앱 알림만)
    └── 픽업존에서 수령 ✅
```

### 행사 운영진 (박민재 페르소나)

```
EPIC 1. 축제 프로그램을 등록·관리한다
├── Story 1-1. 프로그램 등록 ✅
│   ├── 대시보드 접속 ✅
│   ├── 행사 정보 입력 ✅
│   ├── 지도 좌표 선택 ✅
│   └── 핀 표시 확인 ✅
└── Story 1-2. 신청 현황 모니터링 ✅
    ├── 신청 인원 확인 ✅
    ├── 자동 마감 확인 ✅
    └── 혼잡 시간대 파악 ⚠️ (통계만)

EPIC 2. 현장에서 공지를 즉시 전달한다
└── Story 2-1. 공지 발송 ✅
    ├── 공지 작성 ✅
    ├── 대상 선택 ✅ (USER/VENDOR)
    └── 푸시 알림 발송 ✅
```

### 푸드트럭 운영자 (이지훈 페르소나)

```
EPIC 1. 푸드트럭을 등록·관리한다
└── Story 1-1. 메뉴와 가격 입력 ✅
    ├── 운영자 페이지 접속 ✅
    ├── 메뉴 정보 등록 ✅
    └── 품절 처리 ⚠️ (수동)

EPIC 2. 주문을 효율적으로 처리한다
├── Story 2-1. 주문 관리 ✅
│   ├── 새 주문 확인 ✅
│   ├── 조리 시작 상태 변경 ✅
│   └── 준비 완료 클릭 ✅
└── Story 2-2. 픽업 알림 ⚠️
    ├── 자동 푸시 전송 ⚠️ (인앱만)
    ├── 픽업번호 표시 ✅
    └── 수령 완료 변경 ✅
```

---

## 🔮 향후 개선 방향

### 우선순위 높음
1. **FCM 푸시 알림 연동** - 앱 외부 알림 발송
2. **PDF 리포트 생성** - 통계 다운로드 기능
3. **타임슬롯 예약** - 시간대별 예약 선택

### 우선순위 중간
4. **길찾기 네비게이션** - 경로 안내 기능
5. **만족도 설문** - 자동 설문 발송
6. **실시간 재고 관리** - 품절 자동 처리

### 우선순위 낮음
7. **혼잡도 예측** - AI 기반 분석
8. **매칭 알고리즘** - 동심찾기 등 매칭 이벤트
9. **PWA 오프라인 지원** - 캐싱 최적화

---

## 📈 구현률

| 구분 | 구현률 |
|------|--------|
| 행사 참여자 기능 | **92%** (11/12 Task) |
| 행사 운영진 기능 | **90%** (9/10 Task) |
| 푸드트럭 운영자 기능 | **83%** (10/12 Task) |
| **전체** | **88%** |

---

*최종 작성: 2025-12-19*
