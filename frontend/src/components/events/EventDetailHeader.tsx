import { ChevronLeft, Heart, Share2 } from 'lucide-react'
import type { Event } from '@/lib/api/events'

// Helper functions
const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        '공연': 'from-pink-500 to-purple-600',
        '체험': 'from-orange-500 to-red-600',
        '게임': 'from-blue-500 to-cyan-600',
        '토크': 'from-indigo-500 to-purple-600',
        '기타': 'from-green-500 to-emerald-600',
    }
    return colors[category] || 'from-gray-500 to-gray-600'
}

const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
        '공연': '🎵',
        '체험': '🎨',
        '게임': '🎮',
        '토크': '💬',
        '기타': '🎪',
    }
    return emojis[category] || '🎪'
}

interface EventDetailHeaderProps {
    event: Event
    isLiked: boolean
    onBack: () => void
    onLike: () => void
    onShare: () => void
}

export default function EventDetailHeader({
    event,
    isLiked,
    onBack,
    onLike,
    onShare,
}: EventDetailHeaderProps) {

    return (
        <div className={`relative bg-gradient-to-br ${getCategoryColor(event.category)} text-white`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative p-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onLike}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                        </button>
                        <button
                            onClick={onShare}
                            className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="pb-6">
                    {(event.image || event.thumbnail) ? (
                        <img
                            src={event.image || event.thumbnail}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-2xl mb-4"
                        />
                    ) : (
                        <div className="w-full h-48 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-6xl">{getCategoryEmoji(event.category)}</span>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                            {event.category}
                        </span>
                        {event.tags?.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-white/10 rounded-full text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { getCategoryColor, getCategoryEmoji }
