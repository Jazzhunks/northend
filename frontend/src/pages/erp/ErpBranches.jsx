import { useEffect, useState } from "react";
import { toast } from "sonner";
import { erp } from "@/lib/erpApi";
import { Save } from "lucide-react";

export default function ErpBranches() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { erp.listBranches().then(setItems); }, []);

  const open = (b) => {
    setEditing(b.id);
    setForm({
      gstin: b.gstin || "",
      signatory_name: b.signatory_name || "",
      state_code: b.state_code || "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updated = await erp.updateBranch(editing, form);
      setItems(items.map(i => i.id === updated.id ? updated : i));
      setEditing(null);
      toast.success("Saved");
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6" data-testid="erp-branches-page">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Network</div>
        <h1 className="font-display text-4xl font-black tracking-tight mt-1">Branches</h1>
        <p className="text-muted-foreground mt-1">Configure GSTIN and signatory for each centre.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {items.map(b => (
          <div key={b.id} className="bg-background border border-border rounded-md p-5" data-testid={`branch-card-${b.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.address}</p>
                <p className="text-xs font-mono text-muted-foreground mt-2">{b.phone}</p>
              </div>
              <button onClick={() => open(b)} className="text-xs text-primary font-bold underline" data-testid={`edit-branch-${b.id}`}>Edit</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
              <div>
                <div className="text-muted-foreground uppercase tracking-wider">GSTIN</div>
                <div className="font-mono mt-0.5">{b.gstin || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground uppercase tracking-wider">Signatory</div>
                <div className="font-medium mt-0.5">{b.signatory_name || "—"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setEditing(null)} data-testid="edit-branch-modal">
          <form onClick={e => e.stopPropagation()} onSubmit={save} className="bg-background rounded-md max-w-md w-full p-6 space-y-3">
            <h3 className="font-display text-2xl font-black">Branch settings</h3>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">GSTIN</label>
              <input value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} placeholder="01ABCDE1234F1Z5" className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-mono" data-testid="eb-gstin"/>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Signatory name</label>
              <input value={form.signatory_name} onChange={e => setForm({...form, signatory_name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="eb-signatory"/>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">State code</label>
              <input value={form.state_code} onChange={e => setForm({...form, state_code: e.target.value})} placeholder="01 (J&K)" className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-mono" data-testid="eb-state"/>
            </div>
            <div className="flex gap-2 pt-2">
              <button disabled={busy} type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50 flex items-center justify-center gap-2" data-testid="eb-save"><Save size={14}/>{busy ? "Saving…" : "Save"}</button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-3 border border-border rounded-md text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
