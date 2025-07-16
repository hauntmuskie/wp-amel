import { ReactNode } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
  isSubmitting?: boolean;
}

export function FormDialog({
  title,
  onSubmit,
  onCancel,
  children,
  isSubmitting = false,
}: FormDialogProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <div className="bg-red-600 text-white px-4 py-2 -mx-6 -mt-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-white text-base font-medium">
            {title}
          </DialogTitle>
        </div>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
