"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calculator, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NormalisasiBobot {
  id: number;
  kriteria_id: number;
  kode_kriteria: string;
  nama_kriteria: string;
  jenis_kriteria: string;
  bobot_awal: string;
  bobot_normal: string;
}

interface HasilPerhitungan {
  id: number;
  alternatif_id: number;
  kode_alternatif: string;
  nama_alternatif: string;
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
  const router = useRouter();

  useEffect(() => {
    fetchResults();
    // Add an interval to refresh data periodically
    const interval = setInterval(fetchResults, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Add event listener for focus to refresh data when user comes back to tab
  useEffect(() => {
    const handleFocus = () => {
      fetchResults();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchResults = async () => {
    try {
      // Force fresh data by adding timestamp
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/weighted-product/results?t=${timestamp}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (response.ok) {
        const data = await response.json();
        setNormalisasiData(data.normalisasi_bobot || []);
        setHasilData(data.hasil_perhitungan || []);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const response = await fetch("/api/weighted-product/calculate", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setNormalisasiData(data.normalisasi_bobot || []);
        setHasilData(data.hasil_perhitungan || []);
        toast.success("Perhitungan Weighted Product berhasil!");
        // Fetch fresh results after calculation
        await fetchResults();
        router.refresh();
      } else {
        toast.error(
          "Gagal melakukan perhitungan. Pastikan data alternatif, kriteria, dan penilaian sudah lengkap."
        );
      }
    } catch (error) {
      console.error("Error calculating:", error);
      toast.error("Terjadi error saat melakukan perhitungan.");
    } finally {
      setCalculating(false);
    }
  };

  const formatNumber = (value: string, decimals: number = 5) => {
    return parseFloat(value).toFixed(decimals);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Data Hasil Nilai
          </h1>
        </div>

        <div className="flex gap-2">
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
          
          <Button
            onClick={fetchResults}
            disabled={loading}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? "Memuat..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Perbaikan Bobot Kriteria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span className="font-medium">Perbaikan Bobot Kriteria</span>
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kriteria</TableHead>
                    <TableHead className="text-center">C1 (Benefit)</TableHead>
                    <TableHead className="text-center">C2 (Cost)</TableHead>
                    <TableHead className="text-center">C3 (Benefit)</TableHead>
                    <TableHead className="text-center">C4 (Benefit)</TableHead>
                    <TableHead className="text-center">C5 (Benefit)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Bobot Awal</TableCell>
                    {["C1", "C2", "C3", "C4", "C5"].map((kode) => {
                      const item = normalisasiData.find(
                        (n) => n.kode_kriteria === kode
                      );
                      return (
                        <TableCell key={kode} className="text-center">
                          {item ? parseFloat(item.bobot_awal).toString() : "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Normalisasi</TableCell>
                    {["C1", "C2", "C3", "C4", "C5"].map((kode) => {
                      const item = normalisasiData.find(
                        (n) => n.kode_kriteria === kode
                      );
                      return (
                        <TableCell key={kode} className="text-center">
                          {item ? formatNumber(item.bobot_normal, 2) : "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
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
        </div>

        {/* Perangkingan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">
                Perangkingan Hasil Weighted Product
              </span>
            </div>
          </div>
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
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : hasilData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        Belum ada hasil perhitungan. Klik tombol &quot;Hitung
                        Weighted Product&quot; untuk memulai perhitungan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    hasilData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={item.ranking === 1 ? "bg-green-50" : ""}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.kode_alternatif}
                        </TableCell>
                        <TableCell>{item.nama_alternatif}</TableCell>
                        <TableCell className="text-center font-mono">
                          {formatNumber(item.nilai_vektor_s)}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {formatNumber(item.nilai_vektor_v)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.ranking === 1
                                ? "bg-green-100 text-green-800"
                                : item.ranking <= 3
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.ranking}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
        </div>

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
              {formatNumber(
                hasilData.find((h) => h.ranking === 1)?.nilai_vektor_v || "0"
              )}
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
