import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRequestStudentVerification, useVerifyStudent } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'

export default function StudentVerification() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [studentEmail, setStudentEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const sendCodeMutation = useRequestStudentVerification()
  const verifyCodeMutation = useVerifyStudent()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    // 이메일 형식 검증
    if (!studentEmail.endsWith('@pukyong.ac.kr')) {
      toast.error('@pukyong.ac.kr 이메일만 사용 가능합니다')
      return
    }

    sendCodeMutation.mutate(
      { studentEmail },
      {
        onSuccess: () => {
          setStep('code')
        },
      }
    )
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    verifyCodeMutation.mutate(
      { code: verificationCode },
      {
        onSuccess: () => {
          toast.success('학생 인증이 완료되었습니다!')
          navigate('/')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => step === 'code' ? setStep('email') : navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* 나중에 하기 버튼 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition"
      >
        나중에 하기
      </button>

      <div className="w-full max-w-md">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-2">학생 인증</h1>
          <p className="text-white/80">
            학생 전용 행사를 이용하려면 인증이 필요해요
          </p>
        </div>

        {/* 인증 폼 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {step === 'email' ? (
            // Step 1: 학생 이메일 입력
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                학교 이메일 입력
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                부경대학교 이메일 주소로 인증 코드를 보내드려요
              </p>

              <form onSubmit={handleSendCode} className="space-y-5">
                {/* 학생 이메일 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학교 이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="student@pukyong.ac.kr"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    @pukyong.ac.kr 이메일만 사용 가능합니다
                  </p>
                </div>

                {/* 인증 코드 발송 버튼 */}
                <button
                  type="submit"
                  disabled={sendCodeMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendCodeMutation.isPending ? '전송 중...' : '인증 코드 받기'}
                </button>
              </form>
            </div>
          ) : (
            // Step 2: 인증 코드 입력
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                인증 코드 입력
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-blue-600">{studentEmail}</span>로
                전송된 6자리 코드를 입력해주세요
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-5">
                {/* 인증 코드 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인증 코드
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-2xl tracking-widest py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    코드가 오지 않았나요?{' '}
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      다시 받기
                    </button>
                  </p>
                </div>

                {/* 인증하기 버튼 */}
                <button
                  type="submit"
                  disabled={verifyCodeMutation.isPending || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyCodeMutation.isPending ? '인증 중...' : '인증하기'}
                </button>
              </form>
            </div>
          )}

          {/* 안내사항 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">학생 인증 혜택</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• 학생 전용 행사 예약</li>
                  <li>• 할인 혜택 제공</li>
                  <li>• 우선 예약 기회</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
