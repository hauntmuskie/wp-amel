import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
}

export function PageHeader({ icon: Icon, title }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Icon className="h-6 w-6 text-gray-600" />
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
}
