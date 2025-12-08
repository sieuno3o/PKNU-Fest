# UI 컴포넌트 사용 가이드

## 🎨 로딩 스피너 (Spinner)

### 기본 사용법

```tsx
import Spinner, { PageSpinner, ButtonSpinner, InlineSpinner } from '@/components/ui/Spinner'

// 기본 스피너
<Spinner size="md" />

// 풀스크린 스피너
<Spinner size="lg" fullScreen text="로딩중..." />

// 페이지 로딩용
<PageSpinner text="데이터를 불러오는 중..." />

// 버튼 내부용
<button disabled>
  <ButtonSpinner />
  처리중...
</button>

// 인라인 스피너
<InlineSpinner text="저장중..." />
```

### Props

- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `fullScreen`: boolean - 전체 화면 오버레이
- `text`: string - 스피너 아래 표시할 텍스트

---

## 🚨 에러 바운더리 (ErrorBoundary)

### 사용법

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'

// 앱 전체를 감싸기
<ErrorBoundary>
  <App />
</ErrorBoundary>

// 특정 섹션만 감싸기
<ErrorBoundary>
  <SomeComponent />
</ErrorBoundary>

// 커스텀 폴백 UI
<ErrorBoundary fallback={<div>커스텀 에러 화면</div>}>
  <SomeComponent />
</ErrorBoundary>
```

---

## 🔔 토스트 알림 (Toast)

### 사용법

```tsx
import { toast } from '@/components/ui/Toast'

// 성공 메시지
toast.success('저장되었습니다!')

// 에러 메시지
toast.error('오류가 발생했습니다')

// 경고 메시지
toast.warning('주의가 필요합니다')

// 정보 메시지
toast.info('새로운 알림이 있습니다')
```

### 설정

`App.tsx`에 `ToastContainer` 추가 필요:

```tsx
import { ToastContainer } from '@/components/ui/Toast'

function App() {
  return (
    <>
      <YourApp />
      <ToastContainer />
    </>
  )
}
```

---

## 💀 스켈레톤 로딩 (Skeleton)

### 기본 사용법

```tsx
import Skeleton, {
  CardSkeleton,
  ListSkeleton,
  EventCardSkeleton,
  FoodTruckCardSkeleton,
  ProfileSkeleton,
  TableSkeleton,
} from '@/components/ui/Skeleton'

// 기본 스켈레톤
<Skeleton width={200} height={20} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="text" />

// 프리셋 스켈레톤
<CardSkeleton />
<ListSkeleton count={5} />
<EventCardSkeleton />
<FoodTruckCardSkeleton />
<ProfileSkeleton />
<TableSkeleton rows={10} />
```

### Props

- `variant`: 'text' | 'rectangular' | 'circular'
- `width`: string | number
- `height`: string | number
- `animation`: 'pulse' | 'wave' | 'none'

---

## 📭 빈 상태 UI (EmptyState)

### 기본 사용법

```tsx
import EmptyState, {
  EmptyCart,
  EmptyOrders,
  EmptyReservations,
  EmptySearchResults,
  EmptyEvents,
  EmptyMenu,
  ErrorState,
} from '@/components/ui/EmptyState'

// 기본 빈 상태
<EmptyState
  icon={ShoppingBag}
  title="장바구니가 비어있어요"
  description="원하는 메뉴를 담아보세요"
  action={{
    label: '푸드트럭 보기',
    onClick: () => navigate('/foodtrucks')
  }}
/>

// 프리셋 빈 상태
<EmptyCart onBrowse={() => navigate('/foodtrucks')} />
<EmptyOrders />
<EmptyReservations onCreate={() => navigate('/events')} />
<EmptySearchResults query="검색어" />
<EmptyEvents onCreate={() => setShowModal(true)} />
<EmptyMenu onCreate={() => setShowModal(true)} />
<ErrorState message="데이터를 불러올 수 없습니다" onRetry={() => refetch()} />
```

---

## ✨ 애니메이션 (Animated)

### 기본 사용법

```tsx
import Animated, {
  Staggered,
  FadeTransition,
  SlideTransition,
  ViewportAnimated,
} from '@/components/ui/Animated'

// 기본 애니메이션
<Animated animation="fade-in">
  <div>페이드 인</div>
</Animated>

<Animated animation="slide-up" delay={100}>
  <div>슬라이드 업</div>
</Animated>

// 순차 애니메이션
<Staggered animation="fade-in" staggerDelay={100}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Staggered>

// 조건부 애니메이션
<FadeTransition show={isVisible}>
  <div>조건부 표시</div>
</FadeTransition>

<SlideTransition show={isOpen} direction="up">
  <Modal />
</SlideTransition>

// 뷰포트 진입 애니메이션
<ViewportAnimated animation="slide-up" threshold={0.2}>
  <Section />
</ViewportAnimated>
```

### 사용 가능한 애니메이션

- `fade-in` / `fade-out`
- `slide-up` / `slide-down`
- `slide-in-left` / `slide-in-right`
- `scale-in` / `scale-out`
- `bounce-in`

### Tailwind 클래스로 직접 사용

```tsx
<div className="animate-fade-in">페이드 인</div>
<div className="animate-slide-up">슬라이드 업</div>
<div className="animate-bounce-in">바운스 인</div>
<div className="animate-shimmer">쉬머 효과</div>
<div className="animate-pulse-slow">느린 펄스</div>
```

---

## 📝 사용 예제

### 데이터 로딩 상태 처리

```tsx
function EventList() {
  const { data, isLoading, error } = useQuery('events', fetchEvents)

  if (isLoading) {
    return <ListSkeleton count={5} />
  }

  if (error) {
    return <ErrorState message="행사를 불러올 수 없습니다" onRetry={refetch} />
  }

  if (!data || data.length === 0) {
    return <EmptyEvents onCreate={() => navigate('/admin/events/new')} />
  }

  return (
    <Staggered animation="slide-up" staggerDelay={50}>
      {data.map(event => (
        <EventCard key={event.id} {...event} />
      ))}
    </Staggered>
  )
}
```

### 폼 제출 처리

```tsx
function CreateEventForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data) => {
    setIsLoading(true)
    try {
      await createEvent(data)
      toast.success('행사가 등록되었습니다!')
      navigate('/events')
    } catch (error) {
      toast.error('행사 등록에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? <ButtonSpinner /> : '등록하기'}
      </button>
    </form>
  )
}
```

### 모달 애니메이션

```tsx
function Modal({ isOpen, onClose }) {
  return (
    <FadeTransition show={isOpen}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose}>
        <SlideTransition show={isOpen} direction="up">
          <div className="bg-white rounded-t-3xl p-6">
            {/* 모달 내용 */}
          </div>
        </SlideTransition>
      </div>
    </FadeTransition>
  )
}
```

---

## 🎯 모범 사례

1. **일관성 유지**: 앱 전체에서 동일한 로딩/에러/빈 상태 패턴 사용
2. **적절한 피드백**: 사용자 액션에 즉각적인 시각적 피드백 제공
3. **과도한 애니메이션 지양**: 필요한 곳에만 애니메이션 사용
4. **접근성 고려**: 애니메이션으로 인한 어지러움 방지 (prefers-reduced-motion)
5. **성능 고려**: 많은 항목에 애니메이션 적용 시 성능 테스트 필수
