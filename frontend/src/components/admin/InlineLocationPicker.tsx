import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface InlineLocationPickerProps {
    latitude?: number
    longitude?: number
    onChange: (lat: number, lng: number) => void
}

// 부경대 기본 좌표
const DEFAULT_LAT = 35.1336
const DEFAULT_LNG = 129.1062

declare global {
    interface Window {
        kakao: any
    }
}

export default function InlineLocationPicker({
    latitude,
    longitude,
    onChange,
}: InlineLocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<any>(null)
    const [marker, setMarker] = useState<any>(null)
    const [address, setAddress] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [scriptLoaded, setScriptLoaded] = useState(false)

    const currentLat = latitude || DEFAULT_LAT
    const currentLng = longitude || DEFAULT_LNG

    // Kakao Maps 스크립트 로드
    useEffect(() => {
        // 이미 로드되어 있는지 확인
        if (window.kakao && window.kakao.maps) {
            if (window.kakao.maps.LatLng) {
                setScriptLoaded(true)
            } else {
                window.kakao.maps.load(() => {
                    setScriptLoaded(true)
                })
            }
            return
        }

        // 이미 스크립트 태그가 있는지 확인
        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
        if (existingScript) {
            const checkLoaded = setInterval(() => {
                if (window.kakao && window.kakao.maps) {
                    if (window.kakao.maps.LatLng) {
                        setScriptLoaded(true)
                        clearInterval(checkLoaded)
                    } else {
                        window.kakao.maps.load(() => {
                            setScriptLoaded(true)
                            clearInterval(checkLoaded)
                        })
                    }
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
    }, [])

    // 지도 초기화
    useEffect(() => {
        if (!mapRef.current || !scriptLoaded) return

        const { kakao } = window
        const container = mapRef.current
        const options = {
            center: new kakao.maps.LatLng(currentLat, currentLng),
            level: 3,
        }

        const newMap = new kakao.maps.Map(container, options)
        setMap(newMap)

        // 마커 생성
        const newMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(currentLat, currentLng),
            map: newMap,
        })
        setMarker(newMarker)

        // 클릭 이벤트
        kakao.maps.event.addListener(newMap, 'click', (mouseEvent: any) => {
            const latlng = mouseEvent.latLng
            const newLat = latlng.getLat()
            const newLng = latlng.getLng()

            newMarker.setPosition(latlng)
            onChange(newLat, newLng)
            getAddressFromCoords(newLat, newLng)
        })

        setIsLoading(false)
        getAddressFromCoords(currentLat, currentLng)

        return () => {
            setMap(null)
            setMarker(null)
        }
    }, [scriptLoaded])

    // 외부에서 좌표 변경 시 마커 업데이트
    useEffect(() => {
        if (!map || !marker || !scriptLoaded) return

        const { kakao } = window
        const position = new kakao.maps.LatLng(currentLat, currentLng)
        marker.setPosition(position)
        map.setCenter(position)
    }, [latitude, longitude])

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

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude
                const latlng = new window.kakao.maps.LatLng(lat, lng)

                map.setCenter(latlng)
                marker.setPosition(latlng)
                onChange(lat, lng)
                getAddressFromCoords(lat, lng)
            },
            () => {
                alert('현재 위치를 가져올 수 없습니다.')
            },
            { enableHighAccuracy: true, timeout: 5000 }
        )
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    행사 위치 (맵에서 클릭하여 선택)
                </div>
            </label>

            {/* 맵 */}
            <div className="relative rounded-xl overflow-hidden border border-gray-300">
                <div
                    ref={mapRef}
                    className="w-full"
                    style={{
                        height: '250px',
                        touchAction: 'none',  // 모달 스크롤 충돌 방지
                    }}
                />

                {(isLoading || !scriptLoaded) && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-xs text-gray-500">지도 로딩 중...</p>
                        </div>
                    </div>
                )}

                {/* 현재 위치 버튼 */}
                <button
                    type="button"
                    onClick={moveToCurrentLocation}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                    title="내 위치로 이동"
                >
                    <Navigation className="w-4 h-4 text-blue-600" />
                </button>
            </div>

            {/* 선택된 위치 정보 */}
            {(latitude && longitude) && (
                <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-700 font-medium">✅ 위치가 선택되었습니다</p>
                    {address && (
                        <p className="text-xs text-green-600 mt-1">{address}</p>
                    )}
                </div>
            )}
        </div>
    )
}
