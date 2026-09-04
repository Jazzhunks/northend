import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Save, X, Trophy } from "lucide-react";
import { AdminInput, AdminTextarea, AdminCheckbox } from "@/components/admin";
import { resultEditorSchema } from "@/lib/schemas";

export default function EditResultDialog({ open, resultId, resultData, onClose, onSave }) {
  const [localData, setLocalData] = useState(resultData || {});

  useEffect(() => {
    if (open) setLocalData(resultData || {});
  }, [open, resultData]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(resultEditorSchema),
    defaultValues: resultData || {
      marks_obtained: "", total_marks: 100, rank: "", percentile: "",
      scholarship_percentage: 0, remarks: "", publish: false,
    },
  });

  const submit = (data) => {
    onSave(resultId, { ...localData, ...data });
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-lg">
            <Trophy size={18} className="text-accent" /> Edit Examination Scores
          </DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(submit)} data-testid={`result-form-${resultId}`} className="px-4 pb-2 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminInput
              label="Marks Obtained"
              placeholder="Marks obtained"
              type="number"
              testId={`r-marks-${resultId}`}
              className="font-mono"
              {...register("marks_obtained", { valueAsNumber: true })}
            />
            <AdminInput
              label="Total Marks"
              placeholder="Total marks"
              type="number"
              testId={`r-total-${resultId}`}
              className="font-mono"
              {...register("total_marks", { valueAsNumber: true })}
            />
            <AdminInput
              label="Scholarship Percentage"
              placeholder="Scholarship %"
              type="number"
              min={0}
              max={100}
              testId={`r-pct-${resultId}`}
              className="font-mono"
              {...register("scholarship_percentage", { valueAsNumber: true })}
            />
            <AdminInput
              label="Rank (optional)"
              placeholder="Rank (optional)"
              type="number"
              testId={`r-rank-${resultId}`}
              className="font-mono"
              {...register("rank", { valueAsNumber: true })}
            />
            <AdminInput
              label="Percentile (optional)"
              placeholder="Percentile (optional)"
              type="number"
              step="0.01"
              testId={`r-perc-${resultId}`}
              className="font-mono"
              {...register("percentile", { valueAsNumber: true })}
            />
          </div>
          <AdminTextarea
            label="Remarks / Guidance"
            placeholder="Remarks / Guidance (optional)"
            testId={`r-remarks-${resultId}`}
            className="sm:col-span-2 min-h-16"
            {...register("remarks")}
          />
          <AdminCheckbox
            label="Publish output"
            testId={`r-publish-${resultId}`}
            checked={localData.publish || false}
            onCheckedChange={(val) => setLocalData((prev) => ({ ...prev, publish: val }))}
          />
        </form>
        <DrawerFooter className="flex-row gap-2">
          <Button
            onClick={handleSubmit(submit)}
            className="flex-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"
            data-testid={`r-save-${resultId}`}
          >
            <Save size={14} className="mr-1.5" /> {localData.publish ? "Commit & Publish" : "Save Draft"}
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
