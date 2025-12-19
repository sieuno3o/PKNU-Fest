import { Link } from 'react-router-dom'
import { Calendar, Users, QrCode, Store, BarChart3, Bell } from 'lucide-react'

const quickActions = [
    {
        icon: Calendar,
        label: '행사 관리',
        href: '/admin/events',
        color: 'from-purple-500 to-indigo-500',
    },
    {
        icon: Users,
        label: '예약 관리',
        href: '/admin/reservations',
        color: 'from-pink-500 to-rose-500',
    },
    {
        icon: QrCode,
        label: 'QR 스캐너',
        href: '/admin/qr-scanner',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        icon: Store,
        label: '푸드트럭',
        href: '/admin/foodtrucks',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: BarChart3,
        label: '통계',
        href: '/admin/stats',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Bell,
        label: '알림',
        href: '#notifications',
        color: 'from-yellow-500 to-orange-500',
        isAction: true,
    },
]

export default function AdminQuickActions() {
    const handleActionClick = (href: string, isAction?: boolean) => {
        if (isAction && href === '#notifications') {
            const element = document.getElementById('notification-sender')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <div className="px-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">빠른 액션</h3>
            <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action) => {
                    const ActionWrapper = (action as any).isAction ? 'button' : Link
                    const actionProps = (action as any).isAction
                        ? { onClick: () => handleActionClick(action.href, true) }
                        : { to: action.href }

                    return (
                        <ActionWrapper
                            key={action.href}
                            {...actionProps as any}
                            className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
                        >
                            <div
                                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2`}
                            >
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-700 font-medium text-center">
                                {action.label}
                            </span>
                        </ActionWrapper>
                    )
                })}
            </div>
        </div>
    )
}
