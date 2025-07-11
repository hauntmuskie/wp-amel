"use client";

import { useState, useEffect } from "react";
import {
  Home,
  BarChart3,
  Package,
  Target,
  ClipboardList,
  Calculator,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
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

export default function BerandaPage() {
  const [stats, setStats] = useState<DashboardStats>({
    alternatif: 0,
    kriteria: 0,
    subKriteria: 0,
    penilaian: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [altRes, kritRes, subKritRes, penRes] = await Promise.all([
        fetch("/api/alternatif"),
        fetch("/api/kriteria"),
        fetch("/api/sub-kriteria"),
        fetch("/api/penilaian"),
      ]);

      const [altData, kritData, subKritData, penData] = await Promise.all([
        altRes.json(),
        kritRes.json(),
        subKritRes.json(),
        penRes.json(),
      ]);

      setStats({
        alternatif: altData.length || 0,
        kriteria: kritData.length || 0,
        subKriteria: subKritData.length || 0,
        penilaian: penData.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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
            <h2 className="text-3xl font-bold mb-2">
              Sistem Pendukung Keputusan
            </h2>
            <p className="text-red-100 text-lg mb-4">
              Metode Weighted Product untuk Pemilihan Cat Dinding Terbaik
            </p>
            <p className="text-red-200">
              TB Raja Bangunan - Implementasi SPK Berbasis Web
            </p>
          </div>
          <div className="hidden lg:block">
            <BarChart3 className="h-24 w-24 text-red-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Data Alternatif
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.alternatif}
              </p>
              <p className="text-xs text-gray-500 mt-1">Merek cat dinding</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Kriteria Utama
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.kriteria}
              </p>
              <p className="text-xs text-gray-500 mt-1">Parameter penilaian</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sub Kriteria</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.subKriteria}
              </p>
              <p className="text-xs text-gray-500 mt-1">Detail penilaian</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <ClipboardList className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Data Penilaian
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.penilaian}
              </p>
              <p className="text-xs text-gray-500 mt-1">Matrix evaluasi</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calculator className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className=" bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Sistem Overview</span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Metode Weighted Product (WP)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sistem ini mengimplementasikan metode Weighted Product untuk
                membantu pemilihan cat dinding terbaik berdasarkan 5 kriteria
                utama: Kualitas Pigmen, Harga, Ketahanan, Daya Sebar, dan
                Variasi Warna.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Benefit Criteria
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  C1 (Kualitas), C3 (Ketahanan), C4 (Daya Sebar), C5 (Variasi)
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-gray-800">
                    Cost Criteria
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  C2 (Harga) - Semakin rendah semakin baik
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Formula Perhitungan:
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Vector S:</strong> S(Ai) = ∏(Xij^Wj) untuk j=1 sampai
                  n
                </p>
                <p>
                  <strong>Vector V:</strong> V(Ai) = S(Ai) / ∑S(Ai)
                </p>
                <p>
                  <strong>Ranking:</strong> Alternatif dengan nilai V tertinggi
                  = terbaik
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Matrix Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Assessment Matrix Preview</span>
          </div>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Alternatif</TableHead>
                  <TableHead className="text-center">C1 (Pigmen)</TableHead>
                  <TableHead className="text-center">C2 (Harga)</TableHead>
                  <TableHead className="text-center">C3 (Ketahanan)</TableHead>
                  <TableHead className="text-center">C4 (Daya Sebar)</TableHead>
                  <TableHead className="text-center">C5 (Variasi)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>A1 - Nippon Paint Vinilex</TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>A2 - Aquaproof</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>A3 - Dulux Catylac</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>A4 - Mowilex Emulsion</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-center">2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>A5 - No Drop</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Matrix penilaian berdasarkan penelitian TB Raja Bangunan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
