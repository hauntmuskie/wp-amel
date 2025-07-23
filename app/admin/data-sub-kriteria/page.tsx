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

import {
  getSubKriteria,
  createSubKriteria,
  updateSubKriteria,
  deleteSubKriteria,
} from "@/_actions/sub-criteria";
import { getKriteria } from "@/_actions/criteria";

// Types matching the server action response shape
type SubKriteriaRow = {
  id: number;
  kriteria_id: number;
  nama: string;
  bobot: string;
  keterangan: string | null;
  kode_kriteria: string;
  nama_kriteria: string;
};

type KriteriaRow = {
  id: number;
  kode: string;
  nama: string;
};

export default function DataSubKriteriaPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubKriteriaRow | null>(null);
  const [subKriteriaData, setSubKriteriaData] = useState<SubKriteriaRow[]>([]);
  const [kriteriaData, setKriteriaData] = useState<KriteriaRow[]>([]);
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
      const res = await getSubKriteria();
      if (res.success && res.data) {
        setSubKriteriaData(res.data as SubKriteriaRow[]);
      }
    } catch (error) {
      console.error("Error fetching sub kriteria:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKriteria = async () => {
    try {
      const res = await getKriteria();
      if (res.success) {
        setKriteriaData(res.data as KriteriaRow[]);
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
      const fd = new FormData();
      fd.append("kriteria_id", formData.kriteria_id);
      fd.append("nama", formData.nama);
      fd.append("bobot", formData.bobot);
      fd.append("keterangan", formData.keterangan);

      const res = await createSubKriteria({}, fd);

      if (res.success) {
        await fetchSubKriteria();
        setIsAddOpen(false);
        resetForm();
        toast.success("Data sub kriteria berhasil ditambahkan!");
        router.refresh();
      } else if (res.type === "info") {
        toast.info(res.error || "Data tidak ada perubahan!");
      } else {
        toast.error(res.error || "Gagal menambahkan data sub kriteria!");
      }
    } catch (error) {
      console.error("Error adding sub kriteria:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: SubKriteriaRow) => {
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
      const fd = new FormData();
      fd.append("kriteria_id", formData.kriteria_id);
      fd.append("nama", formData.nama);
      fd.append("bobot", formData.bobot);
      fd.append("keterangan", formData.keterangan);

      const res = await updateSubKriteria(editingItem.id, {}, fd);

      if (res.success) {
        await fetchSubKriteria();
        toast.success("Data sub kriteria berhasil diperbarui!");
        router.refresh();
        setIsEditOpen(false);
        resetForm();
      } else if (res.type === "info") {
        toast.info(res.error || "Data tidak ada perubahan!");
        setIsEditOpen(false);
        resetForm();
      } else {
        toast.error(res.error || "Gagal memperbarui data sub kriteria!");
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
      const res = await deleteSubKriteria(id);

      if (res.success) {
        await fetchSubKriteria();
        toast.success("Data sub kriteria berhasil dihapus!");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus data sub kriteria!");
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
