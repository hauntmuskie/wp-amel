"use client";

import { useState, useEffect } from "react";
import { Home, Package, Target, ClipboardList, Calculator } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardStats {
  alternatif: number;
  kriteria: number;
  subKriteria: number;
  penilaian: number;
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

export default function BerandaPage() {
  const [stats, setStats] = useState<DashboardStats>({
    alternatif: 0,
    kriteria: 0,
    subKriteria: 0,
    penilaian: 0,
  });
  const [rankingData, setRankingData] = useState<HasilPerhitungan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRankingData();
  }, []);

  const fetchStats = async () => {
    try {
      const [altRes, kritRes, subKritRes] = await Promise.all([
        fetch("/api/alternatif"),
        fetch("/api/kriteria"),
        fetch("/api/sub-kriteria"),
      ]);

      const [altData, kritData, subKritData] = await Promise.all([
        altRes.json(),
        kritRes.json(),
        subKritRes.json(),
      ]);

      // The data penilaian should show number of alternatives that have been evaluated
      const penilaianCount = altData.length;

      setStats({
        alternatif: altData.length || 0,
        kriteria: kritData.length || 0,
        subKriteria: subKritData.length || 0,
        penilaian: penilaianCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRankingData = async () => {
    try {
      const response = await fetch("/api/weighted-product/results");
      if (response.ok) {
        const data = await response.json();
        setRankingData(data.hasil_perhitungan || []);
      }
    } catch (error) {
      console.error("Error fetching ranking data:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Home className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2 text-center">
              <span>
                Penerapan Metode Weighted Product (WP) Dalam Pemilihan Cat
                Dinding Terbaik Pada TB Raja Bangunan
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Data Alternatif
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? "..." : stats.alternatif}
                </p>
                <p className="text-gray-500 text-xs mt-1">Merek cat dinding</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Kriteria Utama
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? "..." : stats.kriteria}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Parameter penilaian
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Sub Kriteria
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {loading ? "..." : stats.subKriteria}
                </p>
                <p className="text-gray-500 text-xs mt-1">Detail penilaian</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Data Penilaian
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {loading ? "..." : stats.penilaian}
                </p>
                <p className="text-gray-500 text-xs mt-1">Matrix evaluasi</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      {rankingData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
            <h3 className="text-base font-medium">
              Peringkat Hasil Weighted Product
            </h3>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Kode Alternatif</TableHead>
                  <TableHead>Nama Alternatif</TableHead>
                  <TableHead className="text-center">Nilai Vektor S</TableHead>
                  <TableHead className="text-center">Nilai Vektor V</TableHead>
                  <TableHead className="text-center">Peringkat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingData
                  .sort((a, b) => a.ranking - b.ranking)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.kode_alternatif}</TableCell>
                      <TableCell>{item.nama_alternatif}</TableCell>
                      <TableCell className="text-center">
                        {parseFloat(item.nilai_vektor_s).toFixed(5)}
                      </TableCell>
                      <TableCell className="text-center">
                        {parseFloat(item.nilai_vektor_v).toFixed(5)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.ranking === 1
                              ? "bg-green-100 text-green-800"
                              : item.ranking === 2
                              ? "bg-blue-100 text-blue-800"
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
      )}
    </div>
  );
}
