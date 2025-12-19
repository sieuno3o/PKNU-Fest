import { Link } from 'react-router-dom'
import { ChevronRight, Star, MapPinned, Loader2 } from 'lucide-react'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'

export default function PopularFoodTrucks() {
    const { data: foodTrucks = [], isLoading } = useFoodTrucks()

    // 상위 4개만 표시
    const displayTrucks = foodTrucks.slice(0, 4)

    if (isLoading) {
        return (
            <section className="px-4 py-6 bg-gradient-to-b from-white to-orange-50">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                </div>
            </section>
        )
    }

    if (displayTrucks.length === 0) {
        return null
    }

    return (
        <section className="px-4 py-6 bg-gradient-to-b from-white to-orange-50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">🍔</span>
                    <span>인기 푸드트럭</span>
                </h2>
                <Link
                    to="/foodtrucks"
                    className="flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    더보기 <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {displayTrucks.map((truck: any) => (
                    <Link
                        key={truck.id}
                        to={`/foodtrucks/${truck.id}`}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        {/* 이미지 */}
                        <div className="relative h-24 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
                            {truck.thumbnail || truck.image ? (
                                <img
                                    src={truck.thumbnail || truck.image}
                                    alt={truck.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                    🚚
                                </div>
                            )}
                        </div>

                        {/* 정보 */}
                        <div className="p-3">
                            <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                {truck.name}
                            </h3>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500 truncate">{truck.category || '푸드트럭'}</span>
                                {truck.rating && (
                                    <div className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-medium text-gray-700">{truck.rating}</span>
                                    </div>
                                )}
                            </div>
                            {truck.location && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                    <MapPinned className="w-3 h-3" />
                                    <span className="truncate">{truck.location}</span>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
