"use client";

import { useEffect, useState } from "react";
import { ReportLayout } from "@/components/ReportLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HasilNilai {
  id: number;
  nilai_vektor_s: string;
  nilai_vektor_v: string;
  ranking: number;
  alternatif_kode: string;
  alternatif_nama: string;
  alternatif_jenis: "Interior" | "Eksterior";
}

export default function HasilNilaiReportPage() {
  const [data, setData] = useState<HasilNilai[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/hasil-nilai");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ReportLayout title="LAPORAN DATA HASIL NILAI">
      <div className="overflow-x-auto">
        <Table className="border border-gray-300 report-table">
          <TableHeader>
            <TableRow className="bg-red-600">
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Ranking
              </TableHead>
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Kode Alternatif
              </TableHead>
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Nama Alternatif
              </TableHead>
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Jenis
              </TableHead>
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Nilai Vektor S
              </TableHead>
              <TableHead className="text-white font-bold border border-gray-300 text-center">
                Nilai Vektor V
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-transparent">
                <TableCell className="border border-gray-300 text-center font-bold">
                  {item.ranking}
                </TableCell>
                <TableCell className="border border-gray-300 text-center">
                  {item.alternatif_kode}
                </TableCell>
                <TableCell className="border border-gray-300">
                  {item.alternatif_nama}
                </TableCell>
                <TableCell className="border border-gray-300 text-center">
                  {item.alternatif_jenis}
                </TableCell>
                <TableCell className="border border-gray-300 text-center">
                  {parseFloat(item.nilai_vektor_s).toFixed(6)}
                </TableCell>
                <TableCell className="border border-gray-300 text-center">
                  {parseFloat(item.nilai_vektor_v).toFixed(6)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
