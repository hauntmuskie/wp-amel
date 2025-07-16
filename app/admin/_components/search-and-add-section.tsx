import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface SearchAndAddSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  addDialogContent: ReactNode;
  addButtonText?: string;
}

export function SearchAndAddSection({
  searchTerm,
  onSearchChange,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
  addDialogContent,
  addButtonText = "Tambah Data",
}: SearchAndAddSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Cari:</span>
          <Input
            className="w-48"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={onAddOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onAddClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          </DialogTrigger>
          {addDialogContent}
        </Dialog>
      </div>
    </div>
  );
}
