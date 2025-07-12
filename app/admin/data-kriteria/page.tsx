"use client";

import { useState, useEffect } from "react";
import {  Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      const response = await fetch("/api/kriteria", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
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
        toast.success("Data kriteria berhasil ditambahkan!");
        router.refresh();
      } else {
        toast.error("Gagal menambahkan data kriteria!");
      }
    } catch (error) {
      console.error("Error adding kriteria:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
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
        toast.success("Data kriteria berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal memperbarui data kriteria!");
      }
    } catch (error) {
      console.error("Error updating kriteria:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/kriteria?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchKriteria();
        toast.success("Data kriteria berhasil dihapus!");
        router.refresh();
      } else {
        toast.error("Gagal menghapus data kriteria!");
      }
    } catch (error) {
      console.error("Error deleting kriteria:", error);
      toast.error("Terjadi kesalahan saat menghapus data!");
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
      <div className="flex justify-end mb-6">
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
              <div className="bg-red-600 text-white px-4 py-2 -mx-6 -mt-6 mb-6 rounded-t-lg">
                <DialogTitle className="text-white text-base font-medium">
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
                  </Label>{" "}
                  <Input
                    id="add-bobot"
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    placeholder="Masukkan Nilai Bobot 1-5"
                    className="w-full"
                    value={formData.bobot}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Parse and format to remove decimals
                      const intValue = value
                        ? Math.round(parseFloat(value)).toString()
                        : "";
                      setFormData({ ...formData, bobot: intValue });
                    }}
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
        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
          <span className="text-base font-medium">Tabel Kriteria</span>
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
        <div className="p-4">
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Kode Kriteria</TableHead>
                  <TableHead>Nama Kriteria</TableHead>
                  <TableHead>Bobot Kriteria</TableHead>
                  <TableHead>Atribut Kriteria</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>
                        {Math.round(parseFloat(item.bobot))}
                      </TableCell>
                      <TableCell className="capitalize">{item.jenis}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
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
                                  Apakah Anda yakin ingin menghapus data
                                  kriteria ini? Tindakan ini tidak dapat
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="bg-red-600 text-white px-4 py-2 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-white text-base font-medium">
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
                  onChange={(e) => {
                    const value = e.target.value;
                    // Parse and format to remove decimals
                    const intValue = value
                      ? Math.round(parseFloat(value)).toString()
                      : "";
                    setFormData({ ...formData, bobot: intValue });
                  }}
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
