import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth, useUpdateProfile, useChangePassword, type UserRole } from '../hooks/useAuth'
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
    switchRole()
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

        <StudentVerificationBanner isVerified={user.isVerified || false} />

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
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        isPending={changePasswordMutation.isPending}
        formData={passwordForm}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        onFormChange={(field, value) => setPasswordForm({ ...passwordForm, [field]: value })}
      />
    </div>
  )
}
