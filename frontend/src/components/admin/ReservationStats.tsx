interface ReservationStatsProps {
    total: number
    confirmed: number
    checkedIn: number
    cancelled: number
}

export default function ReservationStats({ total, confirmed, checkedIn, cancelled }: ReservationStatsProps) {
    return (
        <div className="p-4 -mt-4">
            <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                    <p className="text-xs text-gray-600">전체</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{confirmed}</p>
                    <p className="text-xs text-gray-600">확정</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{checkedIn}</p>
                    <p className="text-xs text-gray-600">체크인</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{cancelled}</p>
                    <p className="text-xs text-gray-600">취소</p>
                </div>
            </div>
        </div>
    )
}
