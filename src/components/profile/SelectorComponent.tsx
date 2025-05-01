import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { formatEnumByField } from "@/lib/utils/enum-utils";

export function SelectorComponent({ value, fieldName, options, label, onChange, errors, placeholder }: {
  value?: number,
  fieldName: string,
  options: number[],
  label: string,
  onChange: (fieldName: string , val: string | number) => void
  errors?: string,
  placeholder?: string
})  {

  return (
  <div className="space-y-2">
    <Label htmlFor={fieldName}>{label}</Label>
    <Select
      value={value !== undefined ? value.toString() : ''}
      onValueChange={(val: string) => {
        const numericValue = parseInt(val, 10);
        onChange(fieldName, numericValue);
      }}
    >
      <SelectTrigger
        id={fieldName}
        className={errors ? 'border-red-500' : ''}
      >
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option.toString()}>
            {formatEnumByField(option, fieldName)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {errors && <p className="text-sm text-red-500">{errors}</p>}
  </div>
  )
}

