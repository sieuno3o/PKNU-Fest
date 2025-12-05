import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  School,
  Lock,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
  RefreshCw,
} from 'lucide-react'
import { useAuth, type UserRole } from '../hooks/useAuth'

export default function Profile() {
  const navigate = useNavigate()
  const { user, switchRole, logout: authLogout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 프로필 수정
  const handleSaveProfile = () => {
    // TODO: API 호출로 수정
    setIsEditing(false)
    alert('프로필이 수정되었습니다.')
  }

  // 역할 전환 (테스트용)
  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    alert(`${role === 'admin' ? '관리자' : role === 'vendor' ? '업체' : '사용자'} 모드로 전환되었습니다.`)
    window.location.reload() // 페이지 새로고침으로 UI 업데이트
  }

  // 비밀번호 변경
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    alert('비밀번호가 변경되었습니다.')
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  // 로그아웃
  const handleLogout = () => {
    const confirmed = confirm('로그아웃 하시겠습니까?')
    if (confirmed) {
      authLogout()
      navigate('/login')
    }
  }

  // 사용자가 없으면 로그인 페이지로
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-12">
        <h1 className="text-2xl font-bold mb-2">프로필</h1>
        <p className="text-blue-100">내 정보를 확인하고 관리하세요</p>
      </div>

      <div className="px-4 -mt-6">
        {/* 프로필 카드 */}
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
                onClick={() => setIsEditing(true)}
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
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                )}
              </div>
            </div>

            {/* 학번 */}
            <div className="flex items-center gap-3">
              <School className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">학번</p>
                <p className="text-gray-900 font-medium">{user.studentId}</p>
              </div>
            </div>
          </div>

          {/* 수정 버튼 */}
          {isEditing && (
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                저장
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditForm({ name: user.name, phone: user.phone })
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          )}
        </div>

        {/* 설정 메뉴 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <button
            onClick={() => setShowPasswordModal(true)}
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

        {/* 역할 전환 (테스트용) */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gray-600" />
            역할 전환 (테스트)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleRoleSwitch('user')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
                user.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              일반 사용자
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
                user.role === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              관리자
            </button>
            <button
              onClick={() => handleRoleSwitch('vendor')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${
                user.role === 'vendor'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              업체
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            현재: <span className="font-medium">{user.name}</span> ({user.role === 'admin' ? '관리자' : user.role === 'vendor' ? '업체' : '일반 사용자'})
          </p>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm text-red-600 font-medium hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">비밀번호 변경</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
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
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
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
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
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
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition mt-6"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
