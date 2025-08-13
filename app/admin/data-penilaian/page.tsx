"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ClipboardList } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { DataTableContainer } from "../_components/data-table-container";
import { SearchAndAddSection } from "../_components/search-and-add-section";
import { FormDialog } from "../_components/form-dialog";
import { SelectField } from "../_components/form-fields";
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

import type { Alternatif, Kriteria } from "@/database/schema";

// Matches the shape returned by getPenilaian()
type Penilaian = {
  id: number;
  alternatif_id: number;
  kriteria_id: number;
  sub_kriteria_id: number;
  nilai: string;
  kode_alternatif: string | null;
  nama_alternatif: string | null;
  kode_kriteria: string | null;
  nama_kriteria: string | null;
  nama_sub_kriteria: string | null;
};
import {
  getPenilaian,
  deletePenilaianByAlternatif,
  createBulkPenilaian,
  updateBulkPenilaian,
} from "@/_actions/evaluation";
import { getAlternatif } from "@/_actions/alternative";
import { getKriteria } from "@/_actions/criteria";
import { getSubKriteria } from "@/_actions/sub-criteria";

export default function DataPenilaianPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Penilaian | null>(null);
  const [penilaianData, setPenilaianData] = useState<Penilaian[]>([]);
  const [alternatifData, setAlternatifData] = useState<Alternatif[]>([]);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);

  type SubKriteriaRow = {
    id: number;
    kriteria_id: number;
    nama: string;
    bobot: string;
    keterangan: string | null;
    kode_kriteria: string | null;
    nama_kriteria: string | null;
  };
  const [subKriteriaData, setSubKriteriaData] = useState<SubKriteriaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    alternatif_id: "",
    c1_sub_kriteria_id: "",
    c2_sub_kriteria_id: "",
    c3_sub_kriteria_id: "",
    c4_sub_kriteria_id: "",
    c5_sub_kriteria_id: "",
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [penRes, altRes, kritRes, subkritRes] = await Promise.all([
      getPenilaian(),
      getAlternatif(),
      getKriteria(),
      getSubKriteria(),
    ]);
    if (penRes.success && penRes.data)
      setPenilaianData(penRes.data as Penilaian[]);
    if (altRes.success) setAlternatifData(altRes.data as Alternatif[]);
    if (kritRes.success) setKriteriaData(kritRes.data as Kriteria[]);
    if (subkritRes.success && subkritRes.data)
      setSubKriteriaData(subkritRes.data as SubKriteriaRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getSubKriteriaByKriteria = (kriteriaKode: string) => {
    const kriteria = kriteriaData.find((k) => k.kode === kriteriaKode);
    if (!kriteria) return [];
    return subKriteriaData.filter((sk) => sk.kriteria_id === kriteria.id);
  };

  const resetForm = () => {
    setFormData({
      alternatif_id: "",
      c1_sub_kriteria_id: "",
      c2_sub_kriteria_id: "",
      c3_sub_kriteria_id: "",
      c4_sub_kriteria_id: "",
      c5_sub_kriteria_id: "",
    });
    setEditingItem(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const penilaianArray = kriteriaData
        .map((kriteria) => {
          const formFieldKey =
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData;
          const subKriteriaId = formData[formFieldKey] as string;
          const subKriteria = subKriteriaData.find(
            (sk) => sk.id === parseInt(subKriteriaId)
          );
          return {
            kriteria_id: kriteria.id,
            sub_kriteria_id: parseInt(subKriteriaId),
            nilai: subKriteria?.bobot || "0",
          };
        })
        .filter((item) => item.sub_kriteria_id && !isNaN(item.sub_kriteria_id));

      const res = await createBulkPenilaian(
        parseInt(formData.alternatif_id),
        penilaianArray
      );

      if (res.success) {
        await fetchAll();
        setIsAddOpen(false);
        resetForm();
        toast.success("Data penilaian berhasil ditambahkan!");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menambahkan data penilaian!");
      }
    } catch (error) {
      console.error("Error adding penilaian:", error);
      toast.error("Gagal menambahkan data penilaian!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Penilaian) => {
    setEditingItem(item);
    const alternatifPenilaian = penilaianData.filter(
      (p) => p.alternatif_id === item.alternatif_id
    );

    const formUpdate = {
      alternatif_id: item.alternatif_id.toString(),
      c1_sub_kriteria_id: "",
      c2_sub_kriteria_id: "",
      c3_sub_kriteria_id: "",
      c4_sub_kriteria_id: "",
      c5_sub_kriteria_id: "",
    };

    kriteriaData.forEach((kriteria) => {
      const formFieldKey = `${kriteria.kode.toLowerCase()}_sub_kriteria_id`;
      const penilaianForKriteria = alternatifPenilaian.find(
        (p) => p.kode_kriteria === kriteria.kode
      );
      (formUpdate as Record<string, string>)[formFieldKey] =
        penilaianForKriteria?.sub_kriteria_id.toString() || "";
    });

    setFormData(formUpdate);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      // Build penilaian array dynamically based on existing kriteria
      const penilaianArray = kriteriaData
        .map((kriteria) => {
          const formFieldKey =
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData;
          const subKriteriaId = formData[formFieldKey] as string;
          const subKriteria = subKriteriaData.find(
            (sk) => sk.id === parseInt(subKriteriaId)
          );
          return {
            kriteria_id: kriteria.id,
            sub_kriteria_id: parseInt(subKriteriaId),
            nilai: subKriteria?.bobot || "0",
          };
        })
        .filter((item) => item.sub_kriteria_id && !isNaN(item.sub_kriteria_id));

      const res = await updateBulkPenilaian(
        parseInt(formData.alternatif_id),
        penilaianArray
      );

      if (res.success) {
        await fetchAll();
        setIsEditOpen(false);
        resetForm();
        toast.success("Data penilaian berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal memperbarui data penilaian!");
      }
    } catch (error) {
      console.error("Error updating penilaian:", error);
      toast.error("Gagal memperbarui data penilaian!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (alternatif_id: number) => {
    try {
      await deletePenilaianByAlternatif(alternatif_id);
      await fetchAll();
      toast.success("Data penilaian berhasil dihapus!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting penilaian:", error);
      toast.error("Gagal menghapus data penilaian!");
    }
  };

  const groupedPenilaian = penilaianData.reduce(
    (acc, curr) => {
      const kodeAlternatif = curr.kode_alternatif ?? "";
      const namaAlternatif = curr.nama_alternatif ?? "";
      const kodeKriteria = curr.kode_kriteria ?? "";
      if (!acc[curr.alternatif_id]) {
        acc[curr.alternatif_id] = {
          alternatif_id: curr.alternatif_id,
          kode_alternatif: kodeAlternatif,
          nama_alternatif: namaAlternatif,
          kriteria: {},
        };
      }
      if (kodeKriteria) {
        acc[curr.alternatif_id].kriteria[kodeKriteria] = Number(curr.nilai);
      }
      return acc;
    },
    {} as Record<
      number,
      {
        alternatif_id: number;
        kode_alternatif: string;
        nama_alternatif: string;
        kriteria: Record<string, number>;
      }
    >
  );

  type GroupedPenilaian = {
    alternatif_id: number;
    kode_alternatif: string | null;
    nama_alternatif: string | null;
    kriteria: Record<string, number>;
  };

  const filteredData: GroupedPenilaian[] = Object.values(
    groupedPenilaian as Record<number, GroupedPenilaian>
  ).filter(
    (item) =>
      item.kode_alternatif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_alternatif?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const alternatifOptions = alternatifData.map((a) => ({
    value: a.id.toString(),
    label: `${a.kode} - ${a.nama}`,
  }));

  const getSubKriteriaOptions = (kriteriaKode: string) => {
    return getSubKriteriaByKriteria(kriteriaKode).map((sk) => ({
      value: sk.id.toString(),
      label: `${sk.nama} (Bobot: ${parseInt(sk.bobot)})`,
    }));
  };

  const AddFormContent = (
    <FormDialog
      title="Tambah Data Penilaian"
      onSubmit={handleAdd}
      onCancel={() => {
        setIsAddOpen(false);
        resetForm();
      }}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <SelectField
            label="Alternatif"
            id="add-alternatif"
            value={formData.alternatif_id}
            onChange={(value) =>
              setFormData({ ...formData, alternatif_id: value })
            }
            placeholder="--Pilih Alternatif--"
            options={alternatifOptions}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="C1 - Kualitas Pigmen"
            id="add-c1"
            value={formData.c1_sub_kriteria_id}
            onChange={(value) =>
              setFormData({ ...formData, c1_sub_kriteria_id: value })
            }
            placeholder="--Pilih Sub Kriteria C1--"
            options={getSubKriteriaOptions("C1")}
            required
          />

          <SelectField
            label="C2 - Harga"
            id="add-c2"
            value={formData.c2_sub_kriteria_id}
            onChange={(value) =>
              setFormData({ ...formData, c2_sub_kriteria_id: value })
            }
            placeholder="--Pilih Sub Kriteria C2--"
            options={getSubKriteriaOptions("C2")}
            required
          />

          <SelectField
            label="C3 - Ketahanan"
            id="add-c3"
            value={formData.c3_sub_kriteria_id}
            onChange={(value) =>
              setFormData({ ...formData, c3_sub_kriteria_id: value })
            }
            placeholder="--Pilih Sub Kriteria C3--"
            options={getSubKriteriaOptions("C3")}
            required
          />

          <SelectField
            label="C4 - Daya Sebar"
            id="add-c4"
            value={formData.c4_sub_kriteria_id}
            onChange={(value) =>
              setFormData({ ...formData, c4_sub_kriteria_id: value })
            }
            placeholder="--Pilih Sub Kriteria C4--"
            options={getSubKriteriaOptions("C4")}
            required
          />

          <SelectField
            label="C5 - Waktu Pengeringan"
            id="add-c5"
            value={formData.c5_sub_kriteria_id}
            onChange={(value) =>
              setFormData({ ...formData, c5_sub_kriteria_id: value })
            }
            placeholder="--Pilih Sub Kriteria C5--"
            options={getSubKriteriaOptions("C5")}
            required
          />
        </div>
      </div>
    </FormDialog>
  );

  return (
    <div className="p-6">
      <PageHeader icon={ClipboardList} title="Data Penilaian" />

      <DataTableContainer title="Tabel Penilaian">
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
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Alternatif</TableHead>
                  <TableHead className="text-center">C1</TableHead>
                  <TableHead className="text-center">C2</TableHead>
                  <TableHead className="text-center">C3</TableHead>
                  <TableHead className="text-center">C4</TableHead>
                  <TableHead className="text-center">C5</TableHead>
                  <TableHead className="text-center w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DataLoadingStates
                  loading={loading}
                  hasData={filteredData.length > 0}
                  colSpan={9}
                  emptyMessage="Tidak ada data penilaian yang ditemukan."
                />
                {!loading &&
                  filteredData.map((item, index) => (
                    <TableRow key={item.alternatif_id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.kode_alternatif}
                      </TableCell>
                      <TableCell>{item.nama_alternatif}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.kriteria.C1 || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.kriteria.C2 || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.kriteria.C3 || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {item.kriteria.C4 || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {item.kriteria.C5 || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() =>
                            handleEdit(
                              penilaianData.find(
                                (p) => p.alternatif_id === item.alternatif_id
                              )!
                            )
                          }
                          onDelete={() => handleDelete(item.alternatif_id)}
                          deleteTitle="Hapus Data Penilaian"
                          deleteDescription={`Apakah Anda yakin ingin menghapus penilaian untuk "${item.nama_alternatif}"? Tindakan ini tidak dapat dibatalkan.`}
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
          title="Ubah Data Penilaian"
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditOpen(false);
            resetForm();
          }}
          isSubmitting={isSubmitting}
        >
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <SelectField
                label="Alternatif"
                id="edit-alternatif"
                value={formData.alternatif_id}
                onChange={(value) =>
                  setFormData({ ...formData, alternatif_id: value })
                }
                placeholder="--Pilih Alternatif--"
                options={alternatifOptions}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="C1 - Kualitas Pigmen"
                id="edit-c1"
                value={formData.c1_sub_kriteria_id}
                onChange={(value) =>
                  setFormData({ ...formData, c1_sub_kriteria_id: value })
                }
                placeholder="--Pilih Sub Kriteria C1--"
                options={getSubKriteriaOptions("C1")}
                required
              />

              <SelectField
                label="C2 - Harga"
                id="edit-c2"
                value={formData.c2_sub_kriteria_id}
                onChange={(value) =>
                  setFormData({ ...formData, c2_sub_kriteria_id: value })
                }
                placeholder="--Pilih Sub Kriteria C2--"
                options={getSubKriteriaOptions("C2")}
                required
              />

              <SelectField
                label="C3 - Ketahanan"
                id="edit-c3"
                value={formData.c3_sub_kriteria_id}
                onChange={(value) =>
                  setFormData({ ...formData, c3_sub_kriteria_id: value })
                }
                placeholder="--Pilih Sub Kriteria C3--"
                options={getSubKriteriaOptions("C3")}
                required
              />

              <SelectField
                label="C4 - Daya Sebar"
                id="edit-c4"
                value={formData.c4_sub_kriteria_id}
                onChange={(value) =>
                  setFormData({ ...formData, c4_sub_kriteria_id: value })
                }
                placeholder="--Pilih Sub Kriteria C4--"
                options={getSubKriteriaOptions("C4")}
                required
              />

              <SelectField
                label="C5 - Waktu Pengeringan"
                id="edit-c5"
                value={formData.c5_sub_kriteria_id}
                onChange={(value) =>
                  setFormData({ ...formData, c5_sub_kriteria_id: value })
                }
                placeholder="--Pilih Sub Kriteria C5--"
                options={getSubKriteriaOptions("C5")}
                required
              />
            </div>
          </div>
        </FormDialog>
      </Dialog>
    </div>
  );
}
