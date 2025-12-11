import { Calendar } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white px-6 py-10 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

      <div className="relative text-center">
        <div className="text-5xl mb-3 animate-bounce">🎪</div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">PKNU 2025 봄 축제</h1>
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <Calendar className="w-4 h-4" />
          <p className="text-sm font-medium">5월 13일 - 15일</p>
        </div>
      </div>
    </section>
  )
}
