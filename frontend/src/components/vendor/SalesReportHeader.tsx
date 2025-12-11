import { Download } from 'lucide-react'

interface SalesReportHeaderProps {
    onExportClick: () => void
}

export default function SalesReportHeader({ onExportClick }: SalesReportHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold mb-1">매출 리포트</h1>
                    <p className="text-purple-100">매출 현황과 통계를 확인하세요</p>
                </div>
                <button
                    onClick={onExportClick}
                    className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/30 transition"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
