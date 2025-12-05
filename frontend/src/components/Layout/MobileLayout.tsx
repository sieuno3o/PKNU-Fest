import type { ReactNode } from 'react'
import Header from './Header'
import BottomNavigation from './BottomNavigation'

interface MobileLayoutProps {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 헤더 - 상단 고정 */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* 메인 콘텐츠 영역 - 스크롤 가능 (헤더와 네비게이션 사이) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* 하단 네비게이션 - 하단 고정 */}
      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  )
}
