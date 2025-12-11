import { X, Check } from 'lucide-react'
import type { Menu } from '@/lib/api/foodtrucks'

interface MenuFormModalProps {
  isOpen: boolean
  isEditing: boolean
  formData: Partial<Menu>
  onClose: () => void
  onSubmit: () => void
  onFormChange: (field: keyof Menu, value: any) => void
}

export default function MenuFormModal({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}: MenuFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{isEditing ? '메뉴 수정' : '새 메뉴 추가'}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">메뉴 이름 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="예: 치즈 떡볶이"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => onFormChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="메뉴 설명"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">가격 *</label>
            <input
              type="number"
              value={formData.price || 0}
              onChange={(e) => onFormChange('price', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
            <input
              type="text"
              value={formData.imageUrl || ''}
              onChange={(e) => onFormChange('imageUrl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={formData.available || false}
              onChange={(e) => onFormChange('available', e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              판매 가능
            </label>
          </div>

          <button
            onClick={onSubmit}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {isEditing ? '수정 완료' : '추가 완료'}
          </button>
        </div>
      </div>
    </div>
  )
}
