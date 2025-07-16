"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Home, Package, Target, ClipboardList, Calculator } from "lucide-react"
import { PageHeader } from "./_components/page-header"
import { DataTableContainer } from "./_components/data-table-container"
import { DataLoadingStates } from "./_components/data-loading-states"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAlternatif } from "@/_actions/alternatif-actions"
import { getKriteria } from "@/_actions/kriteria-actions"
import { getSubKriteria } from "@/_actions/sub-kriteria-actions"
import { getWeightedProductResults } from "@/_actions/weighted-product-actions"

interface DashboardStats {
  alternatif: number
  kriteria: number
  subKriteria: number
  penilaian: number
}

interface HasilPerhitungan {
  id: number
  alternatif_id: number
  kode_alternatif: string | null
  nama_alternatif: string | null
  nilai_vektor_s: string
  nilai_vektor_v: string
  ranking: number
}

interface StatCard {
  title: string
  value: number
  description: string
  icon: typeof Package
  color: {
    bg: string
    text: string
    iconBg: string
  }
}

export default function BerandaPage() {
  const [stats, setStats] = useState<DashboardStats>({
    alternatif: 0,
    kriteria: 0,
    subKriteria: 0,
    penilaian: 0,
  })
  const [rankingData, setRankingData] = useState<HasilPerhitungan[]>([])
  const [loading, setLoading] = useState(true)
  const [rankingLoading, setRankingLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRankingData()
  }, [])

  const fetchStats = async () => {
    try {
      const [altResult, kritResult, subKritResult] = await Promise.all([
        getAlternatif(),
        getKriteria(),
        getSubKriteria(),
      ])

      const altData = altResult.success ? altResult.data : []
      const kritData = kritResult.success ? kritResult.data : []
      const subKritData = subKritResult.success ? subKritResult.data : []

      const penilaianCount = altData?.length || 0

      setStats({
        alternatif: altData?.length || 0,
        kriteria: kritData?.length || 0,
        subKriteria: subKritData?.length || 0,
        penilaian: penilaianCount,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRankingData = async () => {
    try {
      const result = await getWeightedProductResults()
      if (result.success && result.data) {
        setRankingData(result.data.hasil_perhitungan || [])
      }
    } catch (error) {
      console.error("Error fetching ranking data:", error)
    } finally {
      setRankingLoading(false)
    }
  }

  const statCards: StatCard[] = [
    {
      title: "Data Alternatif",
      value: stats.alternatif,
      description: "Merek cat dinding",
      icon: Package,
      color: {
        bg: "bg-blue-600",
        text: "text-blue-600",
        iconBg: "bg-blue-100",
      },
    },
    {
      title: "Data Kriteria",
      value: stats.kriteria,
      description: "Parameter penilaian",
      icon: Target,
      color: {
        bg: "bg-green-600",
        text: "text-green-600",
        iconBg: "bg-green-100",
      },
    },
    {
      title: "Data Sub Kriteria",
      value: stats.subKriteria,
      description: "Detail penilaian",
      icon: ClipboardList,
      color: {
        bg: "bg-purple-600",
        text: "text-purple-600",
        iconBg: "bg-purple-100",
      },
    },
    {
      title: "Data Penilaian",
      value: stats.penilaian,
      description: "Matrix evaluasi",
      icon: Calculator,
      color: {
        bg: "bg-orange-600",
        text: "text-orange-600",
        iconBg: "bg-orange-100",
      },
    },
  ]

  const StatCard = ({ title, value, description, icon: Icon, color }: StatCard) => (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between gap-2 min-h-0">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-md font-medium leading-tight truncate">{title}</p>
            <p className={`text-3xl font-bold ${color.text} leading-tight`}>{loading ? "..." : value}</p>
            <p className="text-gray-500 text-xs mt-0.5 leading-tight truncate">{description}</p>
          </div>
          <div className={`${color.iconBg} p-2 rounded-full flex-shrink-0`}>
            <Icon className={`h-5 w-5 ${color.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <PageHeader icon={Home} title="Dashboard" />

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg text-white p-8">
        <div className="flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold mb-2 text-center">
              <span className="block">Penerapan Metode Weighted Product (WP) Dalam Pemilihan Cat Dinding Terbaik</span>
              <span className="block">Pada TB Raja Bangunan</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* Ranking Table */}
      <DataTableContainer title="Peringkat Hasil Weighted Product">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Kode Alternatif</TableHead>
                <TableHead>Nama Alternatif</TableHead>
                <TableHead className="text-center">Nilai Vektor S</TableHead>
                <TableHead className="text-center">Nilai Vektor V</TableHead>
                <TableHead className="text-center">Peringkat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <DataLoadingStates
                loading={rankingLoading}
                hasData={rankingData.length > 0}
                colSpan={6}
                emptyMessage="Belum ada hasil perhitungan. Silakan lakukan perhitungan terlebih dahulu di halaman Data Perhitungan."
              />
              {!rankingLoading &&
                rankingData
                  .sort((a, b) => a.ranking - b.ranking)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.kode_alternatif}</TableCell>
                      <TableCell>{item.nama_alternatif}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {Number.parseFloat(item.nilai_vektor_s).toFixed(5)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {Number.parseFloat(item.nilai_vektor_v).toFixed(5)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.ranking === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : item.ranking === 2
                                ? "bg-gray-100 text-gray-800"
                                : item.ranking === 3
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.ranking}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </DataTableContainer>

      {/* Best Alternative Summary */}
      {rankingData.length > 0 && (
        <Card className="border-x border-y">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">🏆 Rekomendasi Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Berdasarkan perhitungan Weighted Product, cat dinding terbaik adalah{" "}
              <span className="font-bold text-green-700">
                {rankingData.find((h) => h.ranking === 1)?.nama_alternatif}
              </span>{" "}
              dengan skor akhir{" "}
              <span className="font-bold text-green-700">
                {Number.parseFloat(rankingData.find((h) => h.ranking === 1)?.nilai_vektor_v || "0").toFixed(5)}
              </span>
              .
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
