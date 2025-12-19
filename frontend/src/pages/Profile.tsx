import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Trash2, AlertTriangle, LogIn } from 'lucide-react'
import { useAuth, useUpdateProfile, useChangePassword, useDeleteAccount, type UserRole } from '../hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileCard from '@/components/profile/ProfileCard'
import StudentVerificationBanner from '@/components/profile/StudentVerificationBanner'
import SettingsMenu from '@/components/profile/SettingsMenu'
import RoleSwitcher from '@/components/profile/RoleSwitcher'
import ChangePasswordModal from '@/components/profile/ChangePasswordModal'

export default function Profile() {
  const navigate = useNavigate()
  const { user, switchRole, logout: authLogout } = useAuth()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const deleteAccountMutation = useDeleteAccount()

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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  // 로그인 안 한 경우 로그인 페이지로 안내
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500 mb-6">프로필을 보려면 먼저 로그인해주세요.</p>
          <Link
            to="/login"
            className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            로그인하기
          </Link>
          <Link
            to="/"
            className="block mt-3 text-gray-500 hover:text-gray-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 프로필 수정
  const handleSaveProfile = () => {
    updateProfileMutation.mutate(
      {
        name: editForm.name,
        phone: editForm.phone,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  // 역할 전환 (테스트용)
  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    alert(`${role === 'admin' ? '관리자' : role === 'vendor' ? '업체' : '사용자'} 모드로 전환되었습니다.`)
    window.location.reload()
  }

  // 비밀번호 변경
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    changePasswordMutation.mutate(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setShowPasswordModal(false)
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
        },
      }
    )
  }

  // 로그아웃
  const handleLogout = () => {
    const confirmed = confirm('로그아웃 하시겠습니까?')
    if (confirmed) {
      authLogout()
      navigate('/login')
    }
  }

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error('비밀번호를 입력해주세요.')
      return
    }
    deleteAccountMutation.mutate(deletePassword, {
      onSuccess: () => {
        navigate('/')
      },
    })
  }

  // 사용자가 없으면 로그인 페이지로
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <ProfileHeader />

      <div className="px-4 -mt-6">
        <ProfileCard
          user={user}
          isEditing={isEditing}
          editForm={editForm}
          isPending={updateProfileMutation.isPending}
          onEditStart={() => setIsEditing(true)}
          onEditCancel={() => {
            setIsEditing(false)
            setEditForm({ name: user.name, phone: user.phone || '' })
          }}
          onEditSave={handleSaveProfile}
          onFormChange={(field, value) => setEditForm({ ...editForm, [field]: value })}
        />

        <StudentVerificationBanner
          isVerified={user.isStudentVerified || false}
          studentInfo={{
            studentEmail: user.studentEmail,
            studentId: user.studentId,
            department: user.department,
            grade: user.grade,
          }}
        />

        <SettingsMenu onPasswordChangeClick={() => setShowPasswordModal(true)} />

        <RoleSwitcher
          currentRole={user.role}
          userName={user.name}
          onRoleSwitch={handleRoleSwitch}
        />

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm text-red-600 font-medium hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>

        {/* 회원 탈퇴 버튼 */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center justify-center gap-2 p-3 text-gray-400 text-sm hover:text-red-500 transition mt-4"
        >
          <Trash2 className="w-4 h-4" />
          회원 탈퇴
        </button>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        isPending={changePasswordMutation.isPending}
        formData={passwordForm}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        onFormChange={(field, value) => setPasswordForm({ ...passwordForm, [field]: value })}
      />

      {/* 회원 탈퇴 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">회원 탈퇴</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              정말로 탈퇴하시겠습니까?<br />
              <span className="text-red-500 font-medium">모든 예약과 주문 내역이 삭제됩니다.</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending || !deletePassword}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deleteAccountMutation.isPending ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
