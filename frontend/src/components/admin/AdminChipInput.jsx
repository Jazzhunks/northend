import { useState } from "react";
import ChipInput from "@/components/ChipInput";
import { cn } from "@/lib/utils";

export default function AdminChipInput({
  label,
  value = [],
  onChange,
  error,
  id,
  maxCount,
  placeholder = "Add and press Enter…",
  className,
  ...props
}) {
  const inputId = id || props.name || props["data-testid"];
  const countExceeded = maxCount && value.length > maxCount;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {maxCount && <span className="text-muted-foreground ml-1">({value.length}/{maxCount})</span>}
        </label>
      )}
      <ChipInput
        id={inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(countExceeded && "border-rose-500")}
        {...props}
      />
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
      {countExceeded && (
        <p className="text-xs text-rose-600" role="alert">Maximum {maxCount} items allowed</p>
      )}
    </div>
  );
}
