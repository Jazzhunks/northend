import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { waAPI } from "@/lib/api";

function similarity(a, b) {
  if (!a || !b) return 0;
  const s = (a || "").toLowerCase();
  const t = (b || "").toLowerCase();
  if (s === t) return 1;
  if (s.includes(t) || t.includes(s)) return 0.8;
  const setS = new Set(s.split(/[_\s]+/));
  const setT = new Set(t.split(/[_\s]+/));
  let inter = 0;
  setS.forEach((x) => { if (setT.has(x)) inter += 1; });
  return inter / Math.max(setS.size, setT.size);
}

export default function TemplateMapper({
  templateName,
  templateComponents,
  excelColumns,
  variableMappings,
  onMappingsChange,
  variableDefaults,
  onDefaultsChange,
}) {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        let vars = [];
        if (templateComponents) {
          vars = parseVariablesFromComponents(templateComponents);
        } else if (templateName) {
          const res = await waAPI.parseTemplate({ template_name: templateName });
          vars = res.variables || [];
        }
        if (!cancelled) setVariables(vars);
      } catch (e) {
        if (!cancelled) toast.error("Failed to load template variables");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [templateName, templateComponents]);

  const autoMappings = useMemo(() => {
    const mappings = {};
    variables.forEach((v) => {
      const idx = v.index;
      let bestCol = null;
      let bestScore = 0;
      excelColumns.forEach((col) => {
        const score = similarity(col, `{{${idx}}}`) + similarity(col, v.body_context || "");
        if (score > bestScore) {
          bestScore = score;
          bestCol = col;
        }
      });
      if (bestCol && bestScore > 0.3) {
        mappings[idx] = bestCol;
      }
    });
    return mappings;
  }, [variables, excelColumns]);

  useEffect(() => {
    if (variableMappings && Object.keys(variableMappings).length > 0) return;
    if (Object.keys(autoMappings).length > 0 && onMappingsChange) {
      onMappingsChange(autoMappings);
    }
  }, [autoMappings]);

  const handleMappingChange = (idx, col) => {
    const next = { ...(variableMappings || {}), [idx]: col || undefined };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    onMappingsChange?.(cleaned);
  };

  const handleDefaultChange = (idx, val) => {
    const next = { ...(variableDefaults || {}), [idx]: val };
    onDefaultsChange?.(next);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading template variables...</div>;
  }

  if (!variables.length) {
    return <div className="text-sm text-muted-foreground">This template has no dynamic variables.</div>;
  }

  return (
    <div className="space-y-3">
      {variables.map((v) => (
        <div key={v.index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider font-bold">Variable {v.index}</Label>
            <div className="text-[10px] text-muted-foreground line-clamp-2 bg-muted/40 rounded-lg p-2 border border-border">
              {v.body_context}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider font-bold">Excel Column</Label>
            <Select
              value={variableMappings?.[v.index] || ""}
              onValueChange={(val) => handleMappingChange(v.index, val)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__default__">-- Use Default --</SelectItem>
                {excelColumns.map((col) => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider font-bold">Fallback Default</Label>
            <input
              type="text"
              value={variableDefaults?.[v.index] || ""}
              onChange={(e) => handleDefaultChange(v.index, e.target.value)}
              placeholder="e.g. Valued Customer"
              className="w-full border border-border rounded-xl bg-background px-3 py-2 text-xs focus:outline-none focus:border-accent/40"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function parseVariablesFromComponents(components) {
  const variables = [];
  const seen = new Set();
  for (const comp of components || []) {
    if (comp.type !== "BODY") continue;
    const text = comp.text || "";
    for (const m of text.matchAll(/\{\{(\d+)\}\}/g)) {
      const idx = m[1];
      if (seen.has(idx)) continue;
      seen.add(idx);
      const start = Math.max(0, m.index - 40);
      const end = Math.min(text.length, m.index + m[0].length + 40);
      const context = text.slice(start, end).replace(/\n/g, " ").trim();
      variables.push({ index: idx, body_context: context });
    }
  }
  return variables.sort((a, b) => Number(a.index) - Number(b.index));
}
