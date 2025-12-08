import { useEffect, useState, type ReactNode } from 'react'

interface AnimatedProps {
  children: ReactNode
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-in-right' | 'slide-in-left' | 'scale-in' | 'bounce-in'
  delay?: number
  duration?: number
  className?: string
}

export default function Animated({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 300,
  className = '',
}: AnimatedProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`${isVisible ? `animate-${animation}` : 'opacity-0'} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

// 스태거드 애니메이션 (순차적으로 나타남)
interface StaggeredProps {
  children: ReactNode[]
  animation?: AnimatedProps['animation']
  staggerDelay?: number
  className?: string
}

export function Staggered({
  children,
  animation = 'fade-in',
  staggerDelay = 100,
  className = '',
}: StaggeredProps) {
  return (
    <>
      {children.map((child, index) => (
        <Animated
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          className={className}
        >
          {child}
        </Animated>
      ))}
    </>
  )
}

// 페이드 인/아웃 전환
interface FadeTransitionProps {
  show: boolean
  children: ReactNode
  className?: string
}

export function FadeTransition({ show, children, className = '' }: FadeTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) setShouldRender(true)
  }, [show])

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false)
  }

  return shouldRender ? (
    <div
      className={`${show ? 'animate-fade-in' : 'animate-fade-out'} ${className}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null
}

// 슬라이드 전환
interface SlideTransitionProps {
  show: boolean
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function SlideTransition({
  show,
  children,
  direction = 'up',
  className = '',
}: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) setShouldRender(true)
  }, [show])

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false)
  }

  const animationClass = show
    ? direction === 'up'
      ? 'animate-slide-up'
      : direction === 'down'
        ? 'animate-slide-down'
        : direction === 'left'
          ? 'animate-slide-in-left'
          : 'animate-slide-in-right'
    : 'animate-fade-out'

  return shouldRender ? (
    <div className={`${animationClass} ${className}`} onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  ) : null
}

// 인터섹션 옵저버를 사용한 뷰포트 진입 애니메이션
interface ViewportAnimatedProps {
  children: ReactNode
  animation?: AnimatedProps['animation']
  threshold?: number
  className?: string
}

export function ViewportAnimated({
  children,
  animation = 'fade-in',
  threshold = 0.1,
  className = '',
}: ViewportAnimatedProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold])

  return (
    <div
      ref={setRef}
      className={`${isVisible ? `animate-${animation}` : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
