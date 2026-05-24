import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtINR, fmtDate } from "@/lib/erpApi";
import { api, API_BASE } from "@/lib/api";
import { Search, Plus, Download, X } from "lucide-react";

export default function ErpStudents() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const reload = () => {
    const params = {};
    if (q) params.q = q;
    if (branchId) params.branch_id = branchId;
    erp.listStudents(params).then(setItems);
  };

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [q, branchId]);

  return (
    <div className="space-y-6" data-testid="erp-students-page">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Records</div>
          <h1 className="font-display text-4xl font-black tracking-tight mt-1">Students</h1>
          <p className="text-muted-foreground mt-1">Branch-isolated. {items.length} record{items.length===1?"":"s"} visible.</p>
        </div>
        <div className="flex gap-2">
          <a href={`${API_BASE}/erp/exports/students.xlsx`} target="_blank" rel="noreferrer">
            <button className="px-4 py-2 border border-border rounded-md text-sm font-medium flex items-center gap-2" data-testid="export-students-btn"><Download size={14}/>Excel</button>
          </a>
          {erpUser.role !== "counsellor" && (
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2" data-testid="create-student-btn"><Plus size={14}/>New student</button>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, phone, ID…"
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="search-students-input"/>
        </div>
        {isSuper(erpUser) && (
          <select value={branchId} onChange={e => setBranchId(e.target.value)}
            className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Student No</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-right">Total Fee</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Admitted</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/20" data-testid={`student-row-${s.id}`}>
                  <td className="px-4 py-3 font-mono text-xs">{s.student_no}</td>
                  <td className="px-4 py-3 font-bold">{s.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.contact_phone}</td>
                  <td className="px-4 py-3 text-xs">{branches.find(b => b.id === s.branch_id)?.name || s.branch_id?.slice(0,8)}</td>
                  <td className="px-4 py-3 font-mono text-right">{fmtINR(s.total_fee)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(s.admission_date)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/erp/students/${s.id}`} className="text-primary font-bold text-xs underline" data-testid={`view-student-${s.id}`}>Open →</Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-12 text-center text-muted-foreground">No students yet. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateStudentModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("Student created"); }}
        />
      )}
    </div>
  );
}

function CreateStudentModal({ erpUser, branches, onClose, onCreated }) {
  const [courses, setCourses] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [form, setForm] = useState({
    full_name: "", contact_phone: "", contact_email: "", parent_name: "", parent_phone: "",
    address: "", course_id: "", batch: "",
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    counsellor_id: "", total_fee: "", scholarship_percent: 0, discount: 0
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get("/courses").then(r => setCourses(r.data)); }, []);
  useEffect(() => {
    if (form.branch_id) erp.listStaff(form.branch_id).then(s => setCounsellors(s.filter(x => x.role === "counsellor")));
  }, [form.branch_id]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, total_fee: Number(form.total_fee), scholarship_percent: Number(form.scholarship_percent), discount: Number(form.discount) };
      if (!payload.counsellor_id) delete payload.counsellor_id;
      await erp.createStudent(payload);
      onCreated();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4 overflow-y-auto" onClick={onClose} data-testid="create-student-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-md max-w-2xl w-full p-6 space-y-4 my-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">New admission</div>
            <h3 className="font-display text-2xl font-black mt-1">Create student record</h3>
          </div>
          <button type="button" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Full name" v={form.full_name} on={v => setForm({...form, full_name: v})} req testid="cs-name"/>
          <Input label="Phone" v={form.contact_phone} on={v => setForm({...form, contact_phone: v})} req testid="cs-phone"/>
          <Input label="Email" type="email" v={form.contact_email} on={v => setForm({...form, contact_email: v})} testid="cs-email"/>
          <Input label="Parent name" v={form.parent_name} on={v => setForm({...form, parent_name: v})} testid="cs-pname"/>
          <Input label="Parent phone" v={form.parent_phone} on={v => setForm({...form, parent_phone: v})} testid="cs-pphone"/>
          <Input label="Batch" v={form.batch} on={v => setForm({...form, batch: v})} placeholder="NEET-26-A" testid="cs-batch"/>
          <Sel label="Branch" v={form.branch_id} on={v => setForm({...form, branch_id: v, counsellor_id: ""})} req disabled={!isSuper(erpUser)} testid="cs-branch"
            opts={branches.map(b => ({ v: b.id, l: b.name }))} />
          <Sel label="Course" v={form.course_id} on={v => setForm({...form, course_id: v})} req testid="cs-course"
            opts={courses.map(c => ({ v: c.id, l: `${c.title} (${c.category})` }))} />
          <Sel label="Counsellor" v={form.counsellor_id} on={v => setForm({...form, counsellor_id: v})} testid="cs-counsellor"
            opts={[{ v: "", l: "— None —" }, ...counsellors.map(c => ({ v: c.id, l: c.name }))]} />
          <Input label="Total fee (INR)" type="number" v={form.total_fee} on={v => setForm({...form, total_fee: v})} req testid="cs-fee"/>
          <Input label="Scholarship %" type="number" v={form.scholarship_percent} on={v => setForm({...form, scholarship_percent: v})} testid="cs-sch"/>
          <Input label="Discount (INR)" type="number" v={form.discount} on={v => setForm({...form, discount: v})} testid="cs-disc"/>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-address"/>
          </div>
        </div>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50" data-testid="cs-submit">{busy ? "Saving…" : "Create student"}</button>
      </form>
    </div>
  );
}

function Input({ label, v, on, type = "text", req, testid, placeholder }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <input type={type} value={v} required={req} placeholder={placeholder} onChange={e => on(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid={testid}/>
    </div>
  );
}

function Sel({ label, v, on, opts, req, disabled, testid }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <select value={v} onChange={e => on(e.target.value)} required={req} disabled={disabled}
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-60" data-testid={testid}>
        {req && <option value="">— Select —</option>}
        {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
