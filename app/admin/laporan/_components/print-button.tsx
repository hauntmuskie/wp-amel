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
        font-family: "Times New Roman", Times, serif;
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

      /* Table column headers alternating red and white backgrounds */

      table thead th:nth-child(odd),
      table th:nth-child(odd) {
        background-color: red !important;
        color: white !important;
        font-size: 1.1em !important;
        font-weight: 800 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      table thead th:nth-child(even),
      table th:nth-child(even) {
        background-color: red !important;
        color: white !important;
        font-size: 1.1em !important;
        font-weight: 800 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Ensure borders are visible */
      table, th, td {
        border: 1px solid #000 !important;
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
