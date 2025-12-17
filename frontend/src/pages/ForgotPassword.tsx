import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRequestPasswordReset } from '../hooks/useAuth'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const requestResetMutation = useRequestPasswordReset()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        requestResetMutation.mutate(email, {
            onSuccess: () => {
                setIsSubmitted(true)
            },
        })
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        이메일을 확인해주세요
                    </h1>

                    <p className="text-gray-600 mb-6">
                        <span className="font-medium text-purple-600">{email}</span>
                        <br />
                        위 이메일로 비밀번호 재설정 링크를 보냈습니다.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            ⚠️ 이메일이 보이지 않으면 스팸함을 확인해주세요.
                            <br />
                            링크는 30분간 유효합니다.
                        </p>
                    </div>

                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        로그인으로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        비밀번호를 잊으셨나요?
                    </h1>
                    <p className="text-gray-600">
                        가입할 때 사용한 이메일을 입력하시면
                        <br />
                        비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={requestResetMutation.isPending || !email}
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {requestResetMutation.isPending ? '전송 중...' : '재설정 링크 보내기'}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        로그인으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    )
}
