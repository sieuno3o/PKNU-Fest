import { RefreshCw } from 'lucide-react'
import type { UserRole } from '@/hooks/useAuth'

interface RoleSwitcherProps {
  currentRole: UserRole
  userName: string
  onRoleSwitch: (role: UserRole) => void
}

export default function RoleSwitcher({ currentRole, userName, onRoleSwitch }: RoleSwitcherProps) {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '관리자'
      case 'vendor':
        return '업체'
      default:
        return '일반 사용자'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-gray-600" />
        역할 전환 (테스트)
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => onRoleSwitch('user')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
            currentRole === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          일반 사용자
        </button>
        <button
          onClick={() => onRoleSwitch('admin')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
            currentRole === 'admin'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          관리자
        </button>
        <button
          onClick={() => onRoleSwitch('vendor')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
            currentRole === 'vendor'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          업체
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        현재: <span className="font-medium">{userName}</span> ({getRoleLabel(currentRole)})
      </p>
    </div>
  )
}
