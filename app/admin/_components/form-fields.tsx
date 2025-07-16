"use client";

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
  name?: string;
}

interface TextFieldProps extends FormFieldProps {
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  readOnly?: boolean;
}

interface SelectFieldProps extends FormFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export function TextField({
  label,
  id,
  name,
  type = "text",
  value,
  defaultValue,
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
        name={name || id}
        type={type}
        className={className}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
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
  name,
  value,
  defaultValue,
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
      <Select
        name={name || id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        required={required}
      >
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
