"use client";

import { useState, useEffect } from "react";
import { BarChart3, Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  bobot: string;
  jenis: "benefit" | "cost";
}

export default function DataKriteriaPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    bobot: "",
    jenis: "" as "benefit" | "cost" | "",
  });

  useEffect(() => {
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    try {
      const response = await fetch("/api/kriteria");
      if (response.ok) {
        const data = await response.json();
        setKriteriaData(data);
      }
    } catch (error) {
      console.error("Error fetching kriteria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchKriteria();
        setIsAddOpen(false);
        setFormData({ kode: "", nama: "", bobot: "", jenis: "" });
      }
    } catch (error) {
      console.error("Error adding kriteria:", error);
    }
  };

  const handleEdit = (item: Kriteria) => {
    setEditingItem(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      bobot: item.bobot,
      jenis: item.jenis,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const response = await fetch("/api/kriteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingItem.id, ...formData }),
      });

      if (response.ok) {
        await fetchKriteria();
        setIsEditOpen(false);
        setEditingItem(null);
        setFormData({ kode: "", nama: "", bobot: "", jenis: "" });
      }
    } catch (error) {
      console.error("Error updating kriteria:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/kriteria?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchKriteria();
      }
    } catch (error) {
      console.error("Error deleting kriteria:", error);
    }
  };

  const filteredData = kriteriaData.filter(
    (item) =>
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">Data Kriteria</h1>
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
                  <BarChart3 className="h-5 w-5" />
                  Tambah Data Kriteria
                </DialogTitle>
              </div>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-kode"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Kode Kriteria
                  </Label>
                  <Input
                    id="add-kode"
                    type="text"
                    className="w-full"
                    value={formData.kode}
                    onChange={(e) =>
                      setFormData({ ...formData, kode: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="add-bobot"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Bobot Kriteria
                  </Label>
                  <Input
                    id="add-bobot"
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    placeholder="Masukkan Nilai Bobot 1-5"
                    className="w-full"
                    value={formData.bobot}
                    onChange={(e) =>
                      setFormData({ ...formData, bobot: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-nama"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nama Kriteria
                  </Label>
                  <Input
                    id="add-nama"
                    type="text"
                    className="w-full"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="add-atribut"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Atribut Kriteria
                  </Label>
                  <Select
                    value={formData.jenis}
                    onValueChange={(value: "benefit" | "cost") =>
                      setFormData({ ...formData, jenis: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Atribut Kriteria--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="benefit">Benefit</SelectItem>
                      <SelectItem value="cost">Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsAddOpen(false)}
                >
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
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Tabel Kriteria</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cari:</span>
              <Input
                className="w-48"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="px-6 py-3 text-left text-sm font-medium">No</th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Kode Kriteria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Nama Kriteria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Bobot Kriteria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Atribut Kriteria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.kode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.bobot}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {item.jenis}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleEdit(item)}
                        >
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
                              <AlertDialogTitle>
                                Konfirmasi Hapus
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data kriteria
                                ini? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
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
                ))
              )}
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
                <BarChart3 className="h-5 w-5" />
                Ubah Data Kriteria
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-kode"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Kode Kriteria
                </Label>
                <Input
                  id="edit-kode"
                  type="text"
                  className="w-full"
                  value={formData.kode}
                  onChange={(e) =>
                    setFormData({ ...formData, kode: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-bobot"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Bobot Kriteria
                </Label>
                <Input
                  id="edit-bobot"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  placeholder="Masukkan Nilai Bobot 1-5"
                  className="w-full"
                  value={formData.bobot}
                  onChange={(e) =>
                    setFormData({ ...formData, bobot: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-nama"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Nama Kriteria
                </Label>
                <Input
                  id="edit-nama"
                  type="text"
                  className="w-full"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-atribut"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Atribut Kriteria
                </Label>
                <Select
                  value={formData.jenis}
                  onValueChange={(value: "benefit" | "cost") =>
                    setFormData({ ...formData, jenis: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Atribut Kriteria--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benefit">Benefit</SelectItem>
                    <SelectItem value="cost">Cost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsEditOpen(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
