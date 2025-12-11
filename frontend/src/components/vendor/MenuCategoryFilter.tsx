interface MenuCategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function MenuCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: MenuCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category === 'all' ? '전체' : category}
        </button>
      ))}
    </div>
  )
}
