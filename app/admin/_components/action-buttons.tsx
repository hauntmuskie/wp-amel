import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  deleteTitle = "Hapus Data",
  deleteDescription = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="bg-green-600 hover:bg-green-700 text-white hover:text-white flex items-center gap-1"
      >
        <Edit className="h-4 w-4" />
        <span>Ubah</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white hover:text-white flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
