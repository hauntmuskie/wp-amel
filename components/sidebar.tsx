"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Database,
  BarChart3,
  Users,
  ClipboardList,
  TrendingUp,
  FileText,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import RajaBangunanLogo from "@/public/image.png";
import { Button } from "./ui/button";

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
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  // Close sidebar when navigating (optional UX improvement)
  // useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-white border border-gray-200 shadow-lg"
          aria-label="Open sidebar"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-3xl transition-all duration-150  z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-72 bg-white border-r border-gray-200 h-screen flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Close Button (Mobile Only) */}
        <div className="md:hidden flex justify-between items-center p-4">
          <Image
            src={RajaBangunanLogo}
            alt="Raja Bangunan Logo"
            width={1200}
            height={1200}
            quality={100}
            className="w-52 h-16 object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 hidden md:block">
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
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </li>
              );
            })}

            {/* Logout with confirmation dialog */}
            <li>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium"
                    onClick={() => setOpen(false)}
                    variant={"default"}
                  >
                    <LogOut className="h-5 w-5" />
                    Keluar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin keluar dari aplikasi? Anda perlu
                      login kembali untuk mengakses sistem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Ya, Keluar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
