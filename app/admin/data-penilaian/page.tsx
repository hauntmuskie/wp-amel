import { ClipboardList, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DataPenilaianPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">Data Penilaian</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/admin/data-penilaian/tambah">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Nilai
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Tabel Penilaian</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cari:</span>
              <Input className="w-48" placeholder="Search..." />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="px-6 py-3 text-left text-sm font-medium">No</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Kode Alternatif</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Nama Alternatif</th>
                <th className="px-6 py-3 text-left text-sm font-medium">C1</th>
                <th className="px-6 py-3 text-left text-sm font-medium">C2</th>
                <th className="px-6 py-3 text-left text-sm font-medium">C3</th>
                <th className="px-6 py-3 text-left text-sm font-medium">C5</th>
                <th className="px-6 py-3 text-left text-sm font-medium">C4</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
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
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                        <Link href={`/admin/data-penilaian/ubah/${item}`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Ubah
                        </Link>
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
