"use client"

import { useState } from "react"
import { ClipboardList, Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DataPenilaianPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditingItem(id)
    setIsEditOpen(true)
  }

  const handleDelete = (id: number) => {
    console.log("Delete item:", id)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">Data Penilaian</h1>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Nilai
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="bg-red-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
                <DialogTitle className="flex items-center gap-2 text-white">
                  <ClipboardList className="h-5 w-5" />
                  Tambah Data Penilaian
                </DialogTitle>
              </div>
            </DialogHeader>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="add-kode" className="text-sm font-medium text-gray-700 mb-2 block">
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
                  <Label htmlFor="add-ketahanan" className="text-sm font-medium text-gray-700 mb-2 block">
                    (C3) Ketahanan
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
                  <Label htmlFor="add-nama" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nama Alternatif
                  </Label>
                  <Input id="add-nama" type="text" className="w-full" />
                </div>

                <div>
                  <Label htmlFor="add-daya-sebar" className="text-sm font-medium text-gray-700 mb-2 block">
                    (C4) Daya Sebar
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
                  <Label htmlFor="add-kualitas" className="text-sm font-medium text-gray-700 mb-2 block">
                    (C1) Kualitas Pigmen
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
                  <Label htmlFor="add-variasi" className="text-sm font-medium text-gray-700 mb-2 block">
                    (C5) Variasi Warna
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
                <Label htmlFor="add-harga" className="text-sm font-medium text-gray-700 mb-2 block">
                  (C2) Harga
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

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddOpen(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </Button>
                <Button type="button" variant="destructive" onClick={() => setIsAddOpen(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  <td className="px-6 py-4 text-sm text-gray-900">A{item}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Alternatif {item}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Baik</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Murah</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Tinggi</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Banyak</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Baik</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Ubah
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus data penilaian ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="bg-red-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="flex items-center gap-2 text-white">
                <ClipboardList className="h-5 w-5" />
                Ubah Data Penilaian
              </DialogTitle>
            </div>
          </DialogHeader>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-kode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kode Alternatif
                </Label>
                <Select defaultValue={`a${editingItem}`}>
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
                <Label htmlFor="edit-ketahanan" className="text-sm font-medium text-gray-700 mb-2 block">
                  Ketahanan
                </Label>
                <Select defaultValue="tinggi">
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
                <Label htmlFor="edit-nama" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Alternatif
                </Label>
                <Input id="edit-nama" type="text" className="w-full" defaultValue={`Alternatif ${editingItem}`} />
              </div>

              <div>
                <Label htmlFor="edit-daya-sebar" className="text-sm font-medium text-gray-700 mb-2 block">
                  Daya Sebar
                </Label>
                <Select defaultValue="baik">
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
                <Label htmlFor="edit-kualitas" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kualitas Pigmen
                </Label>
                <Select defaultValue="baik">
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
                <Label htmlFor="edit-variasi" className="text-sm font-medium text-gray-700 mb-2 block">
                  Variasi Warna
                </Label>
                <Select defaultValue="banyak">
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
              <Label htmlFor="edit-harga" className="text-sm font-medium text-gray-700 mb-2 block">
                Harga
              </Label>
              <Select defaultValue="murah">
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" onClick={() => setIsEditOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button type="button" variant="destructive" onClick={() => setIsEditOpen(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
