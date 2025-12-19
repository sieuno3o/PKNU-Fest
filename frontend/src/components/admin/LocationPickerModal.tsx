import { useEffect, useRef, useState } from 'react'
import { X, MapPin, Navigation, Check } from 'lucide-react'

interface LocationPickerModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (lat: number, lng: number, address?: string) => void
    initialLat?: number
    initialLng?: number
}

// 부경대 기본 좌표
const DEFAULT_LAT = 35.1336
const DEFAULT_LNG = 129.1062

declare global {
    interface Window {
        kakao: any
    }
}

export default function LocationPickerModal({
    isOpen,
    onClose,
    onSelect,
    initialLat,
    initialLng,
}: LocationPickerModalProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<any>(null)
    const [marker, setMarker] = useState<any>(null)
    const [selectedLat, setSelectedLat] = useState(initialLat || DEFAULT_LAT)
    const [selectedLng, setSelectedLng] = useState(initialLng || DEFAULT_LNG)
    const [address, setAddress] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [scriptLoaded, setScriptLoaded] = useState(false)

    // Kakao Maps 스크립트 로드
    useEffect(() => {
        if (!isOpen) return

        // 이미 로드되어 있는지 확인
        if (window.kakao && window.kakao.maps) {
            setScriptLoaded(true)
            return
        }

        // 이미 스크립트 태그가 있는지 확인
        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
        if (existingScript) {
            // 스크립트가 있지만 아직 로드 중일 수 있음
            const checkLoaded = setInterval(() => {
                if (window.kakao && window.kakao.maps) {
                    window.kakao.maps.load(() => {
                        setScriptLoaded(true)
                        clearInterval(checkLoaded)
                    })
                }
            }, 100)
            return () => clearInterval(checkLoaded)
        }

        const script = document.createElement('script')
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
        script.async = true

        script.onload = () => {
            window.kakao.maps.load(() => {
                setScriptLoaded(true)
            })
        }

        document.head.appendChild(script)
    }, [isOpen])

    // 지도 초기화 (한 번만 실행)
    useEffect(() => {
        if (!isOpen || !mapRef.current || !scriptLoaded) return
        if (!window.kakao || !window.kakao.maps) return
        if (map) return // 이미 지도가 있으면 스킵

        const { kakao } = window
        const container = mapRef.current

        // 초기 좌표 설정
        const startLat = initialLat || DEFAULT_LAT
        const startLng = initialLng || DEFAULT_LNG

        const options = {
            center: new kakao.maps.LatLng(startLat, startLng),
            level: 3,
        }

        const newMap = new kakao.maps.Map(container, options)
        setMap(newMap)

        // 마커 생성
        const newMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(startLat, startLng),
            map: newMap,
        })
        setMarker(newMarker)

        // 초기 좌표 저장
        setSelectedLat(startLat)
        setSelectedLng(startLng)

        // 클릭 이벤트
        kakao.maps.event.addListener(newMap, 'click', (mouseEvent: any) => {
            const latlng = mouseEvent.latLng
            const clickedLat = latlng.getLat()
            const clickedLng = latlng.getLng()

            console.log('Map clicked - lat:', clickedLat, 'lng:', clickedLng)

            // 마커 위치 변경
            newMarker.setPosition(latlng)

            // 상태 업데이트
            setSelectedLat(clickedLat)
            setSelectedLng(clickedLng)

            // 주소 검색
            getAddressFromCoords(clickedLat, clickedLng)
        })

        setIsLoading(false)
        getAddressFromCoords(startLat, startLng)

        return () => {
            setMap(null)
            setMarker(null)
        }
    }, [isOpen, scriptLoaded]) // initialLat, initialLng 제거

    // 좌표로 주소 검색
    const getAddressFromCoords = (lat: number, lng: number) => {
        if (!window.kakao || !window.kakao.maps.services) return

        const geocoder = new window.kakao.maps.services.Geocoder()
        const coords = new window.kakao.maps.LatLng(lat, lng)

        geocoder.coord2Address(coords.getLng(), coords.getLat(), (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0]?.address?.address_name || ''
                setAddress(addr)
            }
        })
    }

    // 현재 위치로 이동
    const moveToCurrentLocation = () => {
        if (!navigator.geolocation || !map || !marker) return

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude
                const latlng = new window.kakao.maps.LatLng(lat, lng)

                map.setCenter(latlng)
                marker.setPosition(latlng)
                setSelectedLat(lat)
                setSelectedLng(lng)
                getAddressFromCoords(lat, lng)
                setIsLoading(false)
            },
            () => {
                alert('현재 위치를 가져올 수 없습니다.')
                setIsLoading(false)
            },
            { enableHighAccuracy: true, timeout: 5000 }
        )
    }

    const handleConfirm = () => {
        console.log('LocationPickerModal handleConfirm - selectedLat:', selectedLat, 'selectedLng:', selectedLng)
        onSelect(selectedLat, selectedLng, address)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold">위치 선택</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 맵 */}
                <div className="relative">
                    <div
                        ref={mapRef}
                        className="w-full h-80"
                        style={{ minHeight: '320px' }}
                    />

                    {(isLoading || !scriptLoaded) && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-sm text-gray-500">지도 로딩 중...</p>
                            </div>
                        </div>
                    )}

                    {/* 현재 위치 버튼 */}
                    <button
                        onClick={moveToCurrentLocation}
                        className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                        title="내 위치로 이동"
                    >
                        <Navigation className="w-5 h-5 text-blue-600" />
                    </button>
                </div>

                {/* 선택된 위치 정보 */}
                <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-600 mb-1">선택된 위치</p>
                    {address && (
                        <p className="font-medium text-gray-900 mb-2">{address}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        위도: {selectedLat.toFixed(6)}, 경도: {selectedLng.toFixed(6)}
                    </p>
                </div>

                {/* 버튼 */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleConfirm}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        이 위치 선택
                    </button>
                </div>
            </div>
        </div>
    )
}

