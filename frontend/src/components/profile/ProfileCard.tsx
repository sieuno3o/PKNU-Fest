import { User, Mail, Phone, Edit2, Check, X } from 'lucide-react'

interface ProfileCardProps {
  user: {
    name: string
    email: string
    phone?: string
    studentId?: string
    department?: string
    isVerified?: boolean
  }
  isEditing: boolean
  editForm: { name: string; phone: string }
  isPending: boolean
  onEditStart: () => void
  onEditCancel: () => void
  onEditSave: () => void
  onFormChange: (field: 'name' | 'phone', value: string) => void
}

export default function ProfileCard({
  user,
  isEditing,
  editForm,
  isPending,
  onEditStart,
  onEditCancel,
  onEditSave,
  onFormChange,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.department}</p>
            {user.isVerified && (
              <div className="flex items-center gap-1 mt-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">학생 인증 완료</span>
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={onEditStart}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="space-y-4">
        {/* 이름 */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <User className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">이름</p>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.name}</p>
            )}
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <Mail className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">이메일</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <Phone className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">전화번호</p>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* 수정 버튼 */}
      {isEditing && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={onEditSave}
            disabled={isPending}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                저장 중...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                저장
              </>
            )}
          </button>
          <button
            onClick={onEditCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
          >
            <X className="w-4 h-4" />
            취소
          </button>
        </div>
      )}
    </div>
  )
}
