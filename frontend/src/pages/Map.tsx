import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, UtensilsCrossed, Calendar, Navigation } from 'lucide-react'

// 부경대학교 중심 좌표
const PKNU_CENTER = { lat: 35.134, lng: 129.104 }

// TODO: 나중에 API에서 가져올 데이터
const mockLocations = {
  events: [
    {
      id: '1',
      title: '아이유 콘서트',
      type: 'event',
      lat: 35.135,
      lng: 129.105,
      category: '공연',
      time: '19:00',
    },
    {
      id: '2',
      title: '체험 부스 - AR/VR',
      type: 'event',
      lat: 35.134,
      lng: 129.103,
      category: '체험',
      time: '10:00',
    },
    {
      id: '3',
      title: '게임 대회',
      type: 'event',
      lat: 35.133,
      lng: 129.104,
      category: '게임',
      time: '14:00',
    },
  ],
  foodTrucks: [
    {
      id: '1',
      title: '타코야끼 트럭',
      type: 'foodtruck',
      lat: 35.135,
      lng: 129.103,
      category: '일식',
    },
    {
      id: '2',
      title: '햄버거 트럭',
      type: 'foodtruck',
      lat: 35.133,
      lng: 129.106,
      category: '양식',
    },
  ],
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedType, setSelectedType] = useState<'all' | 'events' | 'foodtrucks'>('all')
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Kakao Maps 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => {
        setScriptLoaded(true)
      })
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current || !scriptLoaded || !window.kakao) return

    const { kakao } = window

    // 지도 생성
    const options = {
      center: new kakao.maps.LatLng(PKNU_CENTER.lat, PKNU_CENTER.lng),
      level: 3,
    }
    const newMap = new kakao.maps.Map(mapContainer.current, options)
    setMap(newMap)

    // 지도 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl()
    newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
  }, [scriptLoaded])

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!map || !window.kakao) return

    const { kakao } = window

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null))

    const newMarkers: any[] = []

    // 행사 마커
    if (selectedType === 'all' || selectedType === 'events') {
      mockLocations.events.forEach((event) => {
        const position = new kakao.maps.LatLng(event.lat, event.lng)

        // 커스텀 오버레이 콘텐츠
        const content = `
          <div style="padding: 10px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 20px;">🎵</span>
              <span style="font-weight: bold; font-size: 14px; color: #1e40af;">${event.category}</span>
            </div>
            <div style="font-weight: 600; font-size: 15px; color: #111; margin-bottom: 4px;">${event.title}</div>
            <div style="font-size: 12px; color: #666;">⏰ ${event.time}</div>
            <a href="/events/${event.id}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: linear-gradient(to right, #2563eb, #9333ea); color: white; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: 600;">상세보기</a>
          </div>
        `

        const customOverlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.5,
        })

        // 마커 이미지
        const imageSize = new kakao.maps.Size(40, 40)
        const svgIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="3"/>
            <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🎵</text>
          </svg>
        `
        const markerImage = new kakao.maps.MarkerImage(
          'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon),
          imageSize
        )

        const marker = new kakao.maps.Marker({
          map,
          position,
          image: markerImage,
        })

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', () => {
          customOverlay.setMap(customOverlay.getMap() ? null : map)
        })

        newMarkers.push(marker)
        newMarkers.push(customOverlay)
      })
    }

    // 푸드트럭 마커
    if (selectedType === 'all' || selectedType === 'foodtrucks') {
      mockLocations.foodTrucks.forEach((truck) => {
        const position = new kakao.maps.LatLng(truck.lat, truck.lng)

        const content = `
          <div style="padding: 10px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 20px;">🍔</span>
              <span style="font-weight: bold; font-size: 14px; color: #ea580c;">${truck.category}</span>
            </div>
            <div style="font-weight: 600; font-size: 15px; color: #111; margin-bottom: 4px;">${truck.title}</div>
            <a href="/foodtrucks/${truck.id}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: linear-gradient(to right, #ea580c, #dc2626); color: white; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: 600;">메뉴보기</a>
          </div>
        `

        const customOverlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.5,
        })

        const imageSize = new kakao.maps.Size(40, 40)
        const svgIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#ea580c" stroke="white" stroke-width="3"/>
            <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🍔</text>
          </svg>
        `
        const markerImage = new kakao.maps.MarkerImage(
          'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon),
          imageSize
        )

        const marker = new kakao.maps.Marker({
          map,
          position,
          image: markerImage,
        })

        kakao.maps.event.addListener(marker, 'click', () => {
          customOverlay.setMap(customOverlay.getMap() ? null : map)
        })

        newMarkers.push(marker)
        newMarkers.push(customOverlay)
      })
    }

    setMarkers(newMarkers)
  }, [map, selectedType])

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map && window.kakao) {
            const { kakao } = window
            const locPosition = new kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )
            map.setCenter(locPosition)
          }
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
          alert('위치 정보를 가져올 수 없습니다')
        }
      )
    }
  }

  return (
    <div className="relative h-full">
      {/* 지도 */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* 상단 필터 */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-2xl shadow-lg p-3 flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedType('events')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-1 ${
              selectedType === 'events'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>행사</span>
          </button>
          <button
            onClick={() => setSelectedType('foodtrucks')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-1 ${
              selectedType === 'foodtrucks'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>푸드트럭</span>
          </button>
        </div>
      </div>

      {/* 내 위치 버튼 */}
      <button
        onClick={handleMyLocation}
        className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
      >
        <Navigation className="w-6 h-6 text-blue-600" />
      </button>

      {/* 범례 */}
      <div className="absolute bottom-24 left-4 bg-white rounded-2xl shadow-lg p-4 z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
              🎵
            </div>
            <span className="text-sm text-gray-700">행사</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs">
              🍔
            </div>
            <span className="text-sm text-gray-700">푸드트럭</span>
          </div>
        </div>
      </div>
    </div>
  )
}
