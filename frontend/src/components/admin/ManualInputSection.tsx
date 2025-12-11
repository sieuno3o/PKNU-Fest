import { useState } from 'react'
import { Hash, Search } from 'lucide-react'

interface ManualInputSectionProps {
    onSubmit: (code: string) => void
    isLoading: boolean
}

export default function ManualInputSection({ onSubmit, isLoading }: ManualInputSectionProps) {
    const [manualCode, setManualCode] = useState('')

    const handleSubmit = () => {
        if (manualCode.trim()) {
            onSubmit(manualCode.trim())
            setManualCode('')
        }
    }

    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Hash className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">예약 코드 직접 입력</h3>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="예약 코드 입력..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !manualCode.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
