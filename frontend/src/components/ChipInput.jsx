import { useState } from "react";
import { X, Plus } from "lucide-react";

/**
 * Chip input — comma or Enter to add. Calls onChange(string[]).
 */
export default function ChipInput({ value = [], onChange, placeholder = "Add and press Enter…", testId = "chip-input" }) {
  const [text, setText] = useState("");
  const add = () => {
    const t = text.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setText("");
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="border border-border rounded-md px-2 py-2 bg-background" data-testid={testId}>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
            {v}
            <button type="button" onClick={() => remove(i)} className="hover:text-destructive" data-testid={`${testId}-remove-${i}`}><X size={12}/></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          className="flex-1 bg-transparent outline-none text-sm px-1 py-1"
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
            else if (e.key === "Backspace" && !text && value.length) { onChange(value.slice(0, -1)); }
          }}
          data-testid={`${testId}-text`}
        />
        <button type="button" onClick={add} className="text-primary text-xs px-2 hover:bg-primary/5 rounded" data-testid={`${testId}-add`}><Plus size={14}/></button>
      </div>
    </div>
  );
}
