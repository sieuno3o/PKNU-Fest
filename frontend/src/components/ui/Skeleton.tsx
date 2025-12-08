interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`bg-gray-200 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  )
}

// 카드형 스켈레톤
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <Skeleton variant="rectangular" height={160} className="mb-4" />
      <Skeleton variant="text" height={24} className="mb-2" />
      <Skeleton variant="text" height={16} width="60%" className="mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" height={20} width={80} />
        <Skeleton variant="rectangular" height={36} width={100} />
      </div>
    </div>
  )
}

// 리스트형 스켈레톤
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
          <Skeleton variant="rectangular" width={80} height={80} />
          <div className="flex-1">
            <Skeleton variant="text" height={20} className="mb-2" />
            <Skeleton variant="text" height={16} width="80%" className="mb-2" />
            <Skeleton variant="text" height={16} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

// 이벤트 카드 스켈레톤
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton variant="rectangular" height={200} className="rounded-none" />
      <div className="p-4">
        <Skeleton variant="text" height={24} className="mb-2" />
        <Skeleton variant="text" height={16} className="mb-3" />
        <div className="flex gap-2 mb-3">
          <Skeleton variant="rectangular" height={24} width={60} />
          <Skeleton variant="rectangular" height={24} width={60} />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} />
        </div>
      </div>
    </div>
  )
}

// 푸드트럭 카드 스켈레톤
export function FoodTruckCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex gap-4 mb-4">
        <Skeleton variant="rectangular" width={80} height={80} />
        <div className="flex-1">
          <Skeleton variant="text" height={20} className="mb-2" />
          <Skeleton variant="text" height={16} width="70%" className="mb-2" />
          <Skeleton variant="rectangular" height={24} width={60} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
      </div>
    </div>
  )
}

// 프로필 스켈레톤
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1">
          <Skeleton variant="text" height={24} className="mb-2" />
          <Skeleton variant="text" height={16} width="60%" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton variant="text" height={12} width={60} className="mb-2" />
              <Skeleton variant="text" height={16} width="80%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 테이블 스켈레톤
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="text" height={16} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} variant="text" height={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
