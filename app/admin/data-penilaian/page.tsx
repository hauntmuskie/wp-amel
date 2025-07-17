"use client";

import { useState, useEffect } from "react";
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
import {
  getPenilaian,
  createPenilaian,
  deletePenilaianByAlternatif,
  PenilaianFormState,
} from "@/_actions/penilaian-actions";
import { getAlternatif } from "@/_actions/alternatif-actions";
import { getKriteria } from "@/_actions/kriteria-actions";
import { getSubKriteria } from "@/_actions/sub-kriteria-actions";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const result = await getPenilaian();
      if (result.success && result.data) {
        const mappedData = result.data.map(
          (item: {
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
          }) => ({
            id: item.id,
            alternatif_id: item.alternatif_id,
            kriteria_id: item.kriteria_id,
            sub_kriteria_id: item.sub_kriteria_id,
            nilai: item.nilai,
            kode_alternatif: item.kode_alternatif ?? "",
            nama_alternatif: item.nama_alternatif ?? "",
            kode_kriteria: item.kode_kriteria ?? "",
            nama_kriteria: item.nama_kriteria ?? "",
            nama_sub_kriteria: item.nama_sub_kriteria ?? "",
          })
        );
        setPenilaianData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching penilaian:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlternatif = async () => {
    try {
      const result = await getAlternatif();
      if (result.success && result.data) {
        setAlternatifData(result.data);
      }
    } catch (error) {
      console.error("Error fetching alternatif:", error);
    }
  };

  const fetchKriteria = async () => {
    try {
      const result = await getKriteria();
      if (result.success && result.data) {
        setKriteriaData(result.data);
      }
    } catch (error) {
      console.error("Error fetching kriteria:", error);
    }
  };

  const fetchSubKriteria = async () => {
    try {
      const result = await getSubKriteria();
      if (result.success && result.data) {
        const mappedData = result.data.map(
          (item: {
            id: number;
            kriteria_id: number;
            nama: string;
            bobot: string;
            keterangan: string | null;
          }) => ({
            id: item.id,
            kriteria_id: item.kriteria_id,
            nama: item.nama,
            bobot: item.bobot,
            keterangan: item.keterangan ?? "",
          })
        );
        setSubKriteriaData(mappedData);
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
      const alternatif_id = parseInt(formData.alternatif_id);
      const promises: Promise<PenilaianFormState>[] = [];

      kriteriaData.forEach((kriteria) => {
        const subKriteriaId =
          formData[
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData
          ];
        if (subKriteriaId) {
          const subKriteria = subKriteriaData.find(
            (sk) => sk.id === parseInt(subKriteriaId)
          );
          if (subKriteria) {
            promises.push(
              createPenilaian(
                alternatif_id,
                kriteria.id,
                parseInt(subKriteriaId),
                subKriteria.bobot
              )
            );
          }
        }
      });

      const results: PenilaianFormState[] = await Promise.all(promises);
      const hasError = results.some((result) => !result.success);

      if (hasError) {
        const errorResult = results.find((result) => !result.success);
        toast.error(errorResult?.error || "Gagal menambahkan data penilaian!");
      } else {
        await fetchPenilaian();
        toast.success("Data penilaian berhasil ditambahkan!");
        setIsAddOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding penilaian:", error);
      toast.error("Terjadi kesalahan saat menambahkan data!");
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
      const penilaianItem = alternatifPenilaian.find(
        (p) => p.kriteria_id === kriteria.id
      );
      if (penilaianItem) {
        formUpdate[
          `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formUpdate
        ] = penilaianItem.sub_kriteria_id.toString();
      }
    });

    setFormData(formUpdate);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);

    try {
      await deletePenilaianByAlternatif(editingItem.alternatif_id);

      const alternatif_id = parseInt(formData.alternatif_id);
      const promises: Promise<PenilaianFormState>[] = [];

      kriteriaData.forEach((kriteria) => {
        const subKriteriaId =
          formData[
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData
          ];
        if (subKriteriaId) {
          const subKriteria = subKriteriaData.find(
            (sk) => sk.id === parseInt(subKriteriaId)
          );
          if (subKriteria) {
            promises.push(
              createPenilaian(
                alternatif_id,
                kriteria.id,
                parseInt(subKriteriaId),
                subKriteria.bobot
              )
            );
          }
        }
      });

      const results: PenilaianFormState[] = await Promise.all(promises);
      const hasError = results.some((result) => !result.success);

      if (hasError) {
        const errorResult = results.find((result) => !result.success);
        toast.error(errorResult?.error || "Gagal memperbarui data penilaian!");
      } else {
        await fetchPenilaian();
        toast.success("Data penilaian berhasil diperbarui!");
        setIsEditOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating penilaian:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (alternatif_id: number) => {
    try {
      const result = await deletePenilaianByAlternatif(alternatif_id);
      if (result.success) {
        await fetchPenilaian();
        toast.success("Data penilaian berhasil dihapus!");
      } else {
        toast.error(result.error || "Gagal menghapus data penilaian!");
      }
    } catch (error) {
      console.error("Error deleting penilaian:", error);
      toast.error("Terjadi kesalahan saat menghapus data!");
    }
  };

  const groupedPenilaian = penilaianData.reduce(
    (acc, curr) => {
      if (!acc[curr.alternatif_id]) {
        acc[curr.alternatif_id] = {
          alternatif_id: curr.alternatif_id,
          kode_alternatif: curr.kode_alternatif,
          nama_alternatif: curr.nama_alternatif,
          kriteria: {},
        };
      }
      acc[curr.alternatif_id].kriteria[curr.kode_kriteria] = Number(curr.nilai);
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

  const filteredData = Object.values(groupedPenilaian).filter(
    (item: { kode_alternatif?: string; nama_alternatif?: string }) =>
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
      <SelectField
        label="Alternatif"
        id="add-alternatif"
        value={formData.alternatif_id}
        onChange={(value) => setFormData({ ...formData, alternatif_id: value })}
        placeholder="--Pilih Alternatif--"
        options={alternatifOptions}
        required
      />

      {kriteriaData.map((kriteria) => (
        <SelectField
          key={kriteria.id}
          label={`${kriteria.kode} - ${kriteria.nama}`}
          id={`add-${kriteria.kode.toLowerCase()}`}
          value={
            formData[
              `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData
            ]
          }
          onChange={(value) =>
            setFormData({
              ...formData,
              [`${kriteria.kode.toLowerCase()}_sub_kriteria_id`]: value,
            })
          }
          placeholder="--Pilih Sub Kriteria--"
          options={getSubKriteriaOptions(kriteria.kode)}
          required
        />
      ))}
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
          {loading ? (
            <DataLoadingStates
              loading={loading}
              hasData={penilaianData.length > 0}
              colSpan={kriteriaData.length + 4}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead className="min-w-[120px]">Kode</TableHead>
                    <TableHead className="min-w-[200px]">
                      Nama Alternatif
                    </TableHead>
                    {kriteriaData.map((kriteria) => (
                      <TableHead key={kriteria.id} className="min-w-[100px]">
                        {kriteria.kode}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={kriteriaData.length + 4}
                        className="text-center py-8"
                      >
                        Tidak ada data penilaian
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow key={item.alternatif_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.kode_alternatif}
                        </TableCell>
                        <TableCell>{item.nama_alternatif}</TableCell>
                        {kriteriaData.map((kriteria) => (
                          <TableCell key={kriteria.id}>
                            {item.kriteria[kriteria.kode] || "-"}
                          </TableCell>
                        ))}
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
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
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

          {kriteriaData.map((kriteria) => (
            <SelectField
              key={kriteria.id}
              label={`${kriteria.kode} - ${kriteria.nama}`}
              id={`edit-${kriteria.kode.toLowerCase()}`}
              value={
                formData[
                  `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData
                ]
              }
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [`${kriteria.kode.toLowerCase()}_sub_kriteria_id`]: value,
                })
              }
              placeholder="--Pilih Sub Kriteria--"
              options={getSubKriteriaOptions(kriteria.kode)}
              required
            />
          ))}
        </FormDialog>
      </Dialog>
    </div>
  );
}
