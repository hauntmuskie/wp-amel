"use client";

import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  className?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  documentTitle?: string;
}

export function PrintButton({
  className,
  contentRef,
  documentTitle,
}: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: documentTitle || "Report",
    pageStyle: `
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        font-family: Arial, sans-serif;
      }

      #report-logo {
        max-width: 150px;
        height: auto;
      }

      #report-header {
        width: 100%;
        margin-top: 50px;
        margin-bottom: 50px;
      }
    `,
  });

  return (
    <Button
      onClick={handlePrint}
      className={`shadow-lg ${className}`}
      size="lg"
      variant={"default"}
    >
      <Printer className="h-5 w-5 mr-2" />
      Print Laporan
    </Button>
  );
}
