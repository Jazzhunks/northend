import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminForm, AdminInput, AdminSelect, AdminDatePicker, AdminDateTimePicker, AdminCheckbox, AdminTextarea } from "@/components/admin";
import { campaignSchema } from "@/lib/schemas";

const CLASSES_OPTIONS = ["ALL", "7th Class", "8th Class", "9th Class", "10th Class", "11th Class", "12th Class"];
const TYPE_OPTIONS = [
  { label: "General", value: "general" },
  { label: "School", value: "school" },
];

export default function CampaignForm({ onSubmit, centers }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "", description: "", exam_date: "", deadline: "", eligibility: "", venue: "",
      available_venues: [], whatsapp_community_url: "", exam_time: "10:00 AM", total_marks: 100,
      active: true, is_featured: false, type: "general",
      start_date: "", end_date: "", eligible_classes: [], time_slots: [],
    },
  });

  const type_ = watch("type");
  const eligibleClasses = watch("eligible_classes") || [];
  const timeSlots = watch("time_slots") || [];

  const handleTypeChange = (val) => {
    setValue("type", val, { shouldDirty: true });
    if (val === "school") {
      setValue("description", "");
      setValue("exam_date", "");
      setValue("deadline", "");
      setValue("eligibility", "");
      setValue("available_venues", []);
      setValue("whatsapp_community_url", "");
      setValue("exam_time", "10:00 AM");
      setValue("total_marks", 100);
    } else {
      setValue("start_date", "");
      setValue("end_date", "");
      setValue("eligible_classes", []);
      setValue("time_slots", []);
    }
  };

  const submit = (data) => {
    onSubmit(data);
    reset({
      title: "", description: "", exam_date: "", deadline: "", eligibility: "", venue: "",
      available_venues: [], whatsapp_community_url: "", exam_time: "10:00 AM", total_marks: 100,
      active: true, is_featured: false, type: "general",
      start_date: "", end_date: "", eligible_classes: [], time_slots: [],
    });
  };

  return (
    <AdminForm onSubmit={handleSubmit(submit)} submitLabel="Launch Test Campaign" data-testid="campaign-form" title="New Scholarship Campaign">
      <AdminInput label="Campaign Name" testId="ncm-title" {...register("title")} required />
      <AdminSelect label="Campaign Type" testId="ncm-type" value={type_} onValueChange={handleTypeChange} options={TYPE_OPTIONS} />
      {type_ === "school" ? (
        <>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminDatePicker label="Campaign Start Date" testId="ncm-start-date" value={watch("start_date")} onChange={(val) => setValue("start_date", val)} />
            <AdminDatePicker label="Campaign End Date" testId="ncm-end-date" value={watch("end_date")} onChange={(val) => setValue("end_date", val)} />
          </div>
          <div className="sm:col-span-2 border border-border rounded-xl p-4 bg-background/30 space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Eligible Classes</div>
            <div className="flex flex-wrap gap-2">
              {CLASSES_OPTIONS.map((cls) => {
                const checked = eligibleClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setValue("eligible_classes", checked ? eligibleClasses.filter((c) => c !== cls) : [...eligibleClasses, cls])}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${
                      checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                    data-testid={`ncm-class-${cls}`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="sm:col-span-2 border border-border rounded-xl p-4 bg-background/30 space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Time Slots</div>
            <div className="space-y-2">
              {timeSlots.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 flex-wrap">
                  <input type="time" value={slot.from_time || ""} onChange={(e) => { const slots = [...timeSlots]; slots[idx] = { ...slots[idx], from_time: e.target.value }; setValue("time_slots", slots); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1 min-w-[120px]" />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input type="time" value={slot.to_time || ""} onChange={(e) => { const slots = [...timeSlots]; slots[idx] = { ...slots[idx], to_time: e.target.value }; setValue("time_slots", slots); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1 min-w-[120px]" />
                  <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer select-none">
                    <input type="checkbox" checked={slot.enabled !== false} onChange={(e) => { const slots = [...timeSlots]; slots[idx] = { ...slots[idx], enabled: e.target.checked }; setValue("time_slots", slots); }} />
                    Enabled
                  </label>
                  <button type="button" onClick={() => setValue("time_slots", timeSlots.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-600 text-xs px-2 cursor-pointer">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setValue("time_slots", [...timeSlots, { from_time: "09:00", to_time: "10:00", enabled: true }])} className="text-xs text-primary hover:text-primary/80 font-medium cursor-pointer">+ Add Time Slot</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <AdminInput label="Eligibility Criteria" testId="ncm-elig" {...register("eligibility")} required />
          <AdminInput label="Examination Date" testId="ncm-exam" className="font-mono" {...register("exam_date")} required />
          <AdminInput label="Lock Expiration Deadline" testId="ncm-dead" className="font-mono" {...register("deadline")} required />
          <AdminDateTimePicker label="Execution Time Grid" testId="ncm-time" value={watch("exam_time")} onChange={(val) => setValue("exam_time", val)} className="font-mono" />
          <AdminInput label="Total Marks" testId="ncm-marks" type="number" className="font-mono" {...register("total_marks", { valueAsNumber: true })} />
          <AdminInput label="WhatsApp Community URL" testId="ncm-wa" className="sm:col-span-2" {...register("whatsapp_community_url")} />
          <div className="sm:col-span-2 space-y-1.5">
            <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Authorized Running Venues</div>
            <div className="flex flex-wrap gap-2 glass rounded-xl p-2.5 bg-background/50 border border-border">
              {centers.map((c) => {
                const checked = (watch("available_venues") || []).includes(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setValue("available_venues", checked ? (watch("available_venues") || []).filter((v) => v !== c.name) : [...(watch("available_venues") || []), c.name])}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${
                      checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                    data-testid={`ncm-venue-${c.id}`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <AdminTextarea label="Description" testId="ncm-desc" className="sm:col-span-2" {...register("description")} required />
        </>
      )}
      <AdminCheckbox label="Flag project as active status" testId="ncm-active" checked={watch("active")} onCheckedChange={(val) => setValue("active", val)} className="sm:col-span-2 font-medium" />
    </AdminForm>
  );
}

