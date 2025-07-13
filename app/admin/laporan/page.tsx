import {
  HiOutlineDocumentReport,
  HiOutlinePrinter,
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import Link from "next/link";

const laporanItems = [
  {
    title: "Data Alternatif",
    description: "Buat laporan data alternatif yang komprehensif",
    href: "/admin/laporan/alternatif",
    icon: HiOutlineUsers,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
  },
  {
    title: "Data Kriteria",
    description: "Ekspor laporan analisis kriteria secara detail",
    href: "/admin/laporan/kriteria",
    icon: HiOutlineViewGrid,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
  },
  {
    title: "Data Sub Kriteria",
    description: "Cetak dokumentasi rincian sub kriteria",
    href: "/admin/laporan/sub-kriteria",
    icon: HiOutlineClipboardList,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
  },
  {
    title: "Data Penilaian",
    description: "Kompilasi laporan data penilaian lengkap",
    href: "/admin/laporan/penilaian",
    icon: HiOutlineChartBar,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    hoverColor: "hover:from-orange-600 hover:to-orange-700",
  },
  {
    title: "Hasil Nilai",
    description: "Hasil evaluasi akhir dan peringkat terlengkap",
    href: "/admin/laporan/hasil-nilai",
    icon: HiOutlineTrendingUp,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    hoverColor: "hover:from-red-600 hover:to-red-700",
  },
];

export default function LaporanPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <HiOutlineDocumentReport className="h-8 w-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                Laporan
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Buat dan ekspor laporan sistem
              </p>
            </div>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {laporanItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group block h-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  {/* Card Header with Icon */}
                  <div
                    className={`${item.color} ${item.hoverColor} p-6 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-8 w-8 text-white" />
                      <HiOutlinePrinter className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors mt-auto">
                      <span>Buat Laporan</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
