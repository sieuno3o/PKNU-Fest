import { Link } from 'react-router-dom'
import { MapPin, Calendar, UtensilsCrossed } from 'lucide-react'

export default function QuickLinks() {
  const links = [
    {
      to: '/map',
      icon: MapPin,
      label: '전체 지도',
      gradient: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
      iconBg: 'bg-blue-600',
    },
    {
      to: '/events',
      icon: Calendar,
      label: '행사 목록',
      gradient: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
      iconBg: 'bg-purple-600',
    },
    {
      to: '/foodtrucks',
      icon: UtensilsCrossed,
      label: '푸드트럭',
      gradient: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200',
      iconBg: 'bg-orange-600',
    },
  ]

  return (
    <section className="px-4 py-6 bg-white">
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>빠른 바로가기</span>
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`group flex flex-col items-center justify-center p-5 bg-gradient-to-br ${link.gradient} rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md`}
          >
            <div className={`w-12 h-12 ${link.iconBg} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <link.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
