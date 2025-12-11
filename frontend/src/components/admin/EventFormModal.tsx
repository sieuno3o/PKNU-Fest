import { X, Check } from 'lucide-react'
import type { CreateEventRequest } from '@/lib/api/events'

interface EventFormModalProps {
    isOpen: boolean
    isEditing: boolean
    formData: Partial<CreateEventRequest>
    onClose: () => void
    onSubmit: () => void
    onFormChange: (field: keyof CreateEventRequest, value: any) => void
}

export default function EventFormModal({
    isOpen,
    isEditing,
    formData,
    onClose,
    onSubmit,
    onFormChange,
}: EventFormModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                        {isEditing ? '행사 수정' : '새 행사 추가'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            행사 제목 *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onFormChange('title', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 아이유 콘서트"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => onFormChange('category', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 공연, 체험, 대회"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => onFormChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="행사 설명"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => onFormChange('date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간 *</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => onFormChange('startTime', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => onFormChange('endTime', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">장소 *</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => onFormChange('location', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 대운동장"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">정원</label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) =>
                                onFormChange('capacity', parseInt(e.target.value) || 0)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="최대 인원"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.requiresStudentVerification}
                                onChange={(e) =>
                                    onFormChange('requiresStudentVerification', e.target.checked)
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">학생 인증 필요</span>
                        </label>
                    </div>

                    <button
                        onClick={onSubmit}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        {isEditing ? '수정 완료' : '추가 완료'}
                    </button>
                </div>
            </div>
        </div>
    )
}
