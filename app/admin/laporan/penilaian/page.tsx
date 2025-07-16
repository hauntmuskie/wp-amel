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
import { getPenilaian } from "@/_actions/penilaian-actions";
import { getKriteria } from "@/_actions/kriteria-actions";

interface Penilaian {
  id: number;
  nilai: string;
  kode_alternatif: string | null;
  nama_alternatif: string | null;
  kode_kriteria: string | null;
  nama_kriteria: string | null;
  nama_sub_kriteria: string | null;
}

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  bobot: string;
  jenis: string;
}

interface PenilaianReportPageProps {
  onBack?: () => void;
}

export default function PenilaianReportPage({
  onBack,
}: PenilaianReportPageProps) {
  const [data, setData] = useState<Penilaian[]>([]);
  const [kriteriaData, setKriteriaData] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [penilaianResult, kriteriaResult] = await Promise.all([
          getPenilaian(),
          getKriteria(),
        ]);
        
        if (penilaianResult.success && penilaianResult.data) {
          setData(penilaianResult.data);
        }
        if (kriteriaResult.success && kriteriaResult.data) {
          setKriteriaData(kriteriaResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedPenilaian = data
    .filter((item) => item.kode_alternatif && item.nama_alternatif && item.kode_kriteria) // Filter out records with missing data
    .reduce(
      (acc, curr) => {
        const key = `${curr.kode_alternatif}-${curr.nama_alternatif}`;
        if (!acc[key]) {
          acc[key] = {
            kode_alternatif: curr.kode_alternatif!,
            nama_alternatif: curr.nama_alternatif!,
            kriteria: {},
          };
        }
        acc[key].kriteria[curr.kode_kriteria!] = Number(curr.nilai);
        return acc;
      },
      {} as Record<
        string,
        {
          kode_alternatif: string;
          nama_alternatif: string;
          kriteria: Record<string, number>;
        }
      >
    );

  const groupedData = Object.values(groupedPenilaian);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ReportLayout title="LAPORAN DATA PENILAIAN" onBack={onBack}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-600 *:text-white">
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Kode Alternatif
              </TableHead>
              <TableHead className="border border-black text-center">
                Nama Alternatif
              </TableHead>
              <TableHead className="border border-black text-center">
                C1
              </TableHead>
              <TableHead className="border border-black text-center">
                C2
              </TableHead>
              <TableHead className="border border-black text-center">
                C3
              </TableHead>
              <TableHead className="border border-black text-center">
                C4
              </TableHead>
              <TableHead className="border border-black text-center">
                C5
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedData.map((item, index) => (
              <TableRow
                key={`${item.kode_alternatif}-${item.nama_alternatif}`}
                className="hover:bg-transparent"
              >
                <TableCell className="border border-black text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kode_alternatif}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.nama_alternatif}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria.C1 || "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria.C2 || "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria.C3 || "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria.C4 || "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.kriteria.C5 || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Keterangan Section */}
      <h3 className="text-lg font-semibold mt-7 my-3">Keterangan:</h3>
      <div className="space-y-1">
        {kriteriaData.map((kriteria) => (
          <p key={kriteria.id} className="text-sm">
            <strong>{kriteria.kode}</strong> = {kriteria.nama}
          </p>
        ))}
      </div>
    </ReportLayout>
  );
}
