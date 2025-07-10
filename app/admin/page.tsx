import { Home, BarChart3 } from "lucide-react"

export default function BerandaPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Home className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Beranda</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Grafik Sistem Pemilihan Cat Dinding</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Penerapan Metode Weighted Product (WP) Dalam Pemilihan
            </h2>
            <h3 className="text-xl font-semibold text-gray-700">Cat Dinding Terbaik Pada TB Raja Bagunan</h3>
          </div>

          {/* Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-yellow-100 rounded-lg p-6 text-center border border-yellow-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Data Alternatif</h4>
                <div className="text-4xl font-bold text-gray-800">0</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
