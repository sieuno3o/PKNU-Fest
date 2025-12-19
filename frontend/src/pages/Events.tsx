import { Link } from 'react-router-dom'
import { ChevronRight, Tent, Camera, Palette, Music, Gamepad2, Megaphone, Star } from 'lucide-react'

// 행사 목록 데이터
const EVENT_LIST = [
  {
    id: 'booths',
    title: '부스',
    description: '다양한 동아리 및 단체 부스',
    icon: Tent,
    color: 'bg-orange-500',
    link: '/booths',
  },
  {
    id: 'photobooth',
    title: '인생네컷',
    description: '추억을 남기는 포토부스',
    icon: Camera,
    color: 'bg-pink-500',
    link: '/events?category=인생네컷',
  },
  {
    id: 'asphalt',
    title: '아스팔트 낙서',
    description: '자유롭게 그리는 거리 예술',
    icon: Palette,
    color: 'bg-blue-500',
    link: '/events?category=아스팔트낙서',
  },
  {
    id: 'performance',
    title: '공연',
    description: '다양한 무대 공연',
    icon: Music,
    color: 'bg-purple-500',
    link: '/events?category=공연',
  },
  {
    id: 'game',
    title: '체험/게임',
    description: '즐거운 체험과 게임',
    icon: Gamepad2,
    color: 'bg-green-500',
    link: '/events?category=체험',
  },
  {
    id: 'announcement',
    title: '이벤트 공지',
    description: '축제 이벤트 안내',
    icon: Megaphone,
    color: 'bg-red-500',
    link: '/events?category=공지',
  },
]

export default function Events() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8" />
            <h1 className="text-2xl font-bold">축제 행사</h1>
          </div>
          <p className="text-purple-100">다양한 축제 프로그램을 즐겨보세요!</p>
        </div>
      </div>

      {/* 행사 목록 */}
      <div className="px-4 py-6">
        <div className="space-y-3">
          {EVENT_LIST.map((event) => (
            <Link
              key={event.id}
              to={event.link}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 ${event.color} rounded-xl flex items-center justify-center`}>
                <event.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
