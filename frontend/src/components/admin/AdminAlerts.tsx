import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface Alert {
    id: string
    type: 'warning' | 'error' | 'info'
    message: string
    time: string
}

interface AdminAlertsProps {
    alerts: Alert[]
}

const alertStyles = {
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: AlertCircle,
        iconColor: 'text-red-600',
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Info,
        iconColor: 'text-blue-600',
    },
}

export default function AdminAlerts({ alerts }: AdminAlertsProps) {
    if (alerts.length === 0) return null

    return (
        <div className="px-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">알림</h3>
            <div className="space-y-2">
                {alerts.map((alert) => {
                    const style = alertStyles[alert.type]
                    const Icon = style.icon
                    return (
                        <div
                            key={alert.id}
                            className={`${style.bg} border ${style.border} rounded-xl p-3 flex items-start gap-3`}
                        >
                            <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5`} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
