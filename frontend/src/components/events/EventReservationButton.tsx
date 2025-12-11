import { Ticket } from 'lucide-react'
import type { Event } from '@/lib/api/events'

interface EventReservationButtonProps {
    event: Event
    onReservation: () => void
}

export default function EventReservationButton({ event, onReservation }: EventReservationButtonProps) {
    const isFull = event.currentReservations >= event.capacity

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
            <button
                onClick={onReservation}
                disabled={isFull}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition ${isFull
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl'
                    }`}
            >
                <Ticket className="w-6 h-6" />
                {isFull ? '예약 마감' : '예약하기'}
            </button>
        </div>
    )
}
