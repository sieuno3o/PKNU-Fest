import { Calendar, Users, Store, Ticket } from 'lucide-react'

interface AdminStatsGridProps {
    eventCount: number
    reservationCount: number
    foodTruckCount: number
    todayCheckIns: number
}

export default function AdminStatsGrid({
    eventCount,
    reservationCount,
    foodTruckCount,
    todayCheckIns,
}: AdminStatsGridProps) {
    return (
        <div className="px-4 -mt-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{eventCount}</p>
                    <p className="text-sm text-gray-600">진행 중 행사</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <Ticket className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{reservationCount}</p>
                    <p className="text-sm text-gray-600">오늘 예약</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <Store className="w-8 h-8 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{foodTruckCount}</p>
                    <p className="text-sm text-gray-600">영업 중 푸드트럭</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <Users className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{todayCheckIns}</p>
                    <p className="text-sm text-gray-600">오늘 체크인</p>
                </div>
            </div>
        </div>
    )
}
