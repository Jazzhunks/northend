import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AdminInput = forwardRef(function AdminInput({ label, error, id, className, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        id={inputId}
        className={cn("rounded-xl border", error && "border-rose-500 focus-visible:ring-rose-500")}
        {...props}
      />
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
    </div>
  );
});

export default AdminInput;
