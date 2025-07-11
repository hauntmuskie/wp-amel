"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Database,
  BarChart3,
  Users,
  ClipboardList,
  TrendingUp,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import RajaBangunanLogo from "@/public/image.png";

const menuItems = [
  {
    title: "Beranda",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Data Alternatif",
    href: "/admin/data-alternatif",
    icon: Database,
  },
  {
    title: "Data Kriteria",
    href: "/admin/data-kriteria",
    icon: BarChart3,
  },
  {
    title: "Data Sub Kriteria",
    href: "/admin/data-sub-kriteria",
    icon: Users,
  },
  {
    title: "Data Penilaian",
    href: "/admin/data-penilaian",
    icon: ClipboardList,
  },
  {
    title: "Data Hasil Nilai",
    href: "/admin/data-hasil-nilai",
    icon: TrendingUp,
  },
  {
    title: "Laporan",
    href: "/admin/laporan",
    icon: FileText,
  },
  {
    title: "Keluar",
    href: "/login",
    icon: LogOut,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image
            src={RajaBangunanLogo}
            alt="Raja Bangunan Logo"
            width={1200}
            height={1200}
            quality={100}
            className="w-64 h-16 object-cover"
          />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-yellow-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
