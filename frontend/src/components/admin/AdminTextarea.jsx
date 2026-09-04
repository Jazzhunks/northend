import { forwardRef, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AdminTextarea = forwardRef(function AdminTextarea(
  { label, error, id, maxLength, autoResize = false, className, ...props },
  ref
) {
  const inputId = id || props.name;
  const [count, setCount] = useState(props.value?.length ?? props.defaultValue?.length ?? 0);

  useEffect(() => {
    setCount(String(props.value ?? props.defaultValue ?? "").length);
  }, [props.value, props.defaultValue]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Textarea
        ref={ref}
        id={inputId}
        maxLength={maxLength}
        className={cn("rounded-xl border resize-none", autoResize && "resize-y", error && "border-rose-500 focus-visible:ring-rose-500")}
        onInput={(e) => setCount(e.target.value.length)}
        {...props}
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
        {maxLength && <p className="text-xs text-muted-foreground ml-auto">{count} / {maxLength}</p>}
      </div>
    </div>
  );
});

export default AdminTextarea;
