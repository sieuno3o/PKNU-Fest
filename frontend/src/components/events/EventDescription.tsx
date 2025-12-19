import { Info, ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface EventDescriptionProps {
    description: string
    images?: string[]
}

export default function EventDescription({ description, images }: EventDescriptionProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <>
            <div className="px-4 mb-4">
                <div className="bg-white rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">행사 설명</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                        {description || '설명이 없습니다.'}
                    </p>

                    {/* 설명 이미지 갤러리 */}
                    {images && images.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3 pt-4 border-t border-gray-100">
                                <ImageIcon className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">관련 이미지</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`행사 이미지 ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                                        onClick={() => setSelectedImage(img)}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="확대 이미지"
                        className="max-w-full max-h-full object-contain rounded-xl"
                    />
                </div>
            )}
        </>
    )
}
