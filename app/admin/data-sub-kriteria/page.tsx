"use client";

import { useState, useEffect, useActionState } from "react";
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
  SubKriteriaFormState,
} from "@/_actions/sub-kriteria-actions";
import { getKriteria } from "@/_actions/kriteria-actions";

interface SubKriteria {
  id: number;
  kriteria_id: number;
  nama: string;
  bobot: string;
  keterangan: string | null;
  kode_kriteria: string | null;
  nama_kriteria: string | null;
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

  const [createState, createAction, isCreating] = useActionState<
    SubKriteriaFormState,
    FormData
  >(createSubKriteria, {});

  const [updateState, updateAction, isUpdating] = useActionState<
    SubKriteriaFormState,
    FormData
  >(
    editingItem
      ? updateSubKriteria.bind(null, editingItem.id)
      : createSubKriteria,
    {}
  );

  useEffect(() => {
    fetchSubKriteria();
    fetchKriteria();
  }, []);

  useEffect(() => {
    if (createState.success) {
      setIsAddOpen(false);
      resetForm();
      toast.success("Data sub kriteria berhasil ditambahkan!");
      fetchSubKriteria();
    } else if (createState.error) {
      if (createState.type === "info") {
        toast.info(createState.error);
      } else {
        toast.error(createState.error);
      }
    }
  }, [createState]);

  useEffect(() => {
    if (updateState.success) {
      setIsEditOpen(false);
      resetForm();
      toast.success("Data sub kriteria berhasil diperbarui!");
      fetchSubKriteria();
    } else if (updateState.error) {
      if (updateState.type === "info") {
        toast.info(updateState.error);
      } else {
        toast.error(updateState.error);
      }
    }
  }, [updateState]);

  const fetchSubKriteria = async () => {
    setLoading(true);
    const result = await getSubKriteria();
    if (result.success && result.data) {
      setSubKriteriaData(result.data);
    }
    setLoading(false);
  };

  const fetchKriteria = async () => {
    const result = await getKriteria();
    if (result.success && result.data) {
      setKriteriaData(result.data);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
  };

  const handleEdit = (item: SubKriteria) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteSubKriteria(id);
    if (result.success) {
      await fetchSubKriteria();
      toast.success("Data sub kriteria berhasil dihapus!");
    } else {
      toast.error(result.error || "Gagal menghapus data sub kriteria!");
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

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Sub Kriteria"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        createAction(formData);
      }}
      onCancel={() => {
        setIsAddOpen(false);
        resetForm();
      }}
      isSubmitting={isCreating}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Kriteria"
          id="add-kriteria"
          name="kriteria_id"
          placeholder="--Pilih Kriteria--"
          options={kriteriaOptions}
          required
        />
        <TextField
          label="Bobot Sub Kriteria"
          id="add-bobot"
          name="bobot"
          type="number"
          min="1"
          max="5"
          step="1"
          placeholder="Masukkan bobot 1-5"
          required
        />
      </div>
      <TextField
        label="Nama Sub Kriteria"
        id="add-nama"
        name="nama"
        placeholder="Masukkan nama sub kriteria"
        required
      />
      <TextField
        label="Keterangan (Opsional)"
        id="add-keterangan"
        name="keterangan"
        placeholder="Masukkan keterangan..."
      />
    </FormDialog>
  );

  return (
    <div className="p-6">
      <PageHeader icon={Users} title="Data Sub Kriteria" />

      <DataTableContainer title="Tabel Sub Kriteria">
        <SearchAndAddSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsAddOpen(true)}
          isAddOpen={isAddOpen}
          onAddOpenChange={setIsAddOpen}
          addDialogContent={AddFormContent}
        />

        <div className="p-4">
          {loading ? (
            <DataLoadingStates loading={loading} hasData={false} colSpan={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kode Kriteria</TableHead>
                  <TableHead>Nama Kriteria</TableHead>
                  <TableHead>Nama Sub Kriteria</TableHead>
                  <TableHead>Bobot</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tidak ada data sub kriteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.kode_kriteria}
                      </TableCell>
                      <TableCell>{item.nama_kriteria}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>
                        {Math.round(parseFloat(item.bobot))}
                      </TableCell>
                      <TableCell>{item.keterangan || "-"}</TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DataTableContainer>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <FormDialog
          title="Ubah Data Sub Kriteria"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            updateAction(formData);
          }}
          onCancel={() => {
            setIsEditOpen(false);
            resetForm();
          }}
          isSubmitting={isUpdating}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Kriteria"
              id="edit-kriteria"
              name="kriteria_id"
              placeholder="--Pilih Kriteria--"
              options={kriteriaOptions}
              defaultValue={editingItem?.kriteria_id.toString()}
              required
            />
            <TextField
              label="Bobot Sub Kriteria"
              id="edit-bobot"
              name="bobot"
              type="number"
              min="1"
              max="5"
              step="1"
              placeholder="Masukkan bobot 1-5"
              defaultValue={
                editingItem
                  ? Math.round(parseFloat(editingItem.bobot)).toString()
                  : ""
              }
              required
            />
          </div>
          <TextField
            label="Nama Sub Kriteria"
            id="edit-nama"
            name="nama"
            placeholder="Masukkan nama sub kriteria"
            defaultValue={editingItem?.nama}
            required
          />
          <TextField
            label="Keterangan (Opsional)"
            id="edit-keterangan"
            name="keterangan"
            placeholder="Masukkan keterangan..."
            defaultValue={editingItem?.keterangan || ""}
          />
        </FormDialog>
      </Dialog>
    </div>
  );
}
