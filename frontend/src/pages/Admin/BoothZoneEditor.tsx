import { useEffect, useRef, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { boothZoneApi } from '@/lib/api/boothZones'
import type { BoothZone } from '@/lib/api/boothZones'

// 부경대학교 중심 좌표
const PKNU_CENTER = { lat: 35.134, lng: 129.104 }

// 색상 옵션 (구역 종류별 색상)
const COLOR_OPTIONS = [
    { value: '#A7F3D0', name: '🎪 부스' },
    { value: '#FDE68A', name: '🎵 행사' },
    { value: '#FED7AA', name: '🍔 푸드트럭' },
    { value: '#E5E7EB', name: '✨ 기타' },
]

declare global {
    interface Window {
        kakao: any
    }
}

export default function BoothZoneEditor() {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<any>(null)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [zones, setZones] = useState<BoothZone[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDrawing, setIsDrawing] = useState(false)
    const isDrawingRef = useRef(false) // 클릭 이벤트용 ref
    const [currentPoints, setCurrentPoints] = useState<{ lat: number; lng: number }[]>([])
    const [tempMarkers, setTempMarkers] = useState<any[]>([])
    const [tempPolygon, setTempPolygon] = useState<any>(null)
    const [drawnElements, setDrawnElements] = useState<any[]>([])

    // 새 구역 설정
    const [newZoneName, setNewZoneName] = useState('부스')
    const [newZoneColor, setNewZoneColor] = useState('#A7F3D0')
    const [newZoneIcon, setNewZoneIcon] = useState('🎪')
    const [showNewZoneModal, setShowNewZoneModal] = useState(false)

    // isDrawing 상태 동기화
    useEffect(() => {
        isDrawingRef.current = isDrawing
    }, [isDrawing])

    // 초기화 시 API에서 구역 불러오기
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const data = await boothZoneApi.getAll()
                setZones(data)
            } catch (error) {
                console.error('Failed to fetch booth zones:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchZones()
    }, [])

    // 카카오맵 스크립트 로드
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            if (window.kakao.maps.LatLng) {
                setScriptLoaded(true)
            } else {
                window.kakao.maps.load(() => setScriptLoaded(true))
            }
            return
        }

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
            window.kakao.maps.load(() => setScriptLoaded(true))
        }
        document.head.appendChild(script)
    }, [])

    // 지도 초기화
    useEffect(() => {
        if (!mapRef.current || !scriptLoaded) return

        const { kakao } = window
        const options = {
            center: new kakao.maps.LatLng(PKNU_CENTER.lat, PKNU_CENTER.lng),
            level: 2,
        }

        const newMap = new kakao.maps.Map(mapRef.current, options)
        setMap(newMap)

        // 클릭 이벤트 - ref를 사용하여 최신 isDrawing 값 참조
        kakao.maps.event.addListener(newMap, 'click', (mouseEvent: any) => {
            if (!isDrawingRef.current) return

            const latlng = mouseEvent.latLng
            const point = { lat: latlng.getLat(), lng: latlng.getLng() }

            setCurrentPoints(prev => [...prev, point])
        })
    }, [scriptLoaded])

    // 현재 그리는 중인 폴리곤 업데이트
    useEffect(() => {
        if (!map || !window.kakao) return

        const { kakao } = window

        // 기존 마커/폴리곤 제거
        tempMarkers.forEach(m => m.setMap(null))
        if (tempPolygon) tempPolygon.setMap(null)

        if (currentPoints.length === 0) return

        const newMarkers: any[] = []

        // 포인트 마커 표시
        currentPoints.forEach((point, idx) => {
            const marker = new kakao.maps.CustomOverlay({
                position: new kakao.maps.LatLng(point.lat, point.lng),
                content: `<div style="
          width: 24px; height: 24px;
          background: ${newZoneColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${idx + 1}</div>`,
                yAnchor: 0.5,
            })
            marker.setMap(map)
            newMarkers.push(marker)
        })

        setTempMarkers(newMarkers)

        // 폴리곤 미리보기
        if (currentPoints.length >= 3) {
            const path = currentPoints.map(p => new kakao.maps.LatLng(p.lat, p.lng))
            const polygon = new kakao.maps.Polygon({
                path,
                strokeWeight: 3,
                strokeColor: newZoneColor,
                strokeOpacity: 0.9,
                fillColor: newZoneColor,
                fillOpacity: 0.3,
            })
            polygon.setMap(map)
            setTempPolygon(polygon)
        }
    }, [currentPoints, map, newZoneColor])

    // 저장된 구역 표시
    useEffect(() => {
        if (!map || !window.kakao) return

        const { kakao } = window

        console.log('Drawing zones:', zones) // 디버깅용

        // 기존 요소 제거
        drawnElements.forEach(el => el.setMap(null))

        const newElements: any[] = []

        zones.forEach(zone => {
            // 폴리곤
            const path = zone.bounds.map(p => new kakao.maps.LatLng(p.lat, p.lng))
            const polygon = new kakao.maps.Polygon({
                path,
                strokeWeight: 3,
                strokeColor: zone.color,
                strokeOpacity: 0.9,
                fillColor: zone.color,
                fillOpacity: 0.3,
            })
            polygon.setMap(map)
            newElements.push(polygon)

            // 라벨
            const label = new kakao.maps.CustomOverlay({
                position: new kakao.maps.LatLng(zone.center.lat, zone.center.lng),
                content: `<div style="
          padding: 6px 10px;
          background: white;
          border-radius: 8px;
          border: 2px solid ${zone.color};
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        ">
          <span style="margin-right: 4px;">${zone.icon}</span>
          ${zone.name}
        </div>`,
                yAnchor: 0.5,
            })
            label.setMap(map)
            newElements.push(label)
        })

        setDrawnElements(newElements)
    }, [zones, map])

    // 구역 저장 (API 호출)
    const handleSaveZone = async () => {
        if (currentPoints.length < 3) return

        console.log('Attempting to save zone:', { newZoneName, newZoneColor, newZoneIcon })

        if (!newZoneName) {
            alert('구역 이름이 설정되지 않았습니다.')
            return
        }

        // 중심점 계산
        const centerLat = currentPoints.reduce((sum, p) => sum + p.lat, 0) / currentPoints.length
        const centerLng = currentPoints.reduce((sum, p) => sum + p.lng, 0) / currentPoints.length

        try {
            const newZone = await boothZoneApi.create({
                name: newZoneName,
                color: newZoneColor,
                icon: newZoneIcon,
                bounds: currentPoints,
                center: { lat: centerLat, lng: centerLng },
            })

            setZones([...zones, newZone])

            // 초기화
            resetDrawing()
            setShowNewZoneModal(false)
        } catch (error) {
            console.error('Failed to save zone:', error)
            alert('구역 저장에 실패했습니다.')
        }
    }

    // 그리기 초기화
    const resetDrawing = () => {
        tempMarkers.forEach(m => m.setMap(null))
        if (tempPolygon) tempPolygon.setMap(null)
        setCurrentPoints([])
        setTempMarkers([])
        setTempPolygon(null)
        setIsDrawing(false)
        setNewZoneName('부스')
        setNewZoneColor('#A7F3D0')
        setNewZoneIcon('🎪')
    }

    // 구역 삭제 (API 호출)
    const handleDeleteZone = async (zoneId: string) => {
        try {
            await boothZoneApi.delete(zoneId)
            setZones(zones.filter(z => z.id !== zoneId))
        } catch (error) {
            console.error('Failed to delete zone:', error)
            alert('구역 삭제에 실패했습니다.')
        }
    }

    // 코드 복사
    const handleCopyCode = () => {
        const code = `const BOOTH_ZONES = ${JSON.stringify(zones, null, 2)}`
        navigator.clipboard.writeText(code)
        alert('코드가 클립보드에 복사되었습니다!')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">부스 구역 편집기</h1>
                    <p className="text-sm text-gray-500">지도를 클릭하여 구역을 그리세요</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyCode}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                        코드 복사
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-[calc(100vh-64px)]">
                {/* 지도 영역 (상단) */}
                <div className="flex-1 relative">
                    <div ref={mapRef} className="w-full h-full" />

                    {/* 현재 포인트 좌표 표시 */}
                    {currentPoints.length > 0 && (
                        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 max-w-xs z-10">
                            <p className="text-xs font-bold text-gray-700 mb-2">선택한 좌표</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto text-xs text-gray-600">
                                {currentPoints.map((p, i) => (
                                    <div key={i}>
                                        {i + 1}. {p.lat.toFixed(6)}, {p.lng.toFixed(6)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 컨트롤 패널 */}
                <div className="bg-white border-t p-4 max-h-[40vh] overflow-y-auto">
                    {/* 그리기 모드 */}
                    {!isDrawing ? (
                        <button
                            onClick={() => setIsDrawing(true)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                        >
                            <Plus className="w-5 h-5" />
                            새 구역 그리기
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm text-blue-700 font-medium">🖱️ 지도를 클릭하여 꼭지점을 찍으세요</p>
                                <p className="text-xs text-blue-600 mt-1">최소 3개 이상 필요</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={resetDrawing}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => currentPoints.length >= 3 && setShowNewZoneModal(true)}
                                    disabled={currentPoints.length < 3}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    완료 ({currentPoints.length}점)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 구역 목록 */}
                    <div className="mt-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-3">저장된 구역 ({zones.length})</h2>
                        <div className="space-y-2">
                            {zones.map(zone => (
                                <div
                                    key={zone.id}
                                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                            style={{ backgroundColor: zone.color + '30', border: `2px solid ${zone.color}` }}
                                        >
                                            {zone.icon}
                                        </div>
                                        <span className="font-medium text-gray-900">{zone.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteZone(zone.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {zones.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    아직 저장된 구역이 없습니다
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 구역 타입 선택 모달 */}
            {showNewZoneModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold mb-4">구역 타입 선택</h3>
                        <p className="text-sm text-gray-500 mb-4">이 구역이 무엇인지 선택하세요</p>

                        <div className="space-y-2">
                            {COLOR_OPTIONS.map(option => {
                                const parts = option.name.split(' ')
                                const icon = parts[0]
                                const name = parts.slice(1).join(' ') || option.name

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setNewZoneColor(option.value)
                                            setNewZoneIcon(icon)
                                            setNewZoneName(name)
                                        }}
                                        className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${newZoneColor === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                            style={{ backgroundColor: option.value }}
                                        >
                                            {icon}
                                        </div>
                                        <span className="font-medium text-gray-900">{option.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowNewZoneModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveZone}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
