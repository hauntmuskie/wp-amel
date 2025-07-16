"use client";

import { useEffect, useState } from "react";
import { ReportLayout } from "@/components/report-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSubKriteria } from "@/_actions/sub-kriteria-actions";

interface SubKriteria {
  id: number;
  nama: string;
  bobot: string;
  keterangan: string | null;
  nama_kriteria: string | null;
  kode_kriteria: string | null;
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
        const result = await getSubKriteria();
        if (result.success && result.data) {
          setData(result.data);
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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ReportLayout title="LAPORAN DATA SUB KRITERIA" onBack={onBack}>
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
                  {item.kode_kriteria}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.nama_kriteria}
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
