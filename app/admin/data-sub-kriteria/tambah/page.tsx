import { Users, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function TambahSubKriteriaPage() {
  return (
    <div className="p-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Tambah Data Sub Kriteria</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="kode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kode Kriteria
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kode Kriteria--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">C1</SelectItem>
                    <SelectItem value="c2">C2</SelectItem>
                    <SelectItem value="c3">C3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nama-sub" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Sub Kriteria
                </Label>
                <Input id="nama-sub" type="text" className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nama" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Kriteria
                </Label>
                <Input id="nama" type="text" className="w-full" />
              </div>

              <div>
                <Label htmlFor="bobot" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nilai Bobot
                </Label>
                <Input id="bobot" type="text" placeholder="Masukkan Nilai Bobot 5-1" className="w-full" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button type="button" variant="destructive" asChild>
                <Link href="/admin/data-sub-kriteria">
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
