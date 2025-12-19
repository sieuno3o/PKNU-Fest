import { Bell, AlertTriangle, Info } from 'lucide-react'

interface Notice {
  id: string
  type: 'info' | 'warning' | 'important'
  message: string
}

export default function Notices() {
  // 축제 관련 주요 공지사항
  const notices: Notice[] = [
    {
      id: '1',
      type: 'important',
      message: '축제 기간 중 캠퍼스 주차는 불가합니다. 대중교통을 이용해주세요.',
    },
    {
      id: '2',
      type: 'warning',
      message: '우천 시 야외 행사는 취소되거나 연기될 수 있습니다.',
    },
    {
      id: '3',
      type: 'info',
      message: '음식물 반입은 지정 구역에서만 허용됩니다.',
    },
  ]

  const getIcon = (type: Notice['type']) => {
    switch (type) {
      case 'important':
        return <Bell className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getBorderColor = (type: Notice['type']) => {
    switch (type) {
      case 'important':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      default:
        return 'border-l-blue-500'
    }
  }

  return (
    <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📢</span>
        <span>공지사항</span>
      </h2>

      <div className="space-y-2">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`flex items-start gap-3 p-4 bg-white rounded-xl border-l-4 ${getBorderColor(notice.type)} shadow-sm`}
          >
            <div className="mt-0.5">{getIcon(notice.type)}</div>
            <p className="text-sm text-gray-700 leading-relaxed">{notice.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
