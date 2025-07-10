import { Database, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function UbahAlternatifPage() {
  return (
    <div className="p-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span className="font-medium">Ubah Data Alternatif</span>
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
                <Input id="kode" type="text" className="w-full" />
              </div>

              <div>
                <Label htmlFor="jenis" className="text-sm font-medium text-gray-700 mb-2 block">
                  Jenis
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Jenis Alternatif--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jenis1">Jenis 1</SelectItem>
                    <SelectItem value="jenis2">Jenis 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nama" className="text-sm font-medium text-gray-700 mb-2 block">
                Nama Alternatif
              </Label>
              <Input id="nama" type="text" className="w-full" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button type="button" variant="destructive" asChild>
                <Link href="/admin/data-alternatif">
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
