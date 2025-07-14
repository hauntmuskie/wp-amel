"use client";

import { useState } from "react";
import {
  HiOutlineDocumentReport,
  HiOutlinePrinter,
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import AlternatifReportPage from "./alternatif/page";
import KriteriaReportPage from "./kriteria/page";
import SubKriteriaReportPage from "./sub-kriteria/page";
import PenilaianReportPage from "./penilaian/page";
import HasilNilaiReportPage from "./hasil-nilai/page";
import { Button } from "@/components/ui/button";

const laporanItems = [
  {
    title: "Data Alternatif",
    key: "alternatif",
    icon: HiOutlineUsers,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
  },
  {
    title: "Data Kriteria",
    key: "kriteria",
    icon: HiOutlineViewGrid,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
  },
  {
    title: "Data Sub Kriteria",
    key: "sub-kriteria",
    icon: HiOutlineClipboardList,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
  },
  {
    title: "Data Penilaian",
    key: "penilaian",
    icon: HiOutlineChartBar,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    hoverColor: "hover:from-orange-600 hover:to-orange-700",
  },
  {
    title: "Perhitungan WP",
    key: "hasil-nilai",
    icon: HiOutlineTrendingUp,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    hoverColor: "hover:from-red-600 hover:to-red-700",
  },
];

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const renderReport = () => {
    switch (selectedReport) {
      case "alternatif":
        return <AlternatifReportPage onBack={() => setSelectedReport(null)} />;
      case "kriteria":
        return <KriteriaReportPage onBack={() => setSelectedReport(null)} />;
      case "sub-kriteria":
        return <SubKriteriaReportPage onBack={() => setSelectedReport(null)} />;
      case "penilaian":
        return <PenilaianReportPage onBack={() => setSelectedReport(null)} />;
      case "hasil-nilai":
        return <HasilNilaiReportPage onBack={() => setSelectedReport(null)} />;
      default:
        return null;
    }
  };

  if (selectedReport) {
    return renderReport();
  }

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
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {laporanItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                variant={"outline"}
                key={index}
                onClick={() => setSelectedReport(item.key)}
                className="group block h-full w-full text-left"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  {/* Card Header with Icon */}
                  <div
                    className={`${item.color} ${item.hoverColor} p-4 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-6 w-6 text-white" />
                      <HiOutlinePrinter className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>

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
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
