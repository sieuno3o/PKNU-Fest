import { useNavigate } from 'react-router-dom'
import { School, Check, GraduationCap, Building, Hash } from 'lucide-react'

interface StudentVerificationBannerProps {
  isVerified?: boolean
  studentInfo?: {
    studentEmail?: string
    studentId?: string
    department?: string
    grade?: number
  }
}

export default function StudentVerificationBanner({ isVerified, studentInfo }: StudentVerificationBannerProps) {
  const navigate = useNavigate()

  if (isVerified) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">학생 인증 완료</h3>

            {/* 학생 정보 표시 */}
            {studentInfo && (
              <div className="space-y-2 text-sm text-gray-600">
                {studentInfo.studentEmail && (
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-green-600" />
                    <span>{studentInfo.studentEmail}</span>
                  </div>
                )}
                {studentInfo.department && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-green-600" />
                    <span>{studentInfo.department}</span>
                  </div>
                )}
                {studentInfo.studentId && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-green-600" />
                    <span>{studentInfo.studentId}</span>
                  </div>
                )}
                {studentInfo.grade && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-green-600" />
                    <span>{studentInfo.grade}학년</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-3">
              부경대학교 학생으로 인증되었습니다. 학생 전용 혜택을 이용하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-sm p-6 mb-6 border border-blue-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <School className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">부경대학교 학생 인증</h3>
          <p className="text-sm text-gray-600 mb-3">
            학생 전용 행사 예약을 위해 부경대학교 학생 인증이 필요합니다.
          </p>
          <button
            onClick={() => navigate('/student-verification')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            학생 인증하기
          </button>
        </div>
      </div>
    </div>
  )
}
