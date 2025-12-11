import { useNavigate } from 'react-router-dom'
import { Lock, User, ChevronRight } from 'lucide-react'

interface SettingsMenuProps {
  onPasswordChangeClick: () => void
}

export default function SettingsMenu({ onPasswordChangeClick }: SettingsMenuProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <button
        onClick={onPasswordChangeClick}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="text-gray-900 font-medium">비밀번호 변경</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      <button
        onClick={() => navigate('/my-reservations')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-gray-900 font-medium">내 예약</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}
