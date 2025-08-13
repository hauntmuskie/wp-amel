"use client";

import { useEffect, useState } from "react";
import { ReportLayout } from "@/app/admin/laporan/_components/report-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getSubKriteriaReport } from "@/_actions/reports";

interface SubKriteria {
  id: number;
  nama: string;
  bobot: string;
  keterangan: string | null;
  kriteria_nama: string;
  kriteria_kode: string;
}

interface SubKriteriaReportPageProps {
  onBack?: () => void;
}

export default function SubKriteriaReportPage({
  onBack,
}: SubKriteriaReportPageProps) {
  const [data, setData] = useState<SubKriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSubKriteriaReport();
        if (res.success && res.data) {
          const sortedData = res.data.sort((a: SubKriteria, b: SubKriteria) => {
            const codeComparison = a.kriteria_kode.localeCompare(
              b.kriteria_kode
            );
            if (codeComparison !== 0) return codeComparison;
            return parseFloat(b.bobot) - parseFloat(a.bobot);
          });
          setData(sortedData);
        }
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
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout title="Laporan Data Sub Kriteria" onBack={onBack}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-600 *:text-white">
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Kode Kriteria
              </TableHead>
              <TableHead className="border border-black text-center">
                Nama Kriteria
              </TableHead>
              <TableHead className="border border-black text-center">
                Nama Sub Kriteria
              </TableHead>
              <TableHead className="border border-black text-center">
                Bobot
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
                  {item.kriteria_kode}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria_nama}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.nama}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {Math.round(parseFloat(item.bobot))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
