"use client";

import { useState, useEffect } from "react";
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
  const router = useRouter();

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
      const response = await fetch("/api/penilaian", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
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
      const kriteriaMap = new Map(kriteriaData.map((k) => [k.kode, k.id]));

      // Build penilaian array dynamically based on existing kriteria
      const penilaianArray = kriteriaData
        .map((kriteria) => {
          const formFieldKey =
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData;
          const subKriteriaId = formData[formFieldKey] as string;

          return {
            kriteria_id: kriteria.id,
            sub_kriteria_id: parseInt(subKriteriaId),
          };
        })
        .filter((item) => item.sub_kriteria_id && !isNaN(item.sub_kriteria_id));

      let hasError = false;
      let errorMessage = "";

      for (const pen of penilaianArray) {
        const subKriteria = subKriteriaData.find(
          (sk) => sk.id === pen.sub_kriteria_id
        );
        if (subKriteria) {
          const response = await fetch("/api/penilaian", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alternatif_id: parseInt(formData.alternatif_id),
              kriteria_id: pen.kriteria_id,
              sub_kriteria_id: pen.sub_kriteria_id,
              nilai: subKriteria.bobot,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            hasError = true;
            errorMessage = data.error || "Gagal menambahkan data penilaian!";
            break;
          }
        }
      }

      if (hasError) {
        toast.error(errorMessage);
      } else {
        await fetchPenilaian();
        setIsAddOpen(false);
        resetForm();
        toast.success("Data penilaian berhasil ditambahkan!");
        router.refresh();
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

    // Build form data dynamically based on existing kriteria
    const formUpdate: any = {
      alternatif_id: item.alternatif_id.toString(),
    };

    kriteriaData.forEach((kriteria) => {
      const formFieldKey = `${kriteria.kode.toLowerCase()}_sub_kriteria_id`;
      const penilaianForKriteria = alternatifPenilaian.find(
        (p) => p.kode_kriteria === kriteria.kode
      );
      formUpdate[formFieldKey] =
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
      const alternatifPenilaian = penilaianData.filter(
        (p) => p.alternatif_id === editingItem.alternatif_id
      );
      for (const pen of alternatifPenilaian) {
        await fetch(`/api/penilaian?id=${pen.id}`, { method: "DELETE" });
      }

      const kriteriaMap = new Map(kriteriaData.map((k) => [k.kode, k.id]));

      // Build penilaian array dynamically based on existing kriteria
      const penilaianArray = kriteriaData
        .map((kriteria) => {
          const formFieldKey =
            `${kriteria.kode.toLowerCase()}_sub_kriteria_id` as keyof typeof formData;
          const subKriteriaId = formData[formFieldKey] as string;

          return {
            kriteria_id: kriteria.id,
            sub_kriteria_id: parseInt(subKriteriaId),
          };
        })
        .filter((item) => item.sub_kriteria_id && !isNaN(item.sub_kriteria_id));

      for (const pen of penilaianArray) {
        const subKriteria = subKriteriaData.find(
          (sk) => sk.id === pen.sub_kriteria_id
        );
        if (subKriteria) {
          const response = await fetch("/api/penilaian", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alternatif_id: parseInt(formData.alternatif_id),
              kriteria_id: pen.kriteria_id,
              sub_kriteria_id: pen.sub_kriteria_id,
              nilai: subKriteria.bobot,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            toast.error(data.error || "Gagal memperbarui data penilaian!");
            return;
          }
        }
      }

      await fetchPenilaian();
      setIsEditOpen(false);
      resetForm();
      toast.success("Data penilaian berhasil diperbarui!");
      router.refresh();
    } catch (error) {
      console.error("Error updating penilaian:", error);
      toast.error("Gagal memperbarui data penilaian!");
    } finally {
      setIsSubmitting(false);
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
      toast.success("Data penilaian berhasil dihapus!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting penilaian:", error);
      toast.error("Gagal menghapus data penilaian!");
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
            label="C1 - Kualitas Cat"
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
            label="C3 - Daya Tahan"
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
            label="C4 - Kemudahan Aplikasi"
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
                label="C1 - Kualitas Cat"
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
                label="C3 - Daya Tahan"
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
                label="C4 - Kemudahan Aplikasi"
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
