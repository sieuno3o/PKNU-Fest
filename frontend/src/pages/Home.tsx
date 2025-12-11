import { useAuth } from '../hooks/useAuth'
import AdminHome from './Admin/AdminHome'
import HeroBanner from '@/components/home/HeroBanner'
import QuickLinks from '@/components/home/QuickLinks'
import OngoingEvents from '@/components/home/OngoingEvents'
import MyReservations from '@/components/home/MyReservations'
import Notices from '@/components/home/Notices'

export default function Home() {
  const { user, isAdmin } = useAuth()

  // 관리자는 관리자 대시보드 표시
  if (isAdmin) {
    return <AdminHome />
  }

  const isLoggedIn = !!user

  return (
    <div className="pb-4 bg-gradient-to-b from-gray-50 to-white">
      <HeroBanner />
      <QuickLinks />
      <OngoingEvents />
      <MyReservations isLoggedIn={isLoggedIn} />
      <Notices />
    </div>
  )
}
