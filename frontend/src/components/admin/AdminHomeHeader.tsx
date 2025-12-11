import { Shield } from 'lucide-react'

export default function AdminHomeHeader() {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <div>
                    <h1 className="text-2xl font-bold">관리자 대시보드</h1>
                    <p className="text-indigo-100">축제 현황을 한눈에 확인하세요</p>
                </div>
            </div>
        </div>
    )
}
