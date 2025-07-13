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

interface Penilaian {
  id: number;
  nilai: string;
  alternatif_kode: string;
  alternatif_nama: string;
  kriteria_kode: string;
  kriteria_nama: string;
  sub_kriteria_nama: string;
  sub_kriteria_bobot: string;
}

export default function PenilaianReportPage() {
  const [data, setData] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/penilaian");
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
    <ReportLayout title="LAPORAN DATA PENILAIAN">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Alternatif
              </TableHead>
              <TableHead className="border border-black text-center">
                Kriteria
              </TableHead>
              <TableHead className="border border-black text-center">
                Sub Kriteria
              </TableHead>
              <TableHead className="border border-black text-center">
                Bobot
              </TableHead>
              <TableHead className="border border-black text-center">
                Nilai
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-transparent">
                <TableCell className="border border-black text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.alternatif_kode} - {item.alternatif_nama}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria_kode} - {item.kriteria_nama}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.sub_kriteria_nama}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {Math.round(parseFloat(item.sub_kriteria_bobot))}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {Math.round(parseFloat(item.nilai))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
