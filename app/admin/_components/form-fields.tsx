import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends FormFieldProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  readOnly?: boolean;
}

interface SelectFieldProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export function TextField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "w-full",
  min,
  max,
  step,
  readOnly = false,
}: TextFieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 mb-2 block"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
      />
    </div>
  );
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  className = "w-full",
}: SelectFieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 mb-2 block"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
