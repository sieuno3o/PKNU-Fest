import { Trash2, Plus, Minus } from 'lucide-react'

interface CartItem {
    id: string
    truckId: string
    truckName: string
    menuId: string
    menuName: string
    price: number
    quantity: number
    image: string
}

interface CartItemCardProps {
    item: CartItem
    onIncrease: (id: string) => void
    onDecrease: (id: string) => void
    onRemove: (id: string) => void
}

export default function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
    return (
        <div className="flex gap-4">
            <img
                src={item.image}
                alt={item.menuName}
                className="w-20 h-20 object-cover rounded-xl"
            />
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{item.menuName}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.price.toLocaleString()}원</p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDecrease(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                        onClick={() => onIncrease(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}원
                </p>
            </div>
        </div>
    )
}

export type { CartItem }
