import { X } from 'lucide-react'

interface ChangePasswordModalProps {
  isOpen: boolean
  isPending: boolean
  formData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  onClose: () => void
  onSubmit: () => void
  onFormChange: (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => void
}

export default function ChangePasswordModal({
  isOpen,
  isPending,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}: ChangePasswordModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">비밀번호 변경</h3>
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
              현재 비밀번호
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => onFormChange('currentPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="현재 비밀번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => onFormChange('newPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8자 이상 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => onFormChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새 비밀번호 다시 입력"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={isPending}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition mt-6 disabled:opacity-50"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                변경 중...
              </div>
            ) : (
              '변경하기'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
