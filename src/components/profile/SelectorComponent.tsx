import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatEnumByField } from "@/lib/utils/enum-utils";

export function SelectorComponent({
  value,
  fieldName,
  options,
  label,
  onChange,
  errors,
  placeholder,
}: {
  readonly value?: number | null;
  readonly fieldName: string;
  readonly options: (number | null)[];
  readonly label: string;
  readonly onChange: (fieldName: string, val: number | string) => void;
  readonly errors?: string;
  readonly placeholder?: string;
}) {
  // helper to serialize <number|null> → string
  const serialize = (v: number | null | undefined) =>
    v != null ? String(v) : "";

  // helper to deserialize string → <number|string>
  const deserialize = (s: string) =>
    s === "" ? "" : (parseInt(s, 10) as number);

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{label}</Label>
      <Select
        // if value is null or undefined, we pass empty string
        value={serialize(value)}
        onValueChange={(val: string) => {
          onChange(fieldName, deserialize(val));
        }}
      >
        <SelectTrigger
          id={fieldName}
          className={errors ? "border-red-500" : ""}
        >
          <SelectValue placeholder={placeholder ?? label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={String(opt)} value={serialize(opt)}>
              {opt != null
                ? formatEnumByField(fieldName,opt)
                : (placeholder ?? "None")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors && <p className="text-sm text-red-500">{errors}</p>}
    </div>
  );
}
