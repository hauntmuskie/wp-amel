import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const laporanItems = [
  {
    title: "Laporan Data Alternatif",
    description: "Cetak laporan data alternatif",
  },
  {
    title: "Laporan Data Kriteria",
    description: "Cetak laporan data kriteria",
  },
  {
    title: "Laporan Data Sub Kriteria",
    description: "Cetak laporan data sub kriteria",
  },
  {
    title: "Laporan Data Penilaian",
    description: "Cetak laporan data penilaian",
  },
  {
    title: "Laporan Data Hasil Nilai",
    description: "Cetak laporan data hasil nilai",
  },
];

export default function LaporanPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Laporan</h1>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laporanItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Cetak Data
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
