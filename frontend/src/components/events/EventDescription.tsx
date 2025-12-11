import { Info } from 'lucide-react'

interface EventDescriptionProps {
    description: string
}

export default function EventDescription({ description }: EventDescriptionProps) {
    return (
        <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">행사 설명</h3>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {description}
                </p>
            </div>
        </div>
    )
}
