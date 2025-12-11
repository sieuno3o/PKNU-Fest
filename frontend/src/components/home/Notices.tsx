interface NoticesProps {
  notices?: string[]
}

export default function Notices({ notices = [] }: NoticesProps) {
  // TODO: 실제로는 API에서 가져올 데이터
  const defaultNotices = [
    '우천 시 일부 행사 취소 가능',
    '캠퍼스 내 주차 불가',
  ]

  const displayNotices = notices.length > 0 ? notices : defaultNotices

  return (
    <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📢</span>
        <span>공지사항</span>
      </h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {displayNotices.map((notice, index) => (
          <div key={index} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">{notice}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
