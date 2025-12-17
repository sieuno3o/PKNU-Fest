import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useResetPassword } from '../hooks/useAuth'

export default function ResetPassword() {
    const { token } = useParams<{ token: string }>()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const resetPasswordMutation = useResetPassword()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        if (password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.')
            return
        }

        if (!token) {
            setError('유효하지 않은 링크입니다.')
            return
        }

        resetPasswordMutation.mutate(
            { token, password },
            {
                onSuccess: () => {
                    setIsSuccess(true)
                },
                onError: () => {
                    setError('비밀번호 재설정에 실패했습니다. 링크가 만료되었을 수 있습니다.')
                },
            }
        )
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        비밀번호가 재설정되었습니다!
                    </h1>

                    <p className="text-gray-600 mb-6">
                        새 비밀번호로 로그인해주세요.
                    </p>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        )
    }

    // Invalid token state
    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        유효하지 않은 링크입니다
                    </h1>

                    <p className="text-gray-600 mb-6">
                        비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
                        <br />
                        다시 요청해주세요.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="block w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition text-center"
                    >
                        비밀번호 찾기로 이동
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
                        <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        새 비밀번호 설정
                    </h1>
                    <p className="text-gray-600">
                        새로 사용할 비밀번호를 입력해주세요.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            새 비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8자 이상 입력"
                            required
                            minLength={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="비밀번호를 다시 입력"
                            required
                            minLength={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={resetPasswordMutation.isPending || !password || !confirmPassword}
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {resetPasswordMutation.isPending ? '처리 중...' : '비밀번호 변경하기'}
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
