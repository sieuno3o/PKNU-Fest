import { useState, useMemo } from 'react'
import { Package } from 'lucide-react'
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
import MenuHeader from '@/components/vendor/MenuHeader'
import MenuStats from '@/components/vendor/MenuStats'
import MenuSearchBar from '@/components/vendor/MenuSearchBar'
import MenuCategoryFilter from '@/components/vendor/MenuCategoryFilter'
import MenuCard from '@/components/vendor/MenuCard'
import MenuFormModal from '@/components/vendor/MenuFormModal'

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
    available: true,
  })

  // Get vendor's food truck
  const { data: foodTrucks } = useFoodTrucks()
  const vendorTruck = useMemo(
    () => foodTrucks?.find((truck) => truck.ownerId === user?.id),
    [foodTrucks, user?.id]
  )

  // Fetch menu for the vendor's truck
  const { data: menuItems = [] } = useFoodTruckMenu(vendorTruck?.id || '')

  // Mutations
  const createMenu = useCreateMenu()
  const updateMenu = useUpdateMenu()
  const deleteMenu = useDeleteMenu()
  const toggleAvailability = useToggleMenuAvailability()

  // 카테고리 목록
  const categories = ['all', '메인', '사이드', '음료', '디저트']

  // 필터링
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // 통계
  const stats = {
    total: menuItems.length,
    available: menuItems.filter((item) => item.available).length,
    outOfStock: menuItems.filter((item) => !item.available).length,
  }

  // 메뉴 추가
  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      available: true,
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
      updateMenu.mutate({
        truckId: vendorTruck.id,
        menuId: editingItem.id,
        data: formData as any,
      })
    } else {
      createMenu.mutate({
        truckId: vendorTruck.id,
        data: formData as any,
      })
    }

    setShowModal(false)
  }

  // 재고 가능 여부 토글
  const handleToggleAvailability = (id: string, isAvailable: boolean) => {
    if (vendorTruck?.id) {
      toggleAvailability.mutate({
        truckId: vendorTruck.id,
        menuId: id,
        isAvailable,
      })
    }
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <MenuHeader />
      <MenuStats {...stats} />

      <div className="p-4 bg-white border-b border-gray-200">
        <MenuSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={handleCreate}
        />
        <MenuCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
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
            <MenuCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
            />
          ))
        )}
      </div>

      <MenuFormModal
        isOpen={showModal}
        isEditing={!!editingItem}
        formData={formData}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
      />
    </div>
  )
}
