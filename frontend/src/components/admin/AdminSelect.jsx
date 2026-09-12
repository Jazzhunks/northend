import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AdminSelect({
  label,
  options = [],
  value,
  onChange,
  error,
  id,
  placeholder = "Select…",
  searchable = false,
  className,
  ...props
}) {
  const [search, setSearch] = useState("");
  const inputId = id || props.name;
  const filtered = useMemo(() => {
    if (!searchable || !search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => String(o.label ?? o).toLowerCase().includes(q));
  }, [options, search, searchable]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} {...props}>
        <SelectTrigger
          id={inputId}
          className={cn("rounded-xl border", error && "border-rose-500 focus:ring-rose-500")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {searchable && (
            <div className="flex items-center gap-2 px-2 pb-2">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                placeholder="Search…"
              />
            </div>
          )}
          {filtered.map((o) => (
            <SelectItem key={String(o.value ?? o)} value={String(o.value ?? o)}>
              {String(o.label ?? o)}
            </SelectItem>
          ))}
          {filtered.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">No results</div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
