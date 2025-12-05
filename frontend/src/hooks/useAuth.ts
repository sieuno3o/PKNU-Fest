import { useState, useEffect } from 'react'

export type UserRole = 'user' | 'admin' | 'vendor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  studentId?: string
  department?: string
  isVerified?: boolean
}

// TODO: 나중에 API에서 가져올 데이터
const mockUsers: Record<string, User> = {
  user: {
    id: 'user-001',
    name: '김철수',
    email: 'kimcs@pknu.ac.kr',
    role: 'user',
    phone: '010-1234-5678',
    studentId: '202012345',
    department: '컴퓨터공학과',
    isVerified: true,
  },
  admin: {
    id: 'admin-001',
    name: '관리자',
    email: 'admin@pknu.ac.kr',
    role: 'admin',
  },
  vendor: {
    id: 'vendor-001',
    name: '푸드트럭 사장님',
    email: 'vendor@pknu.ac.kr',
    role: 'vendor',
  },
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 사용자 정보 불러오기
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      // 저장된 사용자가 없으면 기본 사용자로 자동 로그인
      const defaultUser = mockUsers.user
      setUser(defaultUser)
      localStorage.setItem('currentUser', JSON.stringify(defaultUser))
    }
    setIsLoading(false)
  }, [])

  const login = (role: UserRole = 'user') => {
    const userData = mockUsers[role]
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
  }

  const switchRole = (role: UserRole) => {
    login(role)
  }

  const isAdmin = user?.role === 'admin'
  const isVendor = user?.role === 'vendor'
  const isUser = user?.role === 'user'

  return {
    user,
    isLoading,
    login,
    logout,
    switchRole,
    isAdmin,
    isVendor,
    isUser,
  }
}
