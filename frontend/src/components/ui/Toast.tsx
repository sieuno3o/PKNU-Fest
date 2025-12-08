import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  message: string
  duration?: number
  onClose: () => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
  },
}

export function Toast({ type, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 애니메이션 후 제거
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div
        className={`${config.bgColor} ${config.textColor} rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-md`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="hover:bg-white/20 rounded-full p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Toast 컨테이너 및 Hook
interface ToastItem {
  id: string
  type: ToastType
  message: string
}

let toastQueue: ToastItem[] = []
let listeners: Array<(toasts: ToastItem[]) => void> = []

function emitChange() {
  listeners.forEach((listener) => listener([...toastQueue]))
}

export const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substring(7)
    toastQueue.push({ id, type: 'success', message })
    emitChange()
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(7)
    toastQueue.push({ id, type: 'error', message })
    emitChange()
  },
  warning: (message: string) => {
    const id = Math.random().toString(36).substring(7)
    toastQueue.push({ id, type: 'warning', message })
    emitChange()
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substring(7)
    toastQueue.push({ id, type: 'info', message })
    emitChange()
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  const removeToast = (id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    emitChange()
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="flex flex-col gap-2 items-center pt-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
