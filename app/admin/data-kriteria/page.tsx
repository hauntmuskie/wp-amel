"use client";

import { useState, useEffect, useActionState } from "react";
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
import {
  getKriteria,
  createKriteria,
  updateKriteria,
  deleteKriteria,
  type KriteriaFormState,
} from "@/_actions/kriteria-actions";
import { getEnums } from "@/_actions/enum-actions";

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
  const [jenisOptions, setJenisOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [createState, createAction, isCreating] = useActionState<
    KriteriaFormState,
    FormData
  >(createKriteria, {});

  const [updateState, updateAction, isUpdating] = useActionState<
    KriteriaFormState,
    FormData
  >(
    editingItem ? updateKriteria.bind(null, editingItem.id) : createKriteria,
    {}
  );

  useEffect(() => {
    fetchKriteria();
    fetchEnums();
  }, []);

  useEffect(() => {
    if (createState.success) {
      setIsAddOpen(false);
      resetForm();
      toast.success("Data kriteria berhasil ditambahkan!");
      fetchKriteria();
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
      toast.success("Data kriteria berhasil diperbarui!");
      fetchKriteria();
    } else if (updateState.error) {
      if (updateState.type === "info") {
        toast.info(updateState.error);
      } else {
        toast.error(updateState.error);
      }
    }
  }, [updateState]);

  const fetchEnums = async () => {
    const result = await getEnums();
    if (result.success && result.data) {
      setJenisOptions(result.data.jenisKriteria);
    }
  };

  const fetchKriteria = async () => {
    setLoading(true);
    const result = await getKriteria();
    if (result.success && result.data) {
      setKriteriaData(result.data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingItem(null);
  };

  const handleEdit = (item: Kriteria) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteKriteria(id);
    if (result.success) {
      await fetchKriteria();
      toast.success("Data kriteria berhasil dihapus!");
    } else {
      toast.error(result.error || "Gagal menghapus data kriteria!");
    }
  };

  const filteredData = kriteriaData.filter(
    (item) =>
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Kriteria"
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
        <TextField
          label="Kode Kriteria"
          id="add-kode"
          name="kode"
          placeholder="Masukkan kode kriteria"
          required
        />
        <TextField
          label="Bobot Kriteria"
          id="add-bobot"
          name="bobot"
          type="number"
          min="1"
          max="5"
          step="1"
          placeholder="Masukkan Nilai Bobot 1-5"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Nama Kriteria"
          id="add-nama"
          name="nama"
          placeholder="Masukkan nama kriteria"
          required
        />
        <SelectField
          label="Atribut Kriteria"
          id="add-jenis"
          name="jenis"
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
                        {Number.parseInt(item.bobot, 10)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.jenis === "benefit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.jenis === "benefit" ? "Benefit" : "Cost"}
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
            <TextField
              label="Kode Kriteria"
              id="edit-kode"
              name="kode"
              defaultValue={editingItem?.kode}
              required
            />
            <TextField
              label="Bobot Kriteria"
              id="edit-bobot"
              name="bobot"
              type="number"
              min="1"
              max="5"
              step="1"
              defaultValue={
                editingItem?.bobot
                  ? Math.round(Number.parseFloat(editingItem.bobot)).toString()
                  : ""
              }
              placeholder="Masukkan Nilai Bobot 1-5"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Nama Kriteria"
              id="edit-nama"
              name="nama"
              defaultValue={editingItem?.nama}
              required
            />
            <SelectField
              label="Atribut Kriteria"
              id="edit-jenis"
              name="jenis"
              defaultValue={editingItem?.jenis}
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
