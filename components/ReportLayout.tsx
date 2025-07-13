"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { PrintButton } from "./PrintButton";
import TBRajaLogo from "@/public/image.png";
import { Separator } from "./ui/separator";

interface ReportLayoutProps {
  title: string;
  children: React.ReactNode;
  documentTitle?: string;
}

export function ReportLayout({
  title,
  children,
  documentTitle,
}: ReportLayoutProps) {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Print Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <PrintButton
          contentRef={printRef}
          documentTitle={documentTitle || title}
        />
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="my-8">
        {/* Header */}
        <div className="p-3 mt-5 report-header">
          <div className="relative flex items-center">
            <Image
              src={TBRajaLogo}
              alt="TB Raja Bangunan Logo"
              width={200}
              height={200}
              quality={100}
              id="report-logo"
              className="object-cover"
            />
            <div
              id="report-header"
              className="absolute left-1/2 transform -translate-x-1/2 text-center"
            >
              <h1 className="text-2xl font-bold mb-2">TB RAJA BANGUNAN</h1>
              <p className="text-sm text-gray-600 mb-1">
                Jl. Bangka IX C No.92, RT.3/RW.5, Pela Mampang, Kec.
              </p>
              <p className="text-sm text-gray-600">
                Mampang Prapatan, Kota Jakarta Selatan, DKI Jakarta 12520
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-7 bg-black mx-3" />

        {/* Report Title */}
        <div className="px-3">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-8">{title}</h2>
          </div>
        </div>

        {/* Report Content */}
        <div className="px-3 pb-3">
          {children}

          {/* Footer */}
          <div className="mt-16 flex justify-between items-end report-footer">
            <div></div>
            <div className="text-center">
              <p className="mb-2">
                Jakarta,{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mb-16">Pemilik Toko</p>
              <p className="inline-block min-w-[200px] pb-1">Lukmanuul Hakim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
