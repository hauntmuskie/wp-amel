"use client"

import { useState } from "react"
import { Database, Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react"
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

export default function DataAlternatifPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditingItem(id)
    setIsEditOpen(true)
  }

  const handleDelete = (id: number) => {
    // Handle delete logic here
    console.log("Delete item:", id)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">Data Alternatif</h1>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="bg-red-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
                <DialogTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5" />
                  Tambah Data Alternatif
                </DialogTitle>
              </div>
            </DialogHeader>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="add-kode" className="text-sm font-medium text-gray-700 mb-2 block">
                    Kode Alternatif
                  </Label>
                  <Input id="add-kode" type="text" className="w-full" />
                </div>

                <div>
                  <Label htmlFor="add-jenis" className="text-sm font-medium text-gray-700 mb-2 block">
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
                <Label htmlFor="add-nama" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nama Alternatif
                </Label>
                <Input id="add-nama" type="text" className="w-full" />
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
            <Database className="h-5 w-5" />
            <span className="font-medium">Tabel Alternatif</span>
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
                <th className="px-6 py-3 text-left text-sm font-medium">Jenis</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((item) => (
                <tr key={item} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">{item}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">A{item}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Alternatif {item}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Jenis {item}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Ubah
                      </Button>

                      {/* Delete Dialog */}
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
                              Apakah Anda yakin ingin menghapus data alternatif ini? Tindakan ini tidak dapat
                              dibatalkan.
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="bg-red-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5" />
                Ubah Data Alternatif
              </DialogTitle>
            </div>
          </DialogHeader>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-kode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kode Alternatif
                </Label>
                <Input id="edit-kode" type="text" className="w-full" defaultValue={`A${editingItem}`} />
              </div>

              <div>
                <Label htmlFor="edit-jenis" className="text-sm font-medium text-gray-700 mb-2 block">
                  Jenis
                </Label>
                <Select defaultValue="jenis1">
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
              <Label htmlFor="edit-nama" className="text-sm font-medium text-gray-700 mb-2 block">
                Nama Alternatif
              </Label>
              <Input id="edit-nama" type="text" className="w-full" defaultValue={`Alternatif ${editingItem}`} />
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
