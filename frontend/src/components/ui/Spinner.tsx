import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fullScreen?: boolean
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

export default function Spinner({ size = 'md', className = '', fullScreen = false, text }: SpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

// 페이지 로딩용 풀스크린 스피너
export function PageSpinner({ text = '로딩중...' }: { text?: string }) {
  return <Spinner size="lg" fullScreen text={text} />
}

// 버튼 내부용 작은 스피너
export function ButtonSpinner() {
  return <Loader2 className="w-4 h-4 animate-spin" />
}

// 인라인 스피너 (텍스트와 함께)
export function InlineSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Loader2 className="w-4 h-4 animate-spin" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}
