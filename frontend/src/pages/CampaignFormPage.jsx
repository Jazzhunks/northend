import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { AdminForm, AdminInput, AdminSelect, AdminDatePicker, AdminDateTimePicker, AdminCheckbox, AdminTextarea, AdminChipInput } from "@/components/admin";

const TYPE_OPTIONS = [
  { label: "General", value: "general" },
  { label: "School", value: "school" },
];

export default function CampaignFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [customVenue, setCustomVenue] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    exam_date: "",
    deadline: "",
    eligibility: "",
    venue: "",
    available_venues: [],
    exam_time: "10:00 AM",
    total_marks: 100,
    whatsapp_community_url: "",
    active: true,
    is_featured: false,
    type: "general",
    start_date: "",
    end_date: "",
    eligible_classes: [],
    time_slots: [],
  });

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api.get(`/scholarships/${id}`)
      .then(r => {
        const d = r.data || {};
        setForm({
          title: d.title || "",
          description: d.description || "",
          exam_date: d.exam_date || "",
          deadline: d.deadline || "",
          eligibility: d.eligibility || "",
          venue: d.venue || "",
          available_venues: Array.isArray(d.available_venues) ? d.available_venues : [],
          exam_time: d.exam_time || "10:00 AM",
          total_marks: d.total_marks ?? 100,
          whatsapp_community_url: d.whatsapp_community_url || "",
          active: d.active ?? true,
          is_featured: d.is_featured ?? false,
          type: d.type || "general",
          start_date: d.start_date || "",
          end_date: d.end_date || "",
          eligible_classes: Array.isArray(d.eligible_classes) ? d.eligible_classes : [],
          time_slots: Array.isArray(d.time_slots) ? d.time_slots : [],
        });
      })
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const addVenue = () => {
    const v = customVenue.trim();
    if (!v) return;
    if (!form.available_venues.includes(v)) {
      update({ available_venues: [...form.available_venues, v] });
    }
    setCustomVenue("");
  };

  const removeVenue = (v) => update({ available_venues: form.available_venues.filter(x => x !== v) });

  const submit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (form.type === "general") {
      if (!form.exam_date || !form.deadline || !form.eligibility) {
        toast.error("Fill exam date, deadline and eligibility"); return;
      }
    } else {
      if (!form.start_date || !form.end_date) {
        toast.error("Fill start and end date"); return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        available_venues: form.available_venues.map(v => v.trim()),
      };
      if (isEdit) {
        await api.put(`/scholarships/${id}`, payload);
        toast.success("Campaign updated");
      } else {
        await api.post("/scholarships", payload);
        toast.success("Campaign created");
      }
      navigate("/admin");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/admin")} className="p-2 rounded-xl border border-border hover:bg-muted/50 cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Campaign</div>
            <div className="font-display text-xl sm:text-3xl font-light tracking-tight text-foreground">{isEdit ? "Edit Campaign" : "New Campaign"}</div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5">
          <AdminInput label="Campaign Name" value={form.title} onChange={e => update({ title: e.target.value })} required />

          <AdminSelect label="Campaign Type" value={form.type} onValueChange={val => update({ type: val })} options={TYPE_OPTIONS} />

          {form.type === "school" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminDatePicker label="Start Date" value={form.start_date} onChange={val => update({ start_date: val })} />
                <AdminDatePicker label="End Date" value={form.end_date} onChange={val => update({ end_date: val })} />
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Eligible Classes</div>
                <div className="flex flex-wrap gap-2">
                  {["Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Dropper (JEE)","Dropper (NEET)"].map(cls => {
                    const checked = (form.eligible_classes || []).includes(cls);
                    return (
                      <button key={cls} type="button" onClick={() => update({ eligible_classes: checked ? form.eligible_classes.filter(c => c !== cls) : [...form.eligible_classes, cls] })} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border text-muted-foreground hover:bg-muted/50"}`}>
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Time Slots</div>
                {(form.time_slots || []).map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-wrap">
                    <input type="time" value={slot.from_time || ""} onChange={e => { const slots = [...form.time_slots]; slots[idx] = { ...slots[idx], from_time: e.target.value }; update({ time_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1 min-w-[120px]" />
                    <span className="text-xs text-muted-foreground">to</span>
                    <input type="time" value={slot.to_time || ""} onChange={e => { const slots = [...form.time_slots]; slots[idx] = { ...slots[idx], to_time: e.target.value }; update({ time_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1 min-w-[120px]" />
                    <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer select-none">
                      <input type="checkbox" checked={slot.enabled !== false} onChange={e => { const slots = [...form.time_slots]; slots[idx] = { ...slots[idx], enabled: e.target.checked }; update({ time_slots: slots }); }} />
                      Enabled
                    </label>
                    <button type="button" onClick={() => update({ time_slots: form.time_slots.filter((_, i) => i !== idx) })} className="text-rose-500 hover:text-rose-600 text-xs px-2 cursor-pointer">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => update({ time_slots: [...form.time_slots, { from_time: "09:00", to_time: "10:00", enabled: true }] })} className="text-xs text-primary hover:text-primary/80 font-medium cursor-pointer">+ Add Time Slot</button>
              </div>
            </>
          ) : (
            <>
              <AdminInput label="Eligibility Criteria" value={form.eligibility} onChange={e => update({ eligibility: e.target.value })} required />
              <AdminInput label="Examination Date" value={form.exam_date} onChange={e => update({ exam_date: e.target.value })} required />
              <AdminInput label="Lock Expiration Deadline" value={form.deadline} onChange={e => update({ deadline: e.target.value })} required />
              <AdminDateTimePicker label="Execution Time Grid" value={form.exam_time} onChange={val => update({ exam_time: val })} className="font-mono" />
              <AdminInput label="Total Marks" type="number" value={form.total_marks} onChange={e => update({ total_marks: Number(e.target.value) })} className="font-mono" />
              <AdminInput label="WhatsApp Community URL" value={form.whatsapp_community_url} onChange={e => update({ whatsapp_community_url: e.target.value })} className="sm:col-span-2" />

              <div className="sm:col-span-2 space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">Authorized Running Venues</div>
                <div className="flex flex-wrap gap-2">
                  {form.available_venues.map(v => (
                    <span key={v} className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-border bg-background/40 inline-flex items-center gap-2">
                      {v}
                      <button type="button" onClick={() => removeVenue(v)} className="text-rose-500 hover:text-rose-600 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={customVenue} onChange={e => setCustomVenue(e.target.value)} placeholder="Add custom venue" className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addVenue())} />
                  <button type="button" onClick={addVenue} className="px-3 py-2 rounded-xl border border-border text-xs font-bold uppercase tracking-wider hover:bg-muted/50 cursor-pointer">Add</button>
                </div>
              </div>

              <AdminTextarea label="Description" value={form.description} onChange={e => update({ description: e.target.value })} className="sm:col-span-2" required />
            </>
          )}

          <AdminCheckbox label="Flag project as active status" checked={form.active} onCheckedChange={val => update({ active: val })} className="font-medium" />
          <AdminCheckbox label="Featured campaign" checked={form.is_featured} onCheckedChange={val => update({ is_featured: val })} className="font-medium" />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => navigate("/admin")} className="px-4 py-2 rounded-xl border border-border text-xs font-bold uppercase tracking-wider hover:bg-muted/50 cursor-pointer">Cancel</button>
            <button type="button" onClick={submit} disabled={saving} className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer">
              {saving ? "Saving…" : isEdit ? "Update Campaign" : "Create Campaign"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
