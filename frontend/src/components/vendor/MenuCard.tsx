import { Edit2, Trash2, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Menu } from '@/lib/api/foodtrucks'

interface MenuCardProps {
  item: Menu
  onEdit: (item: Menu) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string, isAvailable: boolean) => void
}

export default function MenuCard({ item, onEdit, onDelete, onToggleAvailability }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex gap-4 p-4">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400'}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
            </div>
            <button
              onClick={() => onToggleAvailability(item.id, !item.available)}
              className={`ml-2 ${item.available ? 'text-green-600' : 'text-gray-400'}`}
            >
              {item.available ? (
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
                <span className="font-bold text-gray-900">{item.price.toLocaleString()}원</span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
            >
              {item.available ? '판매중' : '품절'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              수정
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
