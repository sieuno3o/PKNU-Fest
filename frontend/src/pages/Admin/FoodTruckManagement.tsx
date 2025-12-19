import { useState, useEffect } from 'react'
import { UtensilsCrossed, Plus, Loader2, Search, MapPin, User, Trash2, Edit2 } from 'lucide-react'
import api from '@/lib/api/client'
import { toast } from '@/components/ui/Toast'
import FoodTruckFormModal from '@/components/admin/FoodTruckFormModal'

export default function FoodTruckManagement() {
    const [foodTrucks, setFoodTrucks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        latitude: null,
        longitude: null,
        imageUrl: '',
        ownerId: '',
    })

    const fetchFoodTrucks = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/foodtrucks')
            // public API returns { success: true, data: [...] }
            setFoodTrucks(response.data.data || [])
        } catch (error) {
            console.error('Failed to fetch food trucks:', error)
            toast.error('푸드트럭 목록을 불러오는데 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFoodTrucks()
    }, [])

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCreate = () => {
        setIsEditing(false)
        setEditingId(null)
        setFormData({
            name: '',
            description: '',
            location: '',
            latitude: null,
            longitude: null,
            imageUrl: '',
            ownerId: '',
        })
        setShowModal(true)
    }

    const handleEdit = (truck: any) => {
        setIsEditing(true)
        setEditingId(truck.id)
        setFormData({
            name: truck.name,
            description: truck.description || '',
            location: truck.location,
            latitude: truck.latitude,
            longitude: truck.longitude,
            imageUrl: truck.imageUrl || '',
            ownerId: truck.ownerId || '',
        })
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 푸드트럭을 삭제하시겠습니까?')) return

        try {
            await api.delete(`/foodtrucks/${id}`)
            toast.success('푸드트럭이 삭제되었습니다.')
            fetchFoodTrucks()
        } catch (error) {
            console.error('Failed to delete food truck:', error)
            toast.error('푸드트럭 삭제에 실패했습니다.')
        }
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.location || !formData.ownerId || !formData.latitude) {
            toast.error('필수 항목(*)을 모두 입력해주세요.')
            return
        }

        try {
            if (isEditing && editingId) {
                // 현재 update API가 requireVendor 권한임. Admin도 수정 가능하도록 백엔드 수정 필요할 수 있음.
                // 일단 create 위주로 구현
                // await api.put(`/foodtrucks/${editingId}`, formData)
                toast.info('수정 기능은 현재 준비 중입니다. (생성은 가능합니다)')
                setShowModal(false)
            } else {
                await api.post('/foodtrucks', formData)
                toast.success('푸드트럭이 등록되었습니다.')
                fetchFoodTrucks()
                setShowModal(false)
            }
        } catch (error) {
            console.error('Failed to save food truck:', error)
            toast.error('푸드트럭 저장에 실패했습니다.')
        }
    }

    const filteredTrucks = foodTrucks.filter(truck =>
        truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">푸드트럭 관리</h1>
                        <p className="text-sm text-gray-500 mt-1">행사장의 푸드트럭 등록 및 전용 계정을 관리합니다</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        트럭 추가
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="트럭 이름 또는 위치로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-500 mt-4 font-medium">푸드트럭 목록을 불러오는 중...</p>
                    </div>
                ) : filteredTrucks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                        <UtensilsCrossed className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">등록된 푸드트럭이 없습니다</p>
                    </div>
                ) : (
                    filteredTrucks.map((truck) => (
                        <div key={truck.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                            {/* Image */}
                            <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                                {truck.imageUrl ? (
                                    <img src={truck.imageUrl} alt={truck.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <UtensilsCrossed className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{truck.name}</h3>
                                <div className="space-y-1 mt-1">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="truncate">{truck.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
                                        <User className="w-3.5 h-3.5" />
                                        <span>관리자 ID: {truck.ownerId?.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => handleEdit(truck)}
                                    className="flex-1 sm:flex-none p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition flex items-center justify-center gap-2 border border-gray-200 sm:border-none"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    <span className="sm:hidden text-sm font-medium">수정</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(truck.id)}
                                    className="flex-1 sm:flex-none p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-2 border border-red-100 sm:border-none"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="sm:hidden text-sm font-medium">삭제</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FoodTruckFormModal
                isOpen={showModal}
                isEditing={isEditing}
                formData={formData}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                onFormChange={handleFormChange}
            />
        </div>
    )
}
