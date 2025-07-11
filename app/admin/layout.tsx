import type React from "react";
import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-12 lg:pt-0">{children}</main>
    </div>
  );
}
