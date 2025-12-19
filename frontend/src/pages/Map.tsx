import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UtensilsCrossed, Calendar, Navigation } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'
import { boothZoneApi } from '@/lib/api/boothZones'

// 부경대학교 중심 좌표
const PKNU_CENTER = { lat: 35.134, lng: 129.104 }

// 파스텔 색상 팔레트
const PASTEL_COLORS = {
  booth: '#C4B5FD',     // 연보라
  event: '#93C5FD',     // 연파랑
  foodtruck: '#FED7AA', // 연오렌지
  photo: '#FBCFE8',     // 연핑크
}

// 부스 구역 타입
interface BoothZone {
  id: string
  name: string
  color: string
  icon: string
  bounds: { lat: number; lng: number }[]
  center: { lat: number; lng: number }
}

export default function Map() {
  const [searchParams] = useSearchParams()
  const mapContainer = useRef<HTMLDivElement>(null)
  const popupClickedRef = useRef(false) // 팝업 클릭 감지용
  const [selectedType, setSelectedType] = useState<'all' | 'events' | 'foodtrucks'>('all')
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [activePopups, setActivePopups] = useState<any[]>([]) // 팝업만 별도 관리
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [boothZones, setBoothZones] = useState<BoothZone[]>([])
  const [boothElements, setBoothElements] = useState<any[]>([])

  // URL 파라미터에서 위치 정보 가져오기
  const targetLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null
  const targetLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null

  // 부스 구역 API에서 불러오기
  useEffect(() => {
    const fetchBoothZones = async () => {
      try {
        const data = await boothZoneApi.getAll()
        setBoothZones(data)
      } catch (error) {
        console.error('Failed to fetch booth zones:', error)
      }
    }
    fetchBoothZones()
  }, [])

  // API 호출
  const { data: events = [], isLoading: eventsLoading } = useEvents()
  const { data: foodTrucks = [], isLoading: foodTrucksLoading } = useFoodTrucks()

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

    // URL 파라미터에 위치가 있으면 해당 위치로, 없으면 기본 위치로
    const initialLat = targetLat || PKNU_CENTER.lat
    const initialLng = targetLng || PKNU_CENTER.lng

    // 지도 생성
    const options = {
      center: new kakao.maps.LatLng(initialLat, initialLng),
      level: targetLat ? 2 : 3, // 특정 위치가 있으면 더 확대
    }
    const newMap = new kakao.maps.Map(mapContainer.current, options)
    setMap(newMap)

    // 지도 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl()
    newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

    // URL 파라미터로 특정 위치가 지정된 경우 마커 표시
    if (targetLat && targetLng) {
      const position = new kakao.maps.LatLng(targetLat, targetLng)

      // 깜박이는 마커 표시
      const markerContent = document.createElement('div')
      markerContent.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: #7C3AED;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7);
          animation: pulse 1.5s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(124, 58, 237, 0); }
            100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          }
        </style>
      `

      new kakao.maps.CustomOverlay({
        position,
        content: markerContent,
        yAnchor: 0.5,
        xAnchor: 0.5,
        map: newMap,
      })
    }
  }, [scriptLoaded, targetLat, targetLng])

  // 지도 클릭 시 팝업만 닫기 (마커는 유지)
  useEffect(() => {
    if (!map || !window.kakao) return

    const { kakao } = window

    const closePopups = () => {
      // 팝업이 클릭된 직후면 닫지 않음
      if (popupClickedRef.current) {
        popupClickedRef.current = false
        return
      }
      activePopups.forEach(popup => popup.setMap(null))
    }

    kakao.maps.event.addListener(map, 'click', closePopups)

    return () => {
      kakao.maps.event.removeListener(map, 'click', closePopups)
    }
  }, [map, activePopups])

  // 부스 구역 표시 (항상 표시)
  useEffect(() => {
    if (!map || !window.kakao || !scriptLoaded || boothZones.length === 0) return

    const { kakao } = window

    // 기존 부스 요소 제거
    boothElements.forEach((el) => el.setMap(null))

    const newElements: any[] = []

    boothZones.forEach((zone) => {
      // 폴리곤 (구역 영역) - 색상으로만 표시
      const polygonPath = zone.bounds.map(
        (coord) => new kakao.maps.LatLng(coord.lat, coord.lng)
      )

      const polygon = new kakao.maps.Polygon({
        path: polygonPath,
        strokeWeight: 2,
        strokeColor: zone.color,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        fillColor: zone.color,
        fillOpacity: 0.25,
      })
      polygon.setMap(map)
      newElements.push(polygon)
    })

    setBoothElements(newElements)
  }, [map, scriptLoaded, boothZones])

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!map || !window.kakao || eventsLoading || foodTrucksLoading) return

    const { kakao } = window

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null))

    const newMarkers: any[] = []
    const popups: any[] = [] // 팝업만 따로 추적

    // 디버깅: 이벤트 데이터 확인
    console.log('Events data:', events)

    // 행사 마커
    if (selectedType === 'all' || selectedType === 'events') {
      events.forEach((event) => {
        // 디버깅: 각 이벤트 좌표 확인
        console.log(`Event: ${event.title}, lat: ${event.latitude}, lng: ${event.longitude}`)

        // 좌표가 없는 경우 스킵
        if (!event.latitude || !event.longitude) return

        const position = new kakao.maps.LatLng(event.latitude, event.longitude)

        // 전역 함수로 네비게이션 처리
        const eventId = event.id
          ; (window as any)[`goToEvent_${eventId}`] = () => {
            window.location.href = `/events/${eventId}`
          }

        // 팝업 콘텐츠 - <a> 태그로 감싸서 확실한 링크 처리
        const content = document.createElement('a')
        content.href = `/events/${eventId}`
        content.style.textDecoration = 'none'
        content.style.display = 'block'
        content.style.pointerEvents = 'auto'
        content.innerHTML = `
          <div style="
            padding: 14px 16px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            min-width: 180px;
            border: 2px solid ${PASTEL_COLORS.event};
            cursor: pointer;
          ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="
                width: 32px; height: 32px;
                background: ${PASTEL_COLORS.event};
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">🎵</span>
              <span style="font-weight: 600; font-size: 13px; color: #6366f1;">${event.category || '공연'}</span>
            </div>
            <div style="font-weight: 700; font-size: 15px; color: #111; margin-bottom: 6px;">${event.title}</div>
            <div style="font-size: 12px; color: #888; margin-bottom: 10px;">${event.description?.slice(0, 30) || '탭하여 상세보기'}${event.description?.length > 30 ? '...' : ''}</div>
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              color: #6366f1;
              font-size: 12px;
              font-weight: 600;
            ">
              탭하여 상세보기 →
            </div>
          </div>
        `

        const customOverlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.3,
          clickable: true,
        })

        // 마커 이미지 - 등록 이미지가 있으면 원형 이미지, 없으면 기본 아이콘
        const eventImage = event.thumbnail || event.image

        let markerImage
        if (eventImage) {
          // 원형 이미지 마커 (이미지 URL 사용)
          const imageMarkerContent = `
            <div style="
              width: 35px;
              height: 35px;
              border-radius: 50%;
              border: 3px solid ${PASTEL_COLORS.event};
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              overflow: hidden;
              background: white;
            ">
              <img 
                src="${eventImage}" 
                style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;\\'>🎵</div>'"
              />
            </div>
          `
          // CustomOverlay를 마커 대신 사용
          const imageMarkerOverlay = new kakao.maps.CustomOverlay({
            position,
            content: imageMarkerContent,
            yAnchor: 0.5,
            xAnchor: 0.5,
          })
          imageMarkerOverlay.setMap(map)

          // 클릭 이벤트는 DOM에서 처리
          const markerDiv = document.createElement('div')
          markerDiv.innerHTML = imageMarkerContent
          markerDiv.style.cursor = 'pointer'
          markerDiv.onclick = () => {
            // 다른 팝업만 닫기 (마커는 유지)
            popups.forEach(p => p.setMap(null))
            customOverlay.setMap(map)
          }
          imageMarkerOverlay.setContent(markerDiv)

          newMarkers.push(imageMarkerOverlay)
          newMarkers.push(customOverlay)
          popups.push(customOverlay) // 팝업만 추적
        } else {
          // 기본 아이콘 마커
          const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
              <circle cx="15.5" cy="15.5" r="14" fill="${PASTEL_COLORS.event}" stroke="white" stroke-width="2.5"/>
              <text x="15.5" y="21" font-size="12" text-anchor="middle" fill="#1e40af">🎵</text>
            </svg>
          `
          markerImage = new kakao.maps.MarkerImage(
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon),
            new kakao.maps.Size(31, 31)
          )

          const marker = new kakao.maps.Marker({
            map,
            position,
            image: markerImage,
          })

          // 마커 클릭 이벤트
          kakao.maps.event.addListener(marker, 'click', () => {
            // 다른 팝업만 닫기 (마커는 유지)
            popups.forEach(p => p.setMap(null))
            customOverlay.setMap(map)
          })

          newMarkers.push(marker)
          newMarkers.push(customOverlay)
          popups.push(customOverlay) // 팝업만 추적
        }
      })
    }

    // 푸드트럭 마커
    if (selectedType === 'all' || selectedType === 'foodtrucks') {
      foodTrucks.forEach((truck) => {
        // 좌표가 없는 경우 스킵
        if (!truck.latitude || !truck.longitude) return

        const position = new kakao.maps.LatLng(truck.latitude, truck.longitude)

        // 전역 함수로 네비게이션 처리
        const truckId = truck.id
          ; (window as any)[`goToTruck_${truckId}`] = () => {
            window.location.href = `/foodtrucks/${truckId}`
          }

        // 팝업 콘텐츠 - <a> 태그로 감싸서 확실한 링크 처리
        const content = document.createElement('a')
        content.href = `/foodtrucks/${truckId}`
        content.style.textDecoration = 'none'
        content.style.display = 'block'
        content.style.pointerEvents = 'auto'
        content.innerHTML = `
          <div style="
            padding: 14px 16px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            min-width: 180px;
            border: 2px solid ${PASTEL_COLORS.foodtruck};
            cursor: pointer;
          ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="
                width: 32px; height: 32px;
                background: ${PASTEL_COLORS.foodtruck};
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">🍔</span>
              <span style="font-weight: 600; font-size: 13px; color: #ea580c;">푸드트럭</span>
            </div>
            <div style="font-weight: 700; font-size: 15px; color: #111; margin-bottom: 6px;">${truck.name}</div>
            <div style="font-size: 12px; color: #888; margin-bottom: 10px;">${truck.description?.slice(0, 30) || '맛있는 음식'}${truck.description?.length > 30 ? '...' : ''}</div>
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              color: #ea580c;
              font-size: 12px;
              font-weight: 600;
            ">
              탭하여 메뉴보기 →
            </div>
          </div>
        `

        const customOverlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.3,
          clickable: true,
        })

        // 마커 이미지 - 등록 이미지가 있으면 원형 이미지, 없으면 기본 아이콘
        const truckImage = truck.imageUrl

        let markerImage
        if (truckImage) {
          // 원형 이미지 마커
          const imageMarkerContent = `
            <div style="
              width: 35px;
              height: 35px;
              border-radius: 50%;
              border: 3px solid ${PASTEL_COLORS.foodtruck};
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              overflow: hidden;
              background: white;
            ">
              <img 
                src="${truckImage}" 
                style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;\\'>🍔</div>'"
              />
            </div>
          `
          const imageMarkerOverlay = new kakao.maps.CustomOverlay({
            position,
            content: imageMarkerContent,
            yAnchor: 0.5,
            xAnchor: 0.5,
          })
          imageMarkerOverlay.setMap(map)

          const markerDiv = document.createElement('div')
          markerDiv.innerHTML = imageMarkerContent
          markerDiv.style.cursor = 'pointer'
          markerDiv.onclick = () => {
            // 다른 팝업만 닫기 (마커는 유지)
            popups.forEach(p => p.setMap(null))
            customOverlay.setMap(map)
          }
          imageMarkerOverlay.setContent(markerDiv)

          newMarkers.push(imageMarkerOverlay)
          newMarkers.push(customOverlay)
          popups.push(customOverlay) // 팝업만 추적
        } else {
          // 기본 아이콘 마커
          const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
              <circle cx="15.5" cy="15.5" r="14" fill="${PASTEL_COLORS.foodtruck}" stroke="white" stroke-width="2.5"/>
              <text x="15.5" y="21" font-size="12" text-anchor="middle" fill="#c2410c">🍔</text>
            </svg>
          `
          markerImage = new kakao.maps.MarkerImage(
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon),
            new kakao.maps.Size(31, 31)
          )

          const marker = new kakao.maps.Marker({
            map,
            position,
            image: markerImage,
          })

          // 마커 클릭 이벤트
          kakao.maps.event.addListener(marker, 'click', () => {
            // 다른 팝업만 닫기 (마커는 유지)
            popups.forEach(p => p.setMap(null))
            customOverlay.setMap(map)
          })

          newMarkers.push(marker)
          newMarkers.push(customOverlay)
          popups.push(customOverlay) // 팝업만 추적
        }
      })
    }

    setMarkers(newMarkers)
    setActivePopups(popups)
  }, [map, selectedType, events, foodTrucks, eventsLoading, foodTrucksLoading])

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
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition ${selectedType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedType('events')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-1 ${selectedType === 'events'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>행사</span>
          </button>
          <button
            onClick={() => setSelectedType('foodtrucks')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-1 ${selectedType === 'foodtrucks'
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

      {/* 범례 - 고정된 3개 구역 */}
      <div className="absolute bottom-24 left-4 bg-white rounded-2xl shadow-lg p-3 z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
              style={{ backgroundColor: '#A7F3D040', border: '2px solid #A7F3D0' }}
            >
              🎪
            </div>
            <span className="text-xs text-gray-700">부스</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
              style={{ backgroundColor: '#FDE68A40', border: '2px solid #FDE68A' }}
            >
              🎵
            </div>
            <span className="text-xs text-gray-700">행사</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
              style={{ backgroundColor: '#FED7AA40', border: '2px solid #FED7AA' }}
            >
              🍔
            </div>
            <span className="text-xs text-gray-700">푸드트럭</span>
          </div>
        </div>
      </div>
    </div>
  )
}
