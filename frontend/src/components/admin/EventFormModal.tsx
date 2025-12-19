import { X, Check, Image, MapPin, Navigation } from 'lucide-react'
import type { CreateEventRequest } from '@/lib/api/events'
import { useState } from 'react'
import LocationPickerModal from './LocationPickerModal'

interface EventFormModalProps {
    isOpen: boolean
    isEditing: boolean
    formData: Partial<CreateEventRequest>
    onClose: () => void
    onSubmit: () => void
    onFormChange: (field: keyof CreateEventRequest, value: any) => void
}

// 카테고리 옵션 (Booths 페이지와 동일)
const CATEGORY_OPTIONS = [
    { value: '게임', label: '🎮 게임' },
    { value: '매칭', label: '💕 매칭' },
    { value: '퀴즈', label: '❓ 퀴즈' },
    { value: '체험', label: '🎨 체험' },
    { value: '음식', label: '🍔 음식' },
    { value: '포토', label: '📸 포토' },
    { value: '공연', label: '🎵 공연' },
    { value: '기타', label: '✨ 기타' },
]

export default function EventFormModal({
    isOpen,
    isEditing,
    formData,
    onClose,
    onSubmit,
    onFormChange,
}: EventFormModalProps) {
    const [showLocationPicker, setShowLocationPicker] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<string>('')

    if (!isOpen) return null

    return (
        <>
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
                        {/* 이미지 URL 입력 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    행사 이미지 URL
                                </div>
                            </label>
                            <input
                                type="url"
                                value={formData.image || ''}
                                onChange={(e) => onFormChange('image', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <div className="mt-2 relative">
                                    <img
                                        src={formData.image}
                                        alt="미리보기"
                                        className="w-full h-32 object-cover rounded-xl border"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                            <select
                                value={formData.category || ''}
                                onChange={(e) => onFormChange('category', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">카테고리 선택</option>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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

                        {/* 설명 이미지 URL 입력 (최대 5장) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    설명 이미지 URL (최대 5장)
                                </div>
                            </label>
                            <div className="space-y-2">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="url"
                                            value={(formData.images || [])[index] || ''}
                                            onChange={(e) => {
                                                const newImages = [...(formData.images || [])]
                                                if (e.target.value) {
                                                    newImages[index] = e.target.value
                                                } else {
                                                    newImages.splice(index, 1)
                                                }
                                                onFormChange('images', newImages.filter(Boolean))
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder={`이미지 ${index + 1} URL`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* 이미지 미리보기 */}
                            {formData.images && formData.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {formData.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`설명 이미지 ${idx + 1}`}
                                            className="w-full h-20 object-cover rounded-lg border"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간 *</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => onFormChange('endTime', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">장소명 *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => onFormChange('location', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 대운동장"
                            />
                        </div>

                        {/* 위치 선택 버튼 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    행사 위치 (지도에 표시)
                                </div>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowLocationPicker(true)}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center gap-2"
                            >
                                <Navigation className="w-4 h-4" />
                                {formData.latitude && formData.longitude ? '위치 변경하기' : '지도에서 위치 선택'}
                            </button>

                            {/* 선택된 위치 표시 */}
                            {formData.latitude && formData.longitude && (
                                <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-sm text-green-700 font-medium">✅ 위치가 선택되었습니다</p>
                                    {selectedAddress && (
                                        <p className="text-xs text-green-600 mt-1">{selectedAddress}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        좌표: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 분리선 */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">📋 예약/신청 설정</h4>

                            {/* 예약 활성화 토글 */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">예약 받기</span>
                                    <p className="text-xs text-gray-500">참가 신청을 받을 수 있습니다</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onFormChange('reservationEnabled', !formData.reservationEnabled)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.reservationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.reservationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* 예약 활성화 시 추가 옵션 */}
                            {formData.reservationEnabled && (
                                <div className="space-y-4 bg-blue-50 p-4 rounded-xl">
                                    {/* 예약 방식 선택 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">예약 방식 *</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onFormChange('reservationType', 'FIRST_COME')}
                                                className={`py-3 px-4 rounded-xl text-sm font-medium transition ${formData.reservationType === 'FIRST_COME'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                ⚡ 선착순
                                                <p className="text-xs mt-1 opacity-80">신청 즉시 확정</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onFormChange('reservationType', 'SELECTION')}
                                                className={`py-3 px-4 rounded-xl text-sm font-medium transition ${formData.reservationType === 'SELECTION'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                👑 선정
                                                <p className="text-xs mt-1 opacity-80">관리자가 수락</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 최대 인원수 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">최대 인원수 *</label>
                                        <input
                                            type="number"
                                            value={formData.capacity || ''}
                                            onChange={(e) => onFormChange('capacity', e.target.value ? parseInt(e.target.value) : null)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="예: 50"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 학생 전용 토글 */}
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">학생 전용</span>
                                    <p className="text-xs text-gray-500">학생 인증된 사용자만 신청 가능</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onFormChange('isStudentOnly', !formData.isStudentOnly)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.isStudentOnly ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isStudentOnly ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>
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

            {/* 위치 선택 모달 */}
            <LocationPickerModal
                isOpen={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onSelect={(lat, lng, address) => {
                    onFormChange('latitude', lat)
                    onFormChange('longitude', lng)
                    if (address) {
                        setSelectedAddress(address)
                    }
                }}
                initialLat={formData.latitude}
                initialLng={formData.longitude}
            />
        </>
    )
}
