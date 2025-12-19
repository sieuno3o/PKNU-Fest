import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function EventManagementHeader() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">행사 관리</h1>
                    <p className="text-blue-100">축제 행사를 등록하고 관리하세요</p>
                </div>
                <Link
                    to="/admin/booth-zones"
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition whitespace-nowrap"
                >
                    <MapPin className="w-5 h-5" />
                    범위 추가하기
                </Link>
            </div>
        </div>
    )
}
