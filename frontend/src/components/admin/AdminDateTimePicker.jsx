import { Label } from "@/components/ui/label";
import AdminDatePicker from "./AdminDatePicker";
import { cn } from "@/lib/utils";

export default function AdminDateTimePicker({
  label,
  value,
  onChange,
  error,
  id,
  dateProps,
  className,
  ...props
}) {
  const inputId = id || props.name;
  const [datePart, timePart] = value ? value.split("T") : ["", ""];

  const handleDateChange = (d) => {
    const newDate = d || "";
    const combined = timePart ? `${newDate}T${timePart}` : newDate;
    onChange?.(combined);
  };

  const handleTimeChange = (e) => {
    const t = e.target.value;
    const combined = datePart ? `${datePart}T${t}` : "";
    onChange?.(combined);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <AdminDatePicker
            id={`${inputId}-date`}
            label={undefined}
            value={datePart}
            onChange={handleDateChange}
            error={error}
            {...dateProps}
          />
        </div>
        <div className="w-32">
          <label htmlFor={`${inputId}-time`} className="text-xs text-muted-foreground mb-1 block">
            Time
          </label>
          <input
            id={`${inputId}-time`}
            type="time"
            value={timePart}
            onChange={handleTimeChange}
            className={cn(
              "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              error && "border-rose-500 focus-visible:ring-rose-500"
            )}
          />
        </div>
      </div>
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
