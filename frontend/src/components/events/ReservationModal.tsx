import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Event } from '@/lib/api/events'
import { useCreateReservation } from '@/hooks/useReservations'
import { toast } from '@/components/ui/Toast'

interface ReservationModalProps {
    event: Event
    onClose: () => void
}

export default function ReservationModal({ event, onClose }: ReservationModalProps) {
    const [attendees, setAttendees] = useState(1)
    const createReservation = useCreateReservation()

    const handleSubmit = async () => {
        try {
            await createReservation.mutateAsync({
                eventId: event.id,
                partySize: attendees,
            })
            toast.success('예약이 완료되었습니다!')
            onClose()
        } catch (error) {
            toast.error('예약에 실패했습니다.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white rounded-t-3xl w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">예약하기</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                        {event.date} {event.startTime} | {event.location}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        인원 수
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setAttendees(Math.max(1, attendees - 1))}
                            className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
                        >
                            -
                        </button>
                        <span className="text-2xl font-bold w-12 text-center">{attendees}</span>
                        <button
                            onClick={() => setAttendees(Math.min(10, attendees + 1))}
                            className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={createReservation.isPending}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                >
                    <Check className="w-5 h-5" />
                    {createReservation.isPending ? '예약 중...' : '예약 확정'}
                </button>
            </div>
        </div>
    )
}
