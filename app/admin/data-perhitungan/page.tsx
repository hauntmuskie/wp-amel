"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calculator, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { DataTableContainer } from "../_components/data-table-container";
import { DataLoadingStates } from "../_components/data-loading-states";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateWeightedProduct,
  getWeightedProductResults,
} from "@/_actions/weighted-product-actions";
import { getKriteria } from "@/_actions/kriteria-actions";

interface NormalisasiBobot {
  id: number;
  kriteria_id: number;
  kode_kriteria: string | null;
  nama_kriteria: string | null;
  jenis_kriteria: string | null;
  bobot_awal: string;
  bobot_normal: string;
}

interface HasilPerhitungan {
  id: number;
  alternatif_id: number;
  kode_alternatif: string | null;
  nama_alternatif: string | null;
  nilai_vektor_s: string;
  nilai_vektor_v: string;
  ranking: number;
}

export default function DataHasilNilaiPage() {
  const [normalisasiData, setNormalisasiData] = useState<NormalisasiBobot[]>(
    []
  );
  const [hasilData, setHasilData] = useState<HasilPerhitungan[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [kriteriaCodes, setKriteriaCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchResults();
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    const result = await getKriteria();
    if (result.success && result.data) {
      const codes = result.data.map((k: { kode: string }) => k.kode).sort();
      setKriteriaCodes(codes);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    const result = await getWeightedProductResults();
    if (result.success && result.data) {
      setNormalisasiData(result.data.normalisasi_bobot || []);
      setHasilData(result.data.hasil_perhitungan || []);
    }
    setLoading(false);
  };

  const handleCalculate = async () => {
    setCalculating(true);
    const result = await calculateWeightedProduct();

    if (result.success && result.data) {
      setNormalisasiData(result.data.normalisasi_bobot || []);
      setHasilData(result.data.hasil_perhitungan || []);
      toast.success("Perhitungan Weighted Product berhasil!");
      await fetchResults();
    } else {
      toast.error(
        result.error ||
          "Gagal melakukan perhitungan. Pastikan data alternatif, kriteria, dan penilaian sudah lengkap."
      );
    }
    setCalculating(false);
  };

  const formatNumber = (value: string, decimals = 5) => {
    return Number.parseFloat(value).toFixed(decimals);
  };

  return (
    <div className="p-6">
      <PageHeader icon={Calculator} title="Data Perhitungan" />

      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCalculate}
          disabled={calculating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {calculating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Calculator className="h-4 w-4 mr-2" />
          )}
          {calculating ? "Menghitung..." : "Hitung Weighted Product"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Perbaikan Bobot Kriteria */}
        <DataTableContainer title="Perbaikan Bobot Kriteria">
          <div className="p-4">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kriteria</TableHead>
                    {kriteriaCodes.map((kode) => {
                      const k = normalisasiData.find(
                        (n) => n.kode_kriteria === kode
                      );
                      return (
                        <TableHead className="text-center" key={kode}>
                          {kode} (
                          {k?.jenis_kriteria === "benefit" ? "Benefit" : "Cost"}
                          )
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <DataLoadingStates
                    loading={loading}
                    hasData={normalisasiData.length > 0}
                    colSpan={kriteriaCodes.length + 1}
                    emptyMessage="Belum ada data normalisasi. Klik tombol 'Hitung Weighted Product' untuk memulai perhitungan."
                  />
                  {!loading && normalisasiData.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell className="font-semibold">
                          Bobot Awal
                        </TableCell>
                        {kriteriaCodes.map((kode) => {
                          const k = normalisasiData.find(
                            (n) => n.kode_kriteria === kode
                          );
                          return (
                            <TableCell className="text-center" key={kode}>
                              {k ? Number.parseInt(k.bobot_awal, 10) : "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          Normalisasi
                        </TableCell>
                        {kriteriaCodes.map((kode) => {
                          const k = normalisasiData.find(
                            (n) => n.kode_kriteria === kode
                          );
                          return (
                            <TableCell className="text-center" key={kode}>
                              {k ? Number(k.bobot_normal).toFixed(5) : "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Rumus Explanation */}
          <div className="p-4 bg-gray-50 border-t">
            <h4 className="font-medium text-gray-800 mb-2">
              Perhitungan Normalisasi:
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Formula: W<sub>j</sub> = W<sub>j</sub> / ∑W<sub>j</sub>
            </p>
            <p className="text-sm text-gray-600">
              Untuk kriteria <strong>benefit</strong>: gunakan nilai positif (+)
              | Untuk kriteria <strong>cost</strong>: gunakan nilai negatif (-)
            </p>
          </div>
        </DataTableContainer>

        {/* Perangkingan */}
        <DataTableContainer title="Perangkingan Hasil Weighted Product">
          <div className="p-4">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Kode Alternatif</TableHead>
                    <TableHead>Nama Alternatif</TableHead>
                    <TableHead className="text-center">
                      Nilai Vektor S
                    </TableHead>
                    <TableHead className="text-center">
                      Nilai Vektor V
                    </TableHead>
                    <TableHead className="text-center">Ranking</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <DataLoadingStates
                    loading={loading}
                    hasData={hasilData.length > 0}
                    colSpan={6}
                    emptyMessage="Belum ada hasil perhitungan. Klik tombol 'Hitung Weighted Product' untuk memulai perhitungan."
                  />
                  {!loading &&
                    hasilData
                      .sort((a, b) => a.ranking - b.ranking)
                      .map((item, index) => (
                        <TableRow
                          key={item.id}
                          className={item.ranking === 1 ? "bg-green-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.kode_alternatif}
                          </TableCell>
                          <TableCell>{item.nama_alternatif}</TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {formatNumber(item.nilai_vektor_s)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {formatNumber(item.nilai_vektor_v)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.ranking === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.ranking === 2
                                  ? "bg-gray-100 text-gray-800"
                                  : item.ranking === 3
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.ranking}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="p-4 bg-gray-50 border-t">
            <h4 className="font-medium text-gray-800 mb-2">
              Perhitungan Weighted Product:
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Vektor S:</strong> S<sub>i</sub> = ∏ (X<sub>ij</sub>)
                <sup>
                  w<sub>j</sub>
                </sup>
              </p>
              <p>
                <strong>Vektor V:</strong> V<sub>i</sub> = S<sub>i</sub> / ∑S
                <sub>i</sub>
              </p>
              <p className="text-xs mt-2">
                Dimana X<sub>ij</sub> adalah nilai alternatif ke-i pada kriteria
                ke-j, dan w<sub>j</sub> adalah bobot yang telah dinormalisasi
                untuk kriteria ke-j.
              </p>
            </div>
          </div>
        </DataTableContainer>

        {/* Summary */}
        {hasilData.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Kesimpulan
            </h3>
            <p className="text-gray-700">
              Berdasarkan perhitungan Weighted Product, alternatif terbaik
              adalah{" "}
              <span className="font-bold text-green-700">
                {hasilData.find((h) => h.ranking === 1)?.nama_alternatif}
              </span>{" "}
              dengan nilai vektor V ={" "}
              <span className="font-bold text-green-700">
                {formatNumber(
                  hasilData.find((h) => h.ranking === 1)?.nilai_vektor_v || "0"
                )}
              </span>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
