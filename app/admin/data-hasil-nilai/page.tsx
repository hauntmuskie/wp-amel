import { TrendingUp } from "lucide-react"

export default function DataHasilNilaiPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Data Hasil Nilai</h1>
      </div>

      <div className="space-y-6">
        {/* Perbaikan Bobot Kriteria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
            <span className="font-medium">Perbaikan Bobot Kriteria</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium">Bobot Awal Normalisasi</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">C1 (Benefit)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">C2 (Cost)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">C3 (Benefit)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">C4 (Benefit)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">C5 (Benefit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Perangkingan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
            <span className="font-medium">Perangkingan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium">No</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Kode Alternatif</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Nama Alternatif</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Nilai Vektor S</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Nilai Vektor V</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((item) => (
                  <tr key={item} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-sm text-gray-900">{item}</td>
                    <td className="px-6 py-4 text-sm text-gray-900"></td>
                    <td className="px-6 py-4 text-sm text-gray-900"></td>
                    <td className="px-6 py-4 text-sm text-gray-900"></td>
                    <td className="px-6 py-4 text-sm text-gray-900"></td>
                    <td className="px-6 py-4 text-sm text-gray-900"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
