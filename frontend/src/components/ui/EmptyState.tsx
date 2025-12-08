import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  children?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

      {description && <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>}

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
        >
          {action.label}
        </button>
      )}

      {children}
    </div>
  )
}

// 특정 상황에 맞는 EmptyState 프리셋들

import {
  ShoppingBag,
  Calendar,
  Search,
  Inbox,
  FileText,
  Users,
  Package,
  AlertCircle,
  MapPin,
  Heart,
} from 'lucide-react'

export function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="장바구니가 비어있어요"
      description="원하는 메뉴를 담아보세요"
      action={{ label: '푸드트럭 둘러보기', onClick: onBrowse }}
    />
  )
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={Inbox}
      title="주문 내역이 없습니다"
      description="푸드트럭에서 주문하면 여기에 표시됩니다"
    />
  )
}

export function EmptyReservations({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="예약 내역이 없습니다"
      description="관심있는 행사를 예약해보세요"
      action={onCreate ? { label: '행사 둘러보기', onClick: onCreate } : undefined}
    />
  )
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="검색 결과가 없습니다"
      description={query ? `"${query}"에 대한 결과를 찾을 수 없습니다` : '다른 검색어로 시도해보세요'}
    />
  )
}

export function EmptyList({ title, description }: { title: string; description?: string }) {
  return <EmptyState icon={FileText} title={title} description={description} />
}

export function EmptyEvents({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="등록된 행사가 없습니다"
      description="새로운 행사를 등록해보세요"
      action={onCreate ? { label: '행사 등록하기', onClick: onCreate } : undefined}
    />
  )
}

export function EmptyUsers() {
  return (
    <EmptyState
      icon={Users}
      title="사용자가 없습니다"
      description="아직 등록된 사용자가 없습니다"
    />
  )
}

export function EmptyMenu({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="메뉴가 없습니다"
      description="첫 메뉴를 등록해보세요"
      action={onCreate ? { label: '메뉴 추가하기', onClick: onCreate } : undefined}
    />
  )
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Inbox}
      title="알림이 없습니다"
      description="새로운 알림이 있으면 여기에 표시됩니다"
    />
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="문제가 발생했습니다"
      description={message || '일시적인 오류가 발생했습니다. 다시 시도해주세요.'}
      action={onRetry ? { label: '다시 시도', onClick: onRetry } : undefined}
    />
  )
}

export function EmptyMap() {
  return (
    <EmptyState
      icon={MapPin}
      title="표시할 위치가 없습니다"
      description="지도에 표시할 위치 정보가 없습니다"
    />
  )
}

export function EmptyFavorites({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={Heart}
      title="찜한 항목이 없습니다"
      description="마음에 드는 항목을 찜해보세요"
      action={onBrowse ? { label: '둘러보기', onClick: onBrowse } : undefined}
    />
  )
}
