"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Database } from "lucide-react";
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

import type { Alternatif } from "@/database/schema";

import {
  getAlternatif,
  createAlternatif,
  updateAlternatif,
  deleteAlternatif,
} from "@/_actions/alternative";
import { getEnums } from "@/_actions/enum";

export default function DataAlternatifPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Alternatif | null>(null);
  const [alternatifData, setAlternatifData] = useState<Alternatif[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisOptions, setJenisOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    jenis: "" as "Interior" | "Eksterior" | "",
  });

  useEffect(() => {
    fetchEnums();
    fetchAlternatif();
  }, []);

  const fetchEnums = async () => {
    try {
      const res = await getEnums();
      if (res.success && res.data?.jenisAlternatif) {
        setJenisOptions(res.data.jenisAlternatif);
      }
    } catch (error) {
      console.error("Error fetching enums:", error);
    }
  };

  const fetchAlternatif = async () => {
    setLoading(true);
    const res = await getAlternatif();
    if (res.success) {
      setAlternatifData(res.data as Alternatif[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ kode: "", nama: "", jenis: "" });
    setEditingItem(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("kode", formData.kode);
      fd.append("nama", formData.nama);
      fd.append("jenis", formData.jenis);
      const res = await createAlternatif({}, fd);
      if (res.success) {
        await fetchAlternatif();
        setIsAddOpen(false);
        resetForm();
        toast.success("Data alternatif berhasil ditambahkan!");
        router.refresh();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal menambahkan data alternatif!");
      }
    } catch (error) {
      console.error("Error adding alternatif:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
    } finally {
      setIsSubmitting(false);
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
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("kode", formData.kode);
      fd.append("nama", formData.nama);
      fd.append("jenis", formData.jenis);
      const res = await updateAlternatif(editingItem.id, {}, fd);
      if (res.success) {
        await fetchAlternatif();
        toast.success("Data alternatif berhasil diperbarui!");
        router.refresh();
        setIsEditOpen(false);
        resetForm();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal memperbarui data alternatif!");
      }
    } catch (error) {
      console.error("Error updating alternatif:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteAlternatif(id);
      if (res.success) {
        await fetchAlternatif();
        toast.success("Data alternatif berhasil dihapus!");
        router.refresh();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal menghapus data alternatif!");
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

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Alternatif"
      onSubmit={handleAdd}
      onCancel={() => {
        setIsAddOpen(false);
        resetForm();
      }}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Kode Alternatif"
          id="add-kode"
          value={formData.kode}
          onChange={(value) => setFormData({ ...formData, kode: value })}
          placeholder="Masukkan kode alternatif"
          required
        />
        <SelectField
          label="Jenis"
          id="add-jenis"
          value={formData.jenis}
          onChange={(value) =>
            setFormData({
              ...formData,
              jenis: value as "Interior" | "Eksterior",
            })
          }
          placeholder="--Pilih Jenis Alternatif--"
          options={jenisOptions}
          required
        />
      </div>
      <TextField
        label="Nama Alternatif"
        id="add-nama"
        value={formData.nama}
        onChange={(value) => setFormData({ ...formData, nama: value })}
        placeholder="Masukkan nama alternatif"
        required
      />
    </FormDialog>
  );

  return (
    <div className="p-6">
      <PageHeader icon={Database} title="Data Alternatif" />

      <DataTableContainer title="Tabel Alternatif">
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
                  <TableHead>Kode Alternatif</TableHead>
                  <TableHead className="w-64">Nama Alternatif</TableHead>
                  <TableHead className="text-center">Jenis</TableHead>
                  <TableHead className="text-center w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DataLoadingStates
                  loading={loading}
                  hasData={filteredData.length > 0}
                  colSpan={5}
                  emptyMessage="Tidak ada data alternatif yang ditemukan."
                />
                {!loading &&
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell className="w-64 truncate">
                        {item.nama}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.jenis === "Interior"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.jenis}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                          deleteTitle="Hapus Data Alternatif"
                          deleteDescription={`Apakah Anda yakin ingin menghapus alternatif "${item.nama}"? Tindakan ini tidak dapat dibatalkan.`}
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
          title="Ubah Data Alternatif"
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditOpen(false);
            resetForm();
          }}
          isSubmitting={isSubmitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Kode Alternatif"
              id="edit-kode"
              value={formData.kode}
              onChange={(value) => setFormData({ ...formData, kode: value })}
              required
            />
            <SelectField
              label="Jenis"
              id="edit-jenis"
              value={formData.jenis}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  jenis: value as "Interior" | "Eksterior",
                })
              }
              placeholder="--Pilih Jenis Alternatif--"
              options={jenisOptions}
              required
            />
          </div>
          <TextField
            label="Nama Alternatif"
            id="edit-nama"
            value={formData.nama}
            onChange={(value) => setFormData({ ...formData, nama: value })}
            required
          />
        </FormDialog>
      </Dialog>
    </div>
  );
}
