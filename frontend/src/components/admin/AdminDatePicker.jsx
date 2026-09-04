import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function AdminDatePicker({
  label,
  value,
  onChange,
  error,
  id,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabled,
  className,
  ...props
}) {
  const inputId = id || props.name;
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : undefined;
  const validDate = dateValue instanceof Date && !isNaN(dateValue);

  const handleSelect = (day) => {
    if (!day) return;
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    onChange?.(`${yyyy}-${mm}-${dd}`);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start rounded-xl border text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-rose-500 focus:ring-rose-500"
            )}
            {...props}
          >
            <CalendarIcon size={16} className="mr-2" />
             {validDate ? format(dateValue, "yyyy-MM-dd") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={(d) => (minDate ? d < minDate : false) || (maxDate ? d > maxDate : false)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
    </div>
  );
}
