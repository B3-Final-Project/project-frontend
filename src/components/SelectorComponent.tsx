// components/SelectorComponent.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { formatEnumValue } from "@/lib/utils";

interface SelectorComponentProps {
  value: string;
  onChange: (field: string, value: string) => void;
  options: string[];
  label: string;
  fieldName: string;
  errors?: string;
  placeholder?: string;
}

export function SelectorComponent({
                                    value,
                                    onChange,
                                    options,
                                    label,
                                    fieldName,
                                    errors,
                                    placeholder,
                                  }: SelectorComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{label}</Label>
      <Select
        value={value || ''}
        onValueChange={(val: string) => onChange(fieldName, val)}
      >
        <SelectTrigger
          id={fieldName}
          className={errors ? 'border-red-500' : ''}
        >
          <SelectValue placeholder={placeholder || label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {formatEnumValue(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors && <p className="text-sm text-red-500">{errors}</p>}
    </div>
  );
}
