"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BarChart3 } from "lucide-react";
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
import type { Kriteria } from "@/database/schema";
import {
  getKriteria,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from "@/_actions/criteria";
import { getEnums } from "@/_actions/enum";

export default function DataKriteriaPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);
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
    bobot: "",
    jenis: "" as "benefit" | "cost" | "",
  });

  useEffect(() => {
    fetchEnums();
    fetchKriteria();
  }, []);

  const fetchEnums = async () => {
    try {
      const res = await getEnums();
      if (res.success && res.data?.jenisKriteria) {
        setJenisOptions(res.data.jenisKriteria);
      }
    } catch (error) {
      console.error("Error fetching enums:", error);
    }
  };

  const fetchKriteria = async () => {
    setLoading(true);
    const res = await getKriteria();
    if (res.success) {
      setKriteriaData(res.data as Kriteria[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ kode: "", nama: "", bobot: "", jenis: "" });
    setEditingItem(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("kode", formData.kode);
      fd.append("nama", formData.nama);
      fd.append("bobot", formData.bobot);
      fd.append("jenis", formData.jenis);
      const res = await createKriteria({}, fd);
      if (res.success) {
        await fetchKriteria();
        setIsAddOpen(false);
        resetForm();
        toast.success("Data kriteria berhasil ditambahkan!");
        router.refresh();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal menambahkan data kriteria!");
      }
    } catch (error) {
      console.error("Error adding kriteria:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Kriteria) => {
    setEditingItem(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      bobot: Math.round(parseFloat(item.bobot)).toString(),
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
      fd.append("bobot", formData.bobot);
      fd.append("jenis", formData.jenis);
      const res = await updateKriteria(editingItem.id, {}, fd);
      if (res.success) {
        await fetchKriteria();
        toast.success("Data kriteria berhasil diperbarui!");
        router.refresh();
        setIsEditOpen(false);
        resetForm();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal memperbarui data kriteria!");
      }
    } catch (error) {
      console.error("Error updating kriteria:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteKriteria(id);
      if (res.success) {
        await fetchKriteria();
        toast.success("Data kriteria berhasil dihapus!");
        router.refresh();
      } else if (res.type === "info") {
        toast.info(res.error || "Info: tidak ada perubahan.");
      } else {
        toast.error(res.error || "Gagal menghapus data kriteria!");
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

  const handleBobotChange = (value: string) => {
    // Always store as integer string, no decimals
    const intValue = value ? parseInt(value, 10).toString() : "";
    setFormData({ ...formData, bobot: intValue });
  };

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Kriteria"
      onSubmit={handleAdd}
      onCancel={() => {
        setIsAddOpen(false);
        resetForm();
      }}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Kode Kriteria"
          id="add-kode"
          value={formData.kode}
          onChange={(value) => setFormData({ ...formData, kode: value })}
          placeholder="Masukkan kode kriteria"
          required
        />
        <TextField
          label="Bobot Kriteria"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Nama Kriteria"
          id="add-nama"
          value={formData.nama}
          onChange={(value) => setFormData({ ...formData, nama: value })}
          placeholder="Masukkan nama kriteria"
          required
        />
        <SelectField
          label="Atribut Kriteria"
          id="add-jenis"
          value={formData.jenis}
          onChange={(value) =>
            setFormData({ ...formData, jenis: value as "benefit" | "cost" })
          }
          placeholder="--Pilih Atribut Kriteria--"
          options={jenisOptions}
          required
        />
      </div>
    </FormDialog>
  );

  return (
    <div className="p-6">
      <PageHeader icon={BarChart3} title="Data Kriteria" />

      <DataTableContainer title="Tabel Kriteria">
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
                  <TableHead className="text-center">Bobot</TableHead>
                  <TableHead className="text-center">Atribut</TableHead>
                  <TableHead className="text-center w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DataLoadingStates
                  loading={loading}
                  hasData={filteredData.length > 0}
                  colSpan={6}
                  emptyMessage="Tidak ada data kriteria yang ditemukan."
                />
                {!loading &&
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-center">
                        {parseInt(item.bobot, 10)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.jenis === "benefit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.jenis === "benefit" ? "benefit" : "cost"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                          deleteTitle="Hapus Data Kriteria"
                          deleteDescription={`Apakah Anda yakin ingin menghapus kriteria "${item.nama}"? Tindakan ini tidak dapat dibatalkan.`}
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
          title="Ubah Data Kriteria"
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditOpen(false);
            resetForm();
          }}
          isSubmitting={isSubmitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Kode Kriteria"
              id="edit-kode"
              value={formData.kode}
              onChange={(value) => setFormData({ ...formData, kode: value })}
              required
            />
            <TextField
              label="Bobot Kriteria"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Nama Kriteria"
              id="edit-nama"
              value={formData.nama}
              onChange={(value) => setFormData({ ...formData, nama: value })}
              required
            />
            <SelectField
              label="Atribut Kriteria"
              id="edit-jenis"
              value={formData.jenis}
              onChange={(value) =>
                setFormData({ ...formData, jenis: value as "benefit" | "cost" })
              }
              placeholder="--Pilih Atribut Kriteria--"
              options={jenisOptions}
              required
            />
          </div>
        </FormDialog>
      </Dialog>
    </div>
  );
}
