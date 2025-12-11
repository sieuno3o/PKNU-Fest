import { X } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface QRCodeModalProps {
    reservation: Reservation
    onClose: () => void
}

export default function QRCodeModal({ reservation, onClose }: QRCodeModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">체크인 QR 코드</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center">
                    <h4 className="font-bold text-lg mb-2">{reservation.eventName}</h4>
                    <p className="text-sm text-gray-600 mb-6">
                        {reservation.eventDate} {reservation.eventTime}
                    </p>

                    <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                reservation.qrCode || reservation.id
                            )}`}
                            alt="QR Code"
                            className="w-full h-auto"
                        />
                    </div>

                    <p className="text-sm text-gray-600 mb-2">예약 번호</p>
                    <p className="text-lg font-mono font-bold text-gray-900 mb-6">
                        {reservation.qrCode || reservation.id}
                    </p>

                    <p className="text-xs text-gray-500">입장 시 이 QR 코드를 스캔해주세요</p>
                </div>
            </div>
        </div>
    )
}
