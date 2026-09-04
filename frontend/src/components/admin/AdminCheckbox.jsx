import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function AdminCheckbox({ label, error, id, className, ...props }) {
  const inputId = id || props.name || props["data-testid"];
  return (
    <div className={cn("flex items-center gap-2 space-y-0", className)}>
      <Checkbox
        id={inputId}
        className={cn("rounded", error && "border-rose-500")}
        {...props}
      />
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      )}
      {error && <p className="text-xs text-rose-600 ml-auto" role="alert">{error}</p>}
    </div>
  );
}
