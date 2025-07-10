import { ClipboardList, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function UbahPenilaianPage() {
  return (
    <div className="p-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Ubah Data Penilaian</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="kode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kode Alternatif
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kode Alternatif--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a1">A1</SelectItem>
                    <SelectItem value="a2">A2</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ketahanan" className="text-sm font-medium text-gray-700 mb-2 block">
                  Ketahanan
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Ketahanan--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tinggi">Tinggi</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="rendah">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nama" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Alternatif
                </Label>
                <Input id="nama" type="text" className="w-full" />
              </div>

              <div>
                <Label htmlFor="daya-sebar" className="text-sm font-medium text-gray-700 mb-2 block">
                  Daya Sebar
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Daya Sebar--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baik">Baik</SelectItem>
                    <SelectItem value="cukup">Cukup</SelectItem>
                    <SelectItem value="kurang">Kurang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="kualitas" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kualitas Pigmen
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kualitas Pigmen--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sangat-baik">Sangat Baik</SelectItem>
                    <SelectItem value="baik">Baik</SelectItem>
                    <SelectItem value="cukup">Cukup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="variasi" className="text-sm font-medium text-gray-700 mb-2 block">
                  Variasi Warna
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Variasi Warna--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banyak">Banyak</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="sedikit">Sedikit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="harga" className="text-sm font-medium text-gray-700 mb-2 block">
                Harga
              </Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--Pilih Harga--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="murah">Murah</SelectItem>
                  <SelectItem value="sedang">Sedang</SelectItem>
                  <SelectItem value="mahal">Mahal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button type="button" variant="destructive" asChild>
                <Link href="/admin/data-penilaian">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
