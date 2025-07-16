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
        const [penilaianResponse, kriteriaResponse] = await Promise.all([
          fetch("/api/reports/penilaian"),
          fetch("/api/reports/kriteria"),
        ]);
        const penilaianResult = await penilaianResponse.json();
        const kriteriaResult = await kriteriaResponse.json();
        setData(penilaianResult);
        setKriteriaData(kriteriaResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedPenilaian = data
    .filter((item) => item.alternatif_kode && item.alternatif_nama) // Filter out records with missing alternatif data
    .reduce(
      (acc, curr) => {
        const key = `${curr.alternatif_kode}-${curr.alternatif_nama}`;
        if (!acc[key]) {
          acc[key] = {
            kode_alternatif: curr.alternatif_kode,
            nama_alternatif: curr.alternatif_nama,
            kriteria: {},
          };
        }
        acc[key].kriteria[curr.kriteria_kode] = Number(curr.nilai);
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
