import { QrCode } from 'lucide-react'

export default function QRScannerHeader() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
            <div className="flex items-center gap-3 mb-2">
                <QrCode className="w-8 h-8" />
                <h1 className="text-2xl font-bold">QR 스캐너</h1>
            </div>
            <p className="text-blue-100">예약 QR코드를 스캔하여 체크인하세요</p>
        </div>
    )
}
