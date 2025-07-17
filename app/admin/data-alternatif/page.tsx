"use client";

import { useState, useEffect, useActionState } from "react";
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
import {
  getAlternatif,
  createAlternatif,
  updateAlternatif,
  deleteAlternatif,
  type AlternatifFormState,
} from "@/_actions/alternatif-actions";
import { getEnums } from "@/_actions/enum-actions";

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
  const [jenisOptions, setJenisOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [createState, createAction, isCreating] = useActionState<
    AlternatifFormState,
    FormData
  >(createAlternatif, {});

  const [updateState, updateAction, isUpdating] = useActionState<
    AlternatifFormState,
    FormData
  >(
    editingItem
      ? updateAlternatif.bind(null, editingItem.id)
      : createAlternatif,
    {}
  );

  useEffect(() => {
    fetchAlternatif();
    fetchEnums();
  }, []);

  useEffect(() => {
    if (createState.success) {
      setIsAddOpen(false);
      resetForm();
      toast.success("Data alternatif berhasil ditambahkan!");
      fetchAlternatif();
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
      toast.success("Data alternatif berhasil diperbarui!");
      fetchAlternatif();
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
      setJenisOptions(result.data.jenisAlternatif);
    }
  };

  const fetchAlternatif = async () => {
    setLoading(true);
    const result = await getAlternatif();
    if (result.success && result.data) {
      setAlternatifData(result.data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingItem(null);
  };

  const handleEdit = (item: Alternatif) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAlternatif(id);
    if (result.success) {
      await fetchAlternatif();
      toast.success("Data alternatif berhasil dihapus!");
    } else {
      toast.error(result.error || "Gagal menghapus data alternatif!");
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
          label="Kode Alternatif"
          id="add-kode"
          name="kode"
          placeholder="Masukkan kode alternatif"
          required
        />
        <SelectField
          label="Jenis"
          id="add-jenis"
          name="jenis"
          placeholder="--Pilih Jenis Alternatif--"
          options={jenisOptions}
          required
        />
      </div>
      <TextField
        label="Nama Alternatif"
        id="add-nama"
        name="nama"
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
              label="Kode Alternatif"
              id="edit-kode"
              name="kode"
              defaultValue={editingItem?.kode}
              required
            />
            <SelectField
              label="Jenis"
              id="edit-jenis"
              name="jenis"
              defaultValue={editingItem?.jenis}
              placeholder="--Pilih Jenis Alternatif--"
              options={jenisOptions}
              required
            />
          </div>
          <TextField
            label="Nama Alternatif"
            id="edit-nama"
            name="nama"
            defaultValue={editingItem?.nama}
            required
          />
        </FormDialog>
      </Dialog>
    </div>
  );
}
