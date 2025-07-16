import { ReactNode } from "react";

interface DataTableContainerProps {
  title: string;
  children: ReactNode;
}

export function DataTableContainer({
  title,
  children,
}: DataTableContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
        <span className="text-base font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
}
