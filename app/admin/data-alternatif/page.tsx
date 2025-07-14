"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, ArrowLeft, Database } from "lucide-react";
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

interface Alternatif {
  id: number;
  kode: string;
  nama: string;
  jenis: "Interior" | "Eksterior";
}

export default function DataAlternatifPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Alternatif | null>(null);
  const [alternatifData, setAlternatifData] = useState<Alternatif[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    jenis: "" as "Interior" | "Eksterior" | "",
  });

  useEffect(() => {
    fetchAlternatif();
  }, []);

  const fetchAlternatif = async () => {
    try {
      const response = await fetch("/api/alternatif", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (response.ok) {
        const data = await response.json();
        setAlternatifData(data);
      }
    } catch (error) {
      console.error("Error fetching alternatif:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/alternatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAlternatif();
        setIsAddOpen(false);
        setFormData({ kode: "", nama: "", jenis: "" });
        toast.success("Data alternatif berhasil ditambahkan!");
        router.refresh();
      } else {
        toast.error("Gagal menambahkan data alternatif!");
      }
    } catch (error) {
      console.error("Error adding alternatif:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
    }
  };

  const handleEdit = (item: Alternatif) => {
    setEditingItem(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      jenis: item.jenis,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const response = await fetch("/api/alternatif", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingItem.id, ...formData }),
      });

      if (response.ok) {
        await fetchAlternatif();
        setIsEditOpen(false);
        setEditingItem(null);
        setFormData({ kode: "", nama: "", jenis: "" });
        toast.success("Data alternatif berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal memperbarui data alternatif!");
      }
    } catch (error) {
      console.error("Error updating alternatif:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/alternatif?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAlternatif();
        toast.success("Data alternatif berhasil dihapus!");
        router.refresh();
      } else {
        toast.error("Gagal menghapus data alternatif!");
      }
    } catch (error) {
      console.error("Error deleting alternatif:", error);
      toast.error("Terjadi kesalahan saat menghapus data!");
    }
  };

  const filteredData = alternatifData.filter(
    (item) =>
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Data Alternatif</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Title Bar */}
        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
          <span className="text-base font-medium">Tabel Alternatif</span>
        </div>

        {/* Search and Add Button */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cari:</span>
              <Input
                className="w-48"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                      Tambah Data Alternatif
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
                        Kode Alternatif
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
                        htmlFor="add-jenis"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Jenis
                      </Label>
                      <Select
                        value={formData.jenis}
                        onValueChange={(value: "Interior" | "Eksterior") =>
                          setFormData({ ...formData, jenis: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="--Pilih Jenis Alternatif--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Interior">Interior</SelectItem>
                          <SelectItem value="Eksterior">Eksterior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="add-nama"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Nama Alternatif
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

          {/* Table */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Kode Alternatif</TableHead>
                    <TableHead>Nama Alternatif</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
                        <TableCell>{item.jenis}</TableCell>
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
                                  <AlertDialogTitle>
                                    Konfirmasi Hapus
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus data
                                    alternatif ini? Tindakan ini tidak dapat
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
            </div>{" "}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="bg-red-600 text-white px-4 py-2 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="text-white text-base font-medium">
                Ubah Data Alternatif
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
                  Kode Alternatif
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
                  htmlFor="edit-jenis"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Jenis
                </Label>
                <Select
                  value={formData.jenis}
                  onValueChange={(value: "Interior" | "Eksterior") =>
                    setFormData({ ...formData, jenis: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Jenis Alternatif--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Eksterior">Eksterior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="edit-nama"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Nama Alternatif
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
