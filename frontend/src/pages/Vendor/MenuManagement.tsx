import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  DollarSign,
  Package,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  XCircle,
} from 'lucide-react'
import {
  useFoodTruckMenu,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  useToggleMenuAvailability,
} from '@/hooks/useFoodTrucks'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'
import { useAuth } from '@/hooks/useAuth'
import type { Menu } from '@/lib/api/foodtrucks'

export default function MenuManagement() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Menu | null>(null)
  const [formData, setFormData] = useState<Partial<Menu>>({
    name: '',
    description: '',
    price: 0,
    category: '메인',
    isAvailable: true,
    stock: 0,
  })

  // Get vendor's food truck
  const { data: foodTrucks, isLoading: loadingTrucks } = useFoodTrucks()
  const vendorTruck = useMemo(
    () => foodTrucks?.find((truck) => truck.ownerId === user?.id),
    [foodTrucks, user?.id]
  )

  // Fetch menu for the vendor's truck
  const {
    data: menuItems = [],
    isLoading: loadingMenu,
    error: menuError,
  } = useFoodTruckMenu(vendorTruck?.id || '')

  // Mutations
  const createMenu = useCreateMenu()
  const updateMenu = useUpdateMenu()
  const deleteMenu = useDeleteMenu()
  const toggleAvailability = useToggleMenuAvailability()

  const isLoading = loadingTrucks || loadingMenu

  // 카테고리 목록
  const categories = ['all', '메인', '사이드', '음료', '디저트']

  // 필터링
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 메뉴 추가
  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '메인',
      isAvailable: true,
      stock: 0,
    })
    setShowModal(true)
  }

  // 메뉴 수정
  const handleEdit = (item: Menu) => {
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }


  // 메뉴 삭제
  const handleDelete = (id: string) => {
    if (confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
      deleteMenu.mutate({ truckId: vendorTruck?.id || '', menuId: id })
    }
  }

  // 폼 제출
  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    if (!vendorTruck?.id) {
      alert('푸드트럭 정보를 찾을 수 없습니다.')
      return
    }

    if (editingItem) {
      // 수정
      updateMenu.mutate({
        truckId: vendorTruck.id,
        menuId: editingItem.id,
        data: formData as any,
      })
    } else {
      // 추가
      createMenu.mutate({
        truckId: vendorTruck.id,
        data: formData as any,
      })
    }

    setShowModal(false)
  }

  // 통계
  const stats = {
    total: menuItems.length,
    available: menuItems.filter((item) => item.isAvailable).length,
    outOfStock: menuItems.filter((item) => !item.isAvailable || item.stock === 0).length,
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">메뉴 관리</h1>
        <p className="text-orange-100">푸드트럭 메뉴를 등록하고 관리하세요</p>
      </div>

      {/* 통계 */}
      <div className="p-4 -mt-4">
        <div className="grid grid-cols-3 gap-3 bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600">전체 메뉴</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            <p className="text-xs text-gray-600">판매중</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            <p className="text-xs text-gray-600">품절</p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="메뉴 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition flex items-center gap-1"
          >
            <Plus className="w-5 h-5" />
            추가
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">메뉴가 없습니다</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex gap-4 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      <span className="text-xs text-gray-600">{item.category}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (vendorTruck?.id) {
                          toggleAvailability.mutate({
                            truckId: vendorTruck.id,
                            menuId: item.id,
                            isAvailable: !item.isAvailable,
                          })
                        }
                      }}
                      className={`ml-2 ${item.isAvailable ? 'text-green-600' : 'text-gray-400'
                        }`}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="w-10 h-10" />
                      ) : (
                        <ToggleLeft className="w-10 h-10" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-gray-900">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">재고 {item.stock}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${item.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {item.isAvailable ? '판매중' : '품절'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 메뉴 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingItem ? '메뉴 수정' : '새 메뉴 추가'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="예: 치즈 떡볶이"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="메뉴 설명"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가격 *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    재고
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="메인">메인</option>
                  <option value="사이드">사이드</option>
                  <option value="음료">음료</option>
                  <option value="디저트">디저트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                  판매 가능
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingItem ? '수정 완료' : '추가 완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
