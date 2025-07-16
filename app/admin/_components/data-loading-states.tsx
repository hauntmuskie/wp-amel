import { TableRow, TableCell } from "@/components/ui/table";

interface DataLoadingStatesProps {
  loading: boolean;
  hasData: boolean;
  colSpan: number;
  emptyMessage?: string;
}

export function DataLoadingStates({
  loading,
  hasData,
  colSpan,
  emptyMessage = "Tidak ada data yang ditemukan.",
}: DataLoadingStatesProps) {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center text-gray-500 py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            Tunggu Sebentar...
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (!hasData) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center text-gray-500 py-8">
          {emptyMessage}
        </TableCell>
      </TableRow>
    );
  }

  return null;
}
