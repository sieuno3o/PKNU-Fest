import { useState, useEffect } from 'react'
import { Calendar, Sparkles } from 'lucide-react'

// 축제 날짜 설정
const FEST_START = new Date('2025-05-13T00:00:00')
const FEST_END = new Date('2025-05-15T23:59:59')

function getCountdown(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

function getFestStatus() {
  const now = new Date()

  if (now < FEST_START) {
    return 'before' // 축제 전
  } else if (now <= FEST_END) {
    return 'during' // 축제 중
  } else {
    return 'after' // 축제 후
  }
}

export default function HeroBanner() {
  const [countdown, setCountdown] = useState(getCountdown(FEST_START))
  const [status, setStatus] = useState(getFestStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(FEST_START))
      setStatus(getFestStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white px-6 py-8 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />
      <div className="absolute top-1/2 right-4 text-6xl opacity-20">🎪</div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-20">🎉</div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-medium text-white/80">부경대학교 축제</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">PKNU 2025 봄 축제</h1>

        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
          <Calendar className="w-4 h-4" />
          <p className="text-sm font-medium">5월 13일 (화) - 15일 (목)</p>
        </div>

        {/* 카운트다운 또는 상태 표시 */}
        {status === 'before' && countdown && (
          <div className="mt-4">
            <p className="text-xs text-white/70 mb-2">축제까지 남은 시간</p>
            <div className="flex gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className="text-2xl font-bold">{countdown.days}</div>
                <div className="text-xs text-white/70">일</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className="text-2xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-xs text-white/70">시간</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className="text-2xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-white/70">분</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[50px]">
                <div className="text-2xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-white/70">초</div>
              </div>
            </div>
          </div>
        )}

        {status === 'during' && (
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-green-500/80 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm font-bold">축제 진행 중! 🎊</span>
            </div>
          </div>
        )}

        {status === 'after' && (
          <div className="mt-4">
            <p className="text-sm text-white/80">축제가 종료되었습니다. 내년에 만나요! 👋</p>
          </div>
        )}
      </div>
    </section>
  )
}
