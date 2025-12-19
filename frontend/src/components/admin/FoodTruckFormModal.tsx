import { X, Check, Image, MapPin, Navigation, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import LocationPickerModal from './LocationPickerModal'
import api from '@/lib/api/client'

interface FoodTruckFormModalProps {
    isOpen: boolean
    isEditing: boolean
    formData: any
    onClose: () => void
    onSubmit: () => void
    onFormChange: (field: string, value: any) => void
}

export default function FoodTruckFormModal({
    isOpen,
    isEditing,
    formData,
    onClose,
    onSubmit,
    onFormChange,
}: FoodTruckFormModalProps) {
    const [showLocationPicker, setShowLocationPicker] = useState(false)
    const [vendors, setVendors] = useState<any[]>([])

    // 판매자 목록 조회
    useEffect(() => {
        if (isOpen) {
            const fetchVendors = async () => {
                try {
                    const response = await api.get('/admin/vendors')
                    setVendors(response.data.data)
                } catch (error) {
                    console.error('Failed to fetch vendors:', error)
                }
            }
            fetchVendors()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">
                            {isEditing ? '푸드트럭 수정' : '새 푸드트럭 추가'}
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
                                    푸드트럭 이미지 URL
                                </div>
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl || ''}
                                onChange={(e) => onFormChange('imageUrl', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/truck.jpg"
                            />
                            {formData.imageUrl && (
                                <div className="mt-2 relative">
                                    <img
                                        src={formData.imageUrl}
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
                                푸드트럭 이름 *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => onFormChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 타코야끼 마스터"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => onFormChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="푸드트럭 및 메뉴 설명"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    담당 파트너 (계정) *
                                </div>
                            </label>
                            <select
                                value={formData.ownerId || ''}
                                onChange={(e) => onFormChange('ownerId', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">담당 파트너 선택</option>
                                {vendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name} ({vendor.email})
                                    </option>
                                ))}
                            </select>
                            {vendors.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">등록된 파트너(VENDOR) 계정이 없습니다.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">장소 설명 *</label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => onFormChange('location', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 대운동장 남측 입구"
                            />
                        </div>

                        {/* 위치 선택 버튼 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    지도 상 위치 *
                                </div>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowLocationPicker(true)}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition flex items-center justify-center gap-2"
                            >
                                <Navigation className="w-4 h-4" />
                                {formData.latitude && formData.longitude ? '위치 변경하기' : '지도에서 위치 선택'}
                            </button>

                            {/* 선택된 위치 표시 */}
                            {formData.latitude && formData.longitude && (
                                <div className="mt-2 p-3 bg-orange-50 rounded-xl border border-orange-200">
                                    <p className="text-sm text-orange-700 font-medium">✅ 위치가 선택되었습니다</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        좌표: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onSubmit}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4"
                        >
                            <Check className="w-5 h-5" />
                            {isEditing ? '정보 수정 완료' : '푸드트럭 등록 완료'}
                        </button>
                    </div>
                </div>
            </div>

            <LocationPickerModal
                isOpen={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onSelect={(lat, lng) => {
                    onFormChange('latitude', lat)
                    onFormChange('longitude', lng)
                }}
                initialLat={formData.latitude}
                initialLng={formData.longitude}
            />
        </>
    )
}
