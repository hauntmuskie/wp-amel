"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { DataTableContainer } from "../_components/data-table-container";
import { SearchAndAddSection } from "../_components/search-and-add-section";
import { FormDialog } from "../_components/form-dialog";
import { TextField, SelectField } from "../_components/form-fields";
import { ActionButtons } from "../_components/action-buttons";
import { DataLoadingStates } from "../_components/data-loading-states";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      const response = await fetch("/api/sub-kriteria", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
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

  const resetForm = () => {
    setFormData({ kriteria_id: "", nama: "", bobot: "", keterangan: "" });
    setEditingItem(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sub-kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          kriteria_id: parseInt(formData.kriteria_id),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchSubKriteria();
        setIsAddOpen(false);
        resetForm();
        toast.success(data.message || "Data sub kriteria berhasil ditambahkan!");
        router.refresh();
      } else {
        toast.error(data.error || "Gagal menambahkan data sub kriteria!");
      }
    } catch (error) {
      console.error("Error adding sub kriteria:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: SubKriteria) => {
    setEditingItem(item);
    setFormData({
      kriteria_id: item.kriteria_id.toString(),
      nama: item.nama,
      bobot: Math.round(parseFloat(item.bobot)).toString(),
      keterangan: item.keterangan || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);

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

      const data = await response.json();

      if (response.ok) {
        if (data.type === "info") {
          toast.info(data.error);
        } else {
          await fetchSubKriteria();
          toast.success(data.message || "Data sub kriteria berhasil diperbarui!");
          router.refresh();
        }
        setIsEditOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Gagal memperbarui data sub kriteria!");
      }
    } catch (error) {
      console.error("Error updating sub kriteria:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sub-kriteria?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSubKriteria();
        toast.success("Data sub kriteria berhasil dihapus!");
        router.refresh();
      } else {
        toast.error("Gagal menghapus data sub kriteria!");
      }
    } catch (error) {
      console.error("Error deleting sub kriteria:", error);
      toast.error("Terjadi kesalahan saat menghapus data!");
    }
  };

  const filteredData = subKriteriaData.filter(
    (item) =>
      item.kode_kriteria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_kriteria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kriteriaOptions = kriteriaData.map((k) => ({
    value: k.id.toString(),
    label: `${k.kode} - ${k.nama}`,
  }));

  const handleBobotChange = (value: string) => {
    // Always store as integer string, no decimals
    const intValue = value ? parseInt(value, 10).toString() : "";
    setFormData({ ...formData, bobot: intValue });
  };

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Sub Kriteria"
      onSubmit={handleAdd}
      onCancel={() => {
        setIsAddOpen(false);
        resetForm();
      }}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Kriteria"
          id="add-kriteria"
          value={formData.kriteria_id}
          onChange={(value) => setFormData({ ...formData, kriteria_id: value })}
          placeholder="--Pilih Kriteria--"
          options={kriteriaOptions}
          required
        />
        <TextField
          label="Bobot Sub Kriteria"
          id="add-bobot"
          type="number"
          min="1"
          max="5"
          step="1"
          value={formData.bobot}
          onChange={handleBobotChange}
          placeholder="Masukkan Nilai Bobot 1-5"
          required
        />
      </div>
      <TextField
        label="Nama Sub Kriteria"
        id="add-nama"
        value={formData.nama}
        onChange={(value) => setFormData({ ...formData, nama: value })}
        placeholder="Masukkan nama sub kriteria"
        required
      />
      <TextField
        label="Keterangan (Opsional)"
        id="add-keterangan"
        value={formData.keterangan}
        onChange={(value) => setFormData({ ...formData, keterangan: value })}
        placeholder="Masukkan keterangan..."
      />
    </FormDialog>
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader icon={Users} title="Data Sub Kriteria" />

      <DataTableContainer title="Tabel Sub Kriteria">
        {/* Search and Tambah Button Section */}
        <SearchAndAddSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsAddOpen(true)}
          isAddOpen={isAddOpen}
          onAddOpenChange={setIsAddOpen}
          addDialogContent={AddFormContent}
        />

        <div className="p-4">
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Kode Kriteria</TableHead>
                  <TableHead>Nama Kriteria</TableHead>
                  <TableHead>Nama Sub Kriteria</TableHead>
                  <TableHead>Bobot</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-center w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DataLoadingStates
                  loading={loading}
                  hasData={filteredData.length > 0}
                  colSpan={7}
                  emptyMessage="Tidak ada data sub kriteria yang ditemukan."
                />
                {!loading &&
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.kode_kriteria}
                      </TableCell>
                      <TableCell>{item.nama_kriteria}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-center">
                        {Math.round(Number(item.bobot))}
                      </TableCell>
                      <TableCell>{item.keterangan}</TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                          deleteTitle="Hapus Data Sub Kriteria"
                          deleteDescription={`Apakah Anda yakin ingin menghapus sub kriteria "${item.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DataTableContainer>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <FormDialog
          title="Ubah Data Sub Kriteria"
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditOpen(false);
            resetForm();
          }}
          isSubmitting={isSubmitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Kriteria"
              id="edit-kriteria"
              value={formData.kriteria_id}
              onChange={(value) =>
                setFormData({ ...formData, kriteria_id: value })
              }
              placeholder="--Pilih Kriteria--"
              options={kriteriaOptions}
              required
            />
            <TextField
              label="Nama Kriteria"
              id="edit-nama-kriteria"
              value={
                kriteriaData.find(
                  (k) => k.id.toString() === formData.kriteria_id
                )?.nama || ""
              }
              onChange={() => {}}
              className="w-full bg-gray-100"
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Nama Sub Kriteria"
              id="edit-nama-sub"
              value={formData.nama}
              onChange={(value) => setFormData({ ...formData, nama: value })}
              required
            />
            <TextField
              label="Bobot Sub Kriteria"
              id="edit-bobot"
              type="number"
              min="1"
              max="5"
              step="1"
              value={formData.bobot}
              onChange={handleBobotChange}
              placeholder="Masukkan Nilai Bobot 1-5"
              required
            />
          </div>
          <TextField
            label="Keterangan (Opsional)"
            id="edit-keterangan"
            value={formData.keterangan}
            onChange={(value) =>
              setFormData({ ...formData, keterangan: value })
            }
            placeholder="Masukkan keterangan..."
          />
        </FormDialog>
      </Dialog>
    </div>
  );
}
