import { useState } from 'react'
import { Send, Users, Store, Loader2, CheckCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { toast } from '@/components/ui/Toast'

type NotificationTarget = 'USER' | 'VENDOR' | 'ALL'

interface SendNotificationRequest {
    target: NotificationTarget
    title: string
    message: string
}

export default function AdminNotificationSender() {
    const [target, setTarget] = useState<NotificationTarget>('USER')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)

    const sendNotification = useMutation({
        mutationFn: async (data: SendNotificationRequest) => {
            const response = await apiClient.post('/admin/notifications', data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(`${data.data?.targetCount || 0}명에게 알림이 발송되었습니다`)
            setTitle('')
            setMessage('')
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        },
        onError: () => {
            toast.error('알림 발송에 실패했습니다')
        },
    })

    const handleSubmit = () => {
        if (!title.trim() || !message.trim()) {
            toast.error('제목과 내용을 모두 입력해주세요')
            return
        }
        sendNotification.mutate({ target, title: title.trim(), message: message.trim() })
    }

    const targetOptions = [
        { value: 'USER' as const, label: '일반 사용자', icon: Users, color: 'from-blue-500 to-cyan-500' },
        { value: 'VENDOR' as const, label: '푸드트럭 사장님', icon: Store, color: 'from-orange-500 to-red-500' },
    ]

    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    알림 발송
                </h3>

                {/* 대상 선택 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">발송 대상</label>
                    <div className="grid grid-cols-2 gap-2">
                        {targetOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTarget(option.value)}
                                className={`p-3 rounded-xl border-2 transition-all ${target === option.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-2`}>
                                    <option.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-sm font-medium ${target === option.value ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 제목 */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="알림 제목을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        maxLength={50}
                    />
                </div>

                {/* 내용 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="알림 내용을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        rows={3}
                        maxLength={200}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{message.length}/200</div>
                </div>

                {/* 발송 버튼 */}
                <button
                    onClick={handleSubmit}
                    disabled={sendNotification.isPending || !title.trim() || !message.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sendNotification.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            발송 중...
                        </>
                    ) : showSuccess ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            발송 완료!
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            알림 발송
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
