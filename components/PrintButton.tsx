"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  className?: string;
}

export function PrintButton({ className }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      className={`no-print bg-blue-600 hover:bg-blue-700 text-white shadow-lg ${className}`}
      size="lg"
    >
      <Printer className="h-5 w-5 mr-2" />
      Print Report
    </Button>
  );
}
