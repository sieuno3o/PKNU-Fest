import { Link } from 'react-router-dom'
import { UtensilsCrossed, BarChart3, ClipboardList, Settings } from 'lucide-react'

const quickLinks = [
    {
        icon: UtensilsCrossed,
        label: '메뉴 관리',
        href: '/vendor/menu',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: ClipboardList,
        label: '주문 관리',
        href: '/vendor/orders',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: BarChart3,
        label: '매출 리포트',
        href: '/vendor/sales',
        color: 'from-purple-500 to-indigo-500',
    },
    {
        icon: Settings,
        label: '설정',
        href: '/vendor/settings',
        color: 'from-gray-500 to-gray-600',
    },
]

export default function DashboardQuickLinks() {
    return (
        <div className="px-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">빠른 메뉴</h3>
            <div className="grid grid-cols-4 gap-3">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className="flex flex-col items-center"
                    >
                        <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-2 shadow-lg`}
                        >
                            <link.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium text-center">
                            {link.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
