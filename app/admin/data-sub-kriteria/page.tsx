"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react";
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

interface SubKriteria {
  id: number;
  kriteria_id: number;
  nama: string;
  bobot: string;
  keterangan: string;
  kode_kriteria: string;
  nama_kriteria: string;
}

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
}

export default function DataSubKriteriaPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubKriteria | null>(null);
  const [subKriteriaData, setSubKriteriaData] = useState<SubKriteria[]>([]);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    kriteria_id: "",
    nama: "",
    bobot: "",
    keterangan: "",
  });

  useEffect(() => {
    fetchSubKriteria();
    fetchKriteria();
  }, []);

  const fetchSubKriteria = async () => {
    try {
      const response = await fetch("/api/sub-kriteria");
      if (response.ok) {
        const data = await response.json();
        setSubKriteriaData(data);
      }
    } catch (error) {
      console.error("Error fetching sub kriteria:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKriteria = async () => {
    try {
      const response = await fetch("/api/kriteria");
      if (response.ok) {
        const data = await response.json();
        setKriteriaData(data);
      }
    } catch (error) {
      console.error("Error fetching kriteria:", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sub-kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          kriteria_id: parseInt(formData.kriteria_id),
        }),
      });

      if (response.ok) {
        await fetchSubKriteria();
        setIsAddOpen(false);
        setFormData({ kriteria_id: "", nama: "", bobot: "", keterangan: "" });
      }
    } catch (error) {
      console.error("Error adding sub kriteria:", error);
    }
  };

  const handleEdit = (item: SubKriteria) => {
    setEditingItem(item);
    setFormData({
      kriteria_id: item.kriteria_id.toString(),
      nama: item.nama,
      bobot: item.bobot,
      keterangan: item.keterangan || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const response = await fetch("/api/sub-kriteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          ...formData,
          kriteria_id: parseInt(formData.kriteria_id),
        }),
      });

      if (response.ok) {
        await fetchSubKriteria();
        setIsEditOpen(false);
        setEditingItem(null);
        setFormData({ kriteria_id: "", nama: "", bobot: "", keterangan: "" });
      }
    } catch (error) {
      console.error("Error updating sub kriteria:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sub-kriteria?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSubKriteria();
      }
    } catch (error) {
      console.error("Error deleting sub kriteria:", error);
    }
  };

  const filteredData = subKriteriaData.filter(
    (item) =>
      item.kode_kriteria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_kriteria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Data Sub Kriteria
          </h1>
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
                  <Users className="h-5 w-5" />
                  Tambah Data Sub Kriteria
                </DialogTitle>
              </div>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-kriteria"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Kode Kriteria
                  </Label>
                  <Select
                    value={formData.kriteria_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, kriteria_id: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Kode Kriteria--" />
                    </SelectTrigger>
                    <SelectContent>
                      {kriteriaData.map((kriteria) => (
                        <SelectItem
                          key={kriteria.id}
                          value={kriteria.id.toString()}
                        >
                          {kriteria.kode} - {kriteria.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="add-nama-kriteria"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nama Kriteria
                  </Label>
                  <Input
                    id="add-nama-kriteria"
                    type="text"
                    className="w-full bg-gray-100"
                    value={
                      kriteriaData.find(
                        (k) => k.id.toString() === formData.kriteria_id
                      )?.nama || ""
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-nama-sub"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nama Sub Kriteria
                  </Label>
                  <Input
                    id="add-nama-sub"
                    type="text"
                    className="w-full"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nama: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="add-bobot"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nilai Bobot
                  </Label>
                  <Select
                    value={formData.bobot}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, bobot: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Nilai Bobot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Sangat Baik</SelectItem>
                      <SelectItem value="4">4 - Baik</SelectItem>
                      <SelectItem value="3">3 - Cukup</SelectItem>
                      <SelectItem value="2">2 - Kurang</SelectItem>
                      <SelectItem value="1">1 - Sangat Kurang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="add-keterangan"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Keterangan (Opsional)
                </Label>
                <Input
                  id="add-keterangan"
                  type="text"
                  className="w-full"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      keterangan: e.target.value,
                    }))
                  }
                  placeholder="Masukkan keterangan..."
                />
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
                  onClick={() => {
                    setIsAddOpen(false);
                    setFormData({
                      kriteria_id: "",
                      nama: "",
                      bobot: "",
                      keterangan: "",
                    });
                  }}
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
            <Users className="h-5 w-5" />
            <span className="font-medium">Tabel Sub Kriteria</span>
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
                  Nama Sub Kriteria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Nilai Bobot
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
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Tidak ada data sub kriteria
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.kode_kriteria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.nama_kriteria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.bobot}
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
                                Apakah Anda yakin ingin menghapus data sub
                                kriteria "{item.nama}"? Tindakan ini tidak dapat
                                dibatalkan.
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
                <Users className="h-5 w-5" />
                Ubah Data Sub Kriteria
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-kriteria"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Kode Kriteria
                </Label>
                <Select
                  value={formData.kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, kriteria_id: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kode Kriteria--" />
                  </SelectTrigger>
                  <SelectContent>
                    {kriteriaData.map((kriteria) => (
                      <SelectItem
                        key={kriteria.id}
                        value={kriteria.id.toString()}
                      >
                        {kriteria.kode} - {kriteria.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="edit-nama-kriteria"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Nama Kriteria
                </Label>
                <Input
                  id="edit-nama-kriteria"
                  type="text"
                  className="w-full bg-gray-100"
                  value={
                    kriteriaData.find(
                      (k) => k.id.toString() === formData.kriteria_id
                    )?.nama || ""
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-nama-sub"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Nama Sub Kriteria
                </Label>
                <Input
                  id="edit-nama-sub"
                  type="text"
                  className="w-full"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-bobot"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Nilai Bobot
                </Label>
                <Select
                  value={formData.bobot}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bobot: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Nilai Bobot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Sangat Baik</SelectItem>
                    <SelectItem value="4">4 - Baik</SelectItem>
                    <SelectItem value="3">3 - Cukup</SelectItem>
                    <SelectItem value="2">2 - Kurang</SelectItem>
                    <SelectItem value="1">1 - Sangat Kurang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="edit-keterangan"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Keterangan (Opsional)
              </Label>
              <Input
                id="edit-keterangan"
                type="text"
                className="w-full"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    keterangan: e.target.value,
                  }))
                }
                placeholder="Masukkan keterangan..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingItem(null);
                  setFormData({
                    kriteria_id: "",
                    nama: "",
                    bobot: "",
                    keterangan: "",
                  });
                }}
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
