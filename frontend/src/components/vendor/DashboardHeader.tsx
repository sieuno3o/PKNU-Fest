import { Store } from 'lucide-react'

interface DashboardHeaderProps {
    truckName: string
    isOpen: boolean
    onToggleStatus: () => void
}

export default function DashboardHeader({
    truckName,
    isOpen,
    onToggleStatus,
}: DashboardHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{truckName}</h1>
                        <p className="text-orange-100 text-sm">사장님 대시보드</p>
                    </div>
                </div>
                <button
                    onClick={onToggleStatus}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${isOpen
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 backdrop-blur text-white'
                        }`}
                >
                    {isOpen ? '영업 중' : '영업 종료'}
                </button>
            </div>
        </div>
    )
}
