"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";
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

interface Penilaian {
  id: number;
  alternatif_id: number;
  kriteria_id: number;
  sub_kriteria_id: number;
  nilai: string;
  kode_alternatif: string;
  nama_alternatif: string;
  kode_kriteria: string;
  nama_kriteria: string;
  nama_sub_kriteria: string;
}

interface Alternatif {
  id: number;
  kode: string;
  nama: string;
  jenis: string;
}

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  bobot: string;
  jenis: string;
}

interface SubKriteria {
  id: number;
  kriteria_id: number;
  nama: string;
  bobot: string;
  keterangan: string;
}

export default function DataPenilaianPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Penilaian | null>(null);
  const [penilaianData, setPenilaianData] = useState<Penilaian[]>([]);
  const [alternatifData, setAlternatifData] = useState<Alternatif[]>([]);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);
  const [subKriteriaData, setSubKriteriaData] = useState<SubKriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    alternatif_id: "",
    c1_sub_kriteria_id: "",
    c2_sub_kriteria_id: "",
    c3_sub_kriteria_id: "",
    c4_sub_kriteria_id: "",
    c5_sub_kriteria_id: "",
  });

  useEffect(() => {
    fetchPenilaian();
    fetchAlternatif();
    fetchKriteria();
    fetchSubKriteria();
  }, []);

  const fetchPenilaian = async () => {
    try {
      const response = await fetch("/api/penilaian");
      if (response.ok) {
        const data = await response.json();
        setPenilaianData(data);
      }
    } catch (error) {
      console.error("Error fetching penilaian:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlternatif = async () => {
    try {
      const response = await fetch("/api/alternatif");
      if (response.ok) {
        const data = await response.json();
        setAlternatifData(data);
      }
    } catch (error) {
      console.error("Error fetching alternatif:", error);
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

  const fetchSubKriteria = async () => {
    try {
      const response = await fetch("/api/sub-kriteria");
      if (response.ok) {
        const data = await response.json();
        setSubKriteriaData(data);
      }
    } catch (error) {
      console.error("Error fetching sub kriteria:", error);
    }
  };

  const getSubKriteriaByKriteria = (kriteriaKode: string) => {
    const kriteria = kriteriaData.find((k) => k.kode === kriteriaKode);
    if (!kriteria) return [];
    return subKriteriaData.filter((sk) => sk.kriteria_id === kriteria.id);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get kriteria IDs
      const kriteriaMap = new Map(kriteriaData.map((k) => [k.kode, k.id]));

      const penilaianArray = [
        {
          kriteria_id: kriteriaMap.get("C1")!,
          sub_kriteria_id: parseInt(formData.c1_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C2")!,
          sub_kriteria_id: parseInt(formData.c2_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C3")!,
          sub_kriteria_id: parseInt(formData.c3_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C4")!,
          sub_kriteria_id: parseInt(formData.c4_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C5")!,
          sub_kriteria_id: parseInt(formData.c5_sub_kriteria_id),
        },
      ];

      for (const pen of penilaianArray) {
        const subKriteria = subKriteriaData.find(
          (sk) => sk.id === pen.sub_kriteria_id
        );
        if (subKriteria) {
          await fetch("/api/penilaian", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alternatif_id: parseInt(formData.alternatif_id),
              kriteria_id: pen.kriteria_id,
              sub_kriteria_id: pen.sub_kriteria_id,
              nilai: subKriteria.bobot,
            }),
          });
        }
      }

      await fetchPenilaian();
      setIsAddOpen(false);
      setFormData({
        alternatif_id: "",
        c1_sub_kriteria_id: "",
        c2_sub_kriteria_id: "",
        c3_sub_kriteria_id: "",
        c4_sub_kriteria_id: "",
        c5_sub_kriteria_id: "",
      });
    } catch (error) {
      console.error("Error adding penilaian:", error);
    }
  };

  const handleEdit = (item: Penilaian) => {
    setEditingItem(item);
    // Load existing data for this alternatif
    const alternatifPenilaian = penilaianData.filter(
      (p) => p.alternatif_id === item.alternatif_id
    );
    setFormData({
      alternatif_id: item.alternatif_id.toString(),
      c1_sub_kriteria_id:
        alternatifPenilaian
          .find((p) => p.kode_kriteria === "C1")
          ?.sub_kriteria_id.toString() || "",
      c2_sub_kriteria_id:
        alternatifPenilaian
          .find((p) => p.kode_kriteria === "C2")
          ?.sub_kriteria_id.toString() || "",
      c3_sub_kriteria_id:
        alternatifPenilaian
          .find((p) => p.kode_kriteria === "C3")
          ?.sub_kriteria_id.toString() || "",
      c4_sub_kriteria_id:
        alternatifPenilaian
          .find((p) => p.kode_kriteria === "C4")
          ?.sub_kriteria_id.toString() || "",
      c5_sub_kriteria_id:
        alternatifPenilaian
          .find((p) => p.kode_kriteria === "C5")
          ?.sub_kriteria_id.toString() || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      // Delete existing penilaian for this alternatif
      const alternatifPenilaian = penilaianData.filter(
        (p) => p.alternatif_id === editingItem.alternatif_id
      );
      for (const pen of alternatifPenilaian) {
        await fetch(`/api/penilaian?id=${pen.id}`, { method: "DELETE" });
      }

      // Add new penilaian
      const kriteriaMap = new Map(kriteriaData.map((k) => [k.kode, k.id]));

      const penilaianArray = [
        {
          kriteria_id: kriteriaMap.get("C1")!,
          sub_kriteria_id: parseInt(formData.c1_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C2")!,
          sub_kriteria_id: parseInt(formData.c2_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C3")!,
          sub_kriteria_id: parseInt(formData.c3_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C4")!,
          sub_kriteria_id: parseInt(formData.c4_sub_kriteria_id),
        },
        {
          kriteria_id: kriteriaMap.get("C5")!,
          sub_kriteria_id: parseInt(formData.c5_sub_kriteria_id),
        },
      ];

      for (const pen of penilaianArray) {
        const subKriteria = subKriteriaData.find(
          (sk) => sk.id === pen.sub_kriteria_id
        );
        if (subKriteria) {
          await fetch("/api/penilaian", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alternatif_id: parseInt(formData.alternatif_id),
              kriteria_id: pen.kriteria_id,
              sub_kriteria_id: pen.sub_kriteria_id,
              nilai: subKriteria.bobot,
            }),
          });
        }
      }

      await fetchPenilaian();
      setIsEditOpen(false);
      setEditingItem(null);
      setFormData({
        alternatif_id: "",
        c1_sub_kriteria_id: "",
        c2_sub_kriteria_id: "",
        c3_sub_kriteria_id: "",
        c4_sub_kriteria_id: "",
        c5_sub_kriteria_id: "",
      });
    } catch (error) {
      console.error("Error updating penilaian:", error);
    }
  };

  const handleDelete = async (alternatif_id: number) => {
    try {
      const alternatifPenilaian = penilaianData.filter(
        (p) => p.alternatif_id === alternatif_id
      );
      for (const pen of alternatifPenilaian) {
        await fetch(`/api/penilaian?id=${pen.id}`, { method: "DELETE" });
      }
      await fetchPenilaian();
    } catch (error) {
      console.error("Error deleting penilaian:", error);
    }
  };

  // Group penilaian by alternatif
  const groupedPenilaian = penilaianData.reduce((acc, curr) => {
    if (!acc[curr.alternatif_id]) {
      acc[curr.alternatif_id] = {
        alternatif_id: curr.alternatif_id,
        kode_alternatif: curr.kode_alternatif,
        nama_alternatif: curr.nama_alternatif,
        kriteria: {},
      };
    }
    acc[curr.alternatif_id].kriteria[curr.kode_kriteria] = curr.nilai;
    return acc;
  }, {} as Record<number, any>);

  const filteredData = Object.values(groupedPenilaian).filter(
    (item: any) =>
      item.kode_alternatif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_alternatif?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Data Penilaian
          </h1>
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

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-alternatif"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Kode Alternatif
                  </Label>
                  <Select
                    value={formData.alternatif_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, alternatif_id: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Kode Alternatif--" />
                    </SelectTrigger>
                    <SelectContent>
                      {alternatifData.map((alt) => (
                        <SelectItem key={alt.id} value={alt.id.toString()}>
                          {alt.kode} - {alt.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="add-nama-alternatif"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nama Alternatif
                  </Label>
                  <Input
                    id="add-nama-alternatif"
                    type="text"
                    className="w-full bg-gray-100"
                    value={
                      alternatifData.find(
                        (a) => a.id.toString() === formData.alternatif_id
                      )?.nama || ""
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-c1"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    (C1) Kualitas Pigmen
                  </Label>
                  <Select
                    value={formData.c1_sub_kriteria_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        c1_sub_kriteria_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Kualitas Pigmen--" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubKriteriaByKriteria("C1").map((sk) => (
                        <SelectItem key={sk.id} value={sk.id.toString()}>
                          {sk.bobot} - {sk.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="add-c2"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    (C2) Harga
                  </Label>
                  <Select
                    value={formData.c2_sub_kriteria_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        c2_sub_kriteria_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Harga--" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubKriteriaByKriteria("C2").map((sk) => (
                        <SelectItem key={sk.id} value={sk.id.toString()}>
                          {sk.bobot} - {sk.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="add-c3"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    (C3) Ketahanan
                  </Label>
                  <Select
                    value={formData.c3_sub_kriteria_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        c3_sub_kriteria_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Ketahanan--" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubKriteriaByKriteria("C3").map((sk) => (
                        <SelectItem key={sk.id} value={sk.id.toString()}>
                          {sk.bobot} - {sk.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="add-c4"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    (C4) Daya Sebar
                  </Label>
                  <Select
                    value={formData.c4_sub_kriteria_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        c4_sub_kriteria_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--Pilih Daya Sebar--" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubKriteriaByKriteria("C4").map((sk) => (
                        <SelectItem key={sk.id} value={sk.id.toString()}>
                          {sk.bobot} - {sk.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="add-c5"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  (C5) Variasi Warna
                </Label>
                <Select
                  value={formData.c5_sub_kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      c5_sub_kriteria_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Variasi Warna--" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubKriteriaByKriteria("C5").map((sk) => (
                      <SelectItem key={sk.id} value={sk.id.toString()}>
                        {sk.bobot} - {sk.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      alternatif_id: "",
                      c1_sub_kriteria_id: "",
                      c2_sub_kriteria_id: "",
                      c3_sub_kriteria_id: "",
                      c4_sub_kriteria_id: "",
                      c5_sub_kriteria_id: "",
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
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Tabel Penilaian</span>
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
                  Kode Alternatif
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Nama Alternatif
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  C1
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  C2
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  C3
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  C4
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  C5
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
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Tidak ada data penilaian
                  </td>
                </tr>
              ) : (
                filteredData.map((item: any, index) => (
                  <tr
                    key={item.alternatif_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.kode_alternatif}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.nama_alternatif}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.kriteria.C1 || "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.kriteria.C2 || "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.kriteria.C3 || "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.kriteria.C4 || "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.kriteria.C5 || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleEdit(
                              penilaianData.find(
                                (p) => p.alternatif_id === item.alternatif_id
                              )!
                            )
                          }
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
                                Apakah Anda yakin ingin menghapus penilaian
                                untuk "{item.nama_alternatif}"? Tindakan ini
                                tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.alternatif_id)}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="bg-red-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
              <DialogTitle className="flex items-center gap-2 text-white">
                <ClipboardList className="h-5 w-5" />
                Ubah Data Penilaian
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-alternatif"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Kode Alternatif
                </Label>
                <Select
                  value={formData.alternatif_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, alternatif_id: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kode Alternatif--" />
                  </SelectTrigger>
                  <SelectContent>
                    {alternatifData.map((alt) => (
                      <SelectItem key={alt.id} value={alt.id.toString()}>
                        {alt.kode} - {alt.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="edit-nama-alternatif"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Nama Alternatif
                </Label>
                <Input
                  id="edit-nama-alternatif"
                  type="text"
                  className="w-full bg-gray-100"
                  value={
                    alternatifData.find(
                      (a) => a.id.toString() === formData.alternatif_id
                    )?.nama || ""
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-c1"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  (C1) Kualitas Pigmen
                </Label>
                <Select
                  value={formData.c1_sub_kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      c1_sub_kriteria_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Kualitas Pigmen--" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubKriteriaByKriteria("C1").map((sk) => (
                      <SelectItem key={sk.id} value={sk.id.toString()}>
                        {sk.bobot} - {sk.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="edit-c2"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  (C2) Harga
                </Label>
                <Select
                  value={formData.c2_sub_kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      c2_sub_kriteria_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Harga--" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubKriteriaByKriteria("C2").map((sk) => (
                      <SelectItem key={sk.id} value={sk.id.toString()}>
                        {sk.bobot} - {sk.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="edit-c3"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  (C3) Ketahanan
                </Label>
                <Select
                  value={formData.c3_sub_kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      c3_sub_kriteria_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Ketahanan--" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubKriteriaByKriteria("C3").map((sk) => (
                      <SelectItem key={sk.id} value={sk.id.toString()}>
                        {sk.bobot} - {sk.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="edit-c4"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  (C4) Daya Sebar
                </Label>
                <Select
                  value={formData.c4_sub_kriteria_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      c4_sub_kriteria_id: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--Pilih Daya Sebar--" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubKriteriaByKriteria("C4").map((sk) => (
                      <SelectItem key={sk.id} value={sk.id.toString()}>
                        {sk.bobot} - {sk.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="edit-c5"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                (C5) Variasi Warna
              </Label>
              <Select
                value={formData.c5_sub_kriteria_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    c5_sub_kriteria_id: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--Pilih Variasi Warna--" />
                </SelectTrigger>
                <SelectContent>
                  {getSubKriteriaByKriteria("C5").map((sk) => (
                    <SelectItem key={sk.id} value={sk.id.toString()}>
                      {sk.bobot} - {sk.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    alternatif_id: "",
                    c1_sub_kriteria_id: "",
                    c2_sub_kriteria_id: "",
                    c3_sub_kriteria_id: "",
                    c4_sub_kriteria_id: "",
                    c5_sub_kriteria_id: "",
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
