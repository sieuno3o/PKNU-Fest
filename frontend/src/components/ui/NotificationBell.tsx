import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Trash2, X } from 'lucide-react'
import { useNotificationStore, type Notification } from '@/stores/notificationStore'

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
        useNotificationStore()

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 시간 포맷
    const formatTime = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - new Date(date).getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return '방금 전'
        if (diffMins < 60) return `${diffMins}분 전`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`
        return `${Math.floor(diffMins / 1440)}일 전`
    }

    // 알림 타입별 색상
    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'reservation': return 'bg-green-500'
            case 'order': return 'bg-blue-500'
            case 'event': return 'bg-purple-500'
            case 'warning': return 'bg-orange-500'
            default: return 'bg-gray-500'
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id)
        if (notification.link) {
            setIsOpen(false)
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 알림 벨 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* 드롭다운 */}
            {isOpen && (
                <div className="fixed right-2 top-14 w-80 max-w-[calc(100vw-16px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-900">알림</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    모두 읽음
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 알림 목록 */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>알림이 없습니다</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`relative px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {notification.link ? (
                                        <Link to={notification.link} className="block">
                                            <NotificationContent notification={notification} formatTime={formatTime} getTypeColor={getTypeColor} />
                                        </Link>
                                    ) : (
                                        <NotificationContent notification={notification} formatTime={formatTime} getTypeColor={getTypeColor} />
                                    )}

                                    {/* 삭제 버튼 */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeNotification(notification.id)
                                        }}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// 알림 내용 컴포넌트
function NotificationContent({
    notification,
    formatTime,
    getTypeColor
}: {
    notification: Notification
    formatTime: (date: Date) => string
    getTypeColor: (type: Notification['type']) => string
}) {
    return (
        <div className="flex items-start gap-3 pr-6">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getTypeColor(notification.type)}`} />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatTime(notification.time)}</p>
            </div>
            {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
        </div>
    )
}
