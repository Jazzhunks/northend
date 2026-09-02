import { useEffect, useState, useCallback } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtINR, fmtDate } from "@/lib/erpApi";
// Added "api" explicitly inside your central api routing import below
import { api, formatError, API_BASE } from "@/lib/api";
import { Search, Plus, Download, X, GraduationCap, Users, User, Mail, Smartphone, Receipt, BadgeAlert, ClipboardList } from "lucide-react";

export default function ErpStudents() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const reload = useCallback(() => {
    const params = {};
    if (q) params.q = q;
    if (branchId) params.branch_id = branchId;
    erp.listStudents(params).then(setItems).catch(e => {
      toast.error(formatError(e) || "Failed to sync structural directory stream");
    });
  }, [q, branchId]);

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [q, branchId, reload]);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-students-page">
      {/* Upper Operational Header Card */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Active Registry Database</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Student Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Branch-isolated environment. {items.length} enrollment record{items.length === 1 ? "" : "s"} visible under current role parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`${API_BASE}/erp/exports/students.xlsx`} target="_blank" rel="noreferrer" className="block">
            <button className="px-4 py-2.5 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 transition" data-testid="export-students-btn">
              <Download size={14}/> Export Excel
            </button>
          </a>
          {erpUser.role !== "counsellor" && (
            <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition" data-testid="create-student-btn">
              <Plus size={14}/> New Admission
            </button>
          )}
        </div>
      </div>

      {/* Real-time Query Filter System */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Search active profiles by name, registration code, primary phone..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground" 
            data-testid="search-students-input"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" 
            data-testid="filter-branch"
          >
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      {/* Main Grid View Container */}
      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[850px]">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Student No</th>
                <th className="w-[20%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Full Name</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Contact Line</th>
                <th className="w-[16%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Allocated Branch</th>
                <th className="w-[12%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-right bg-muted">Net Payable</th>
                <th className="w-[10%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Admission</th>
                <th className="w-[12%] bg-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {items.map(s => {
                const baseTuition = Number(s.total_fee || 0);
                const scholarshipExemption = (Number(s.scholarship_percent || 0) / 100) * baseTuition;
                const dynamicFlatDiscount = Number(s.discount || 0);
                const netAmountDiscountedFigure = Math.max(0, baseTuition - scholarshipExemption - dynamicFlatDiscount);

                return (
                  <tr key={s.id} className="hover:bg-muted/50 transition-colors group" data-testid={`student-row-${s.id}`}>
                    <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold tracking-wide">{s.student_no}</td>
                    <td className="px-5 py-4 text-xs font-bold text-foreground truncate">{s.full_name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{s.contact_phone}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground/80 truncate">
                      {branches.find(b => b.id === s.branch_id)?.name || s.branch_id?.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4 font-mono text-right font-bold text-sky-400 whitespace-nowrap text-sm">
                      {fmtINR(netAmountDiscountedFigure)}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground/60 whitespace-nowrap">{fmtDate(s.admission_date)}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap pr-6">
                      <Link 
                        to={`/erp/students/${s.id}`} 
                        className="inline-flex px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 border border-accent/10 hover:bg-accent/20 rounded-lg transition duration-200" 
                        data-testid={`view-student-${s.id}`}
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No registry assets located matching structural query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Execution Sheet Portal */}
      {showCreate && (
        <CreateStudentModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); }}
        />
      )}
    </div>
  );
}

// ============================================================================
// ADMISSION REGISTRY CREATION PROCESSOR INTERFACE
// ============================================================================
function CreateStudentModal({ erpUser, branches, onClose, onCreated }) {
  const [courses, setCourses] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [form, setForm] = useState({
    full_name: "", gender: "Male", dob: "", school_institute: "", board: "JKBOSE", category: "General",
    contact_phone: "", contact_email: "", parent_name: "", parent_phone: "", emergency_phone: "",
    address: "", course_id: "", batch: "",
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    counsellor_id: "", total_fee: "", scholarship_percent: 0, discount: 0
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get("/courses").then(r => setCourses(r.data)); }, []);
  
  useEffect(() => {
    if (form.branch_id) {
      erp.listStaff(form.branch_id).then(s => setCounsellors(s.filter(x => x.role === "counsellor")));
    }
  }, [form.branch_id]);

  const calculatedFee = Number(form.total_fee || 0);
  const calculatedScholarshipAmt = (Number(form.scholarship_percent || 0) / 100) * calculatedFee;
  const calculatedFlatDiscount = Number(form.discount || 0);
  const previewNetFeePayable = Math.max(0, calculatedFee - calculatedScholarshipAmt - calculatedFlatDiscount);

  const submitAdmissionRecord = async (e) => {
    e.preventDefault();
    if (calculatedFee <= 0) {
      toast.error("Tuition value configurations must break out of structural zero values");
      return;
    }
    setBusy(true);
    try {
      const payload = { 
        ...form, 
        total_fee: calculatedFee, 
        scholarship_percent: Number(form.scholarship_percent), 
        discount: calculatedFlatDiscount 
      };
      if (!payload.counsellor_id) delete payload.counsellor_id;
      if (!payload.contact_email) delete payload.contact_email;
      
      await erp.createStudent(payload);
      toast.success("New student academic enrollment written cleanly into roster ledger structures");
      onCreated();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to authorize database allocation variables");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm overflow-y-auto animate-fadeIn" onClick={onClose} data-testid="create-student-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submitAdmissionRecord} className="bg-background border border-border rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <GraduationCap size={13}/> Onboarding Lifecycle Gateway
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Enroll New Student</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition"><X size={18}/></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto px-1 custom-scrollbar">
          <Input label="Full Student Name" v={form.full_name} on={v => setForm({...form, full_name: v})} req placeholder="e.g. Suhail Ahmad" testid="cs-name" icon={User}/>
          <Sel label="Gender" v={form.gender} on={v => setForm({...form, gender: v})} testid="cs-gender"
            opts={[{v:"Male", l:"Male"}, {v:"Female", l:"Female"}, {v:"Other", l:"Other"}]}/>
          <Input label="Date of Birth" type="date" v={form.dob} on={v => setForm({...form, dob: v})} testid="cs-dob"/>
          <Input label="School / Last Institute" v={form.school_institute} on={v => setForm({...form, school_institute: v})} placeholder="e.g. DPS Srinagar" testid="cs-school"/>
          <Sel label="Board" v={form.board} on={v => setForm({...form, board: v})} testid="cs-board"
            opts={[{v:"JKBOSE", l:"JKBOSE"}, {v:"CBSE", l:"CBSE"}, {v:"ICSE", l:"ICSE"}, {v:"Other", l:"Other"}]}/>
          <Sel label="Category" v={form.category} on={v => setForm({...form, category: v})} testid="cs-category"
            opts={[{v:"General", l:"General"}, {v:"OBC", l:"OBC"}, {v:"SC/ST", l:"SC / ST"}, {v:"EWS", l:"EWS"}]}/>
          <Input label="Primary Phone String" v={form.contact_phone} on={v => setForm({...form, contact_phone: v})} req placeholder="10-digit sequence" testid="cs-phone" icon={Smartphone}/>
          <Input label="Email Address" type="email" v={form.contact_email} on={v => setForm({...form, contact_email: v})} placeholder="name@domain.com" testid="cs-email" icon={Mail}/>
          <Input label="Parent / Guardian Name" v={form.parent_name} on={v => setForm({...form, parent_name: v})} placeholder="Father/Mother Identity" testid="cs-pname" icon={Users}/>
          <Input label="Parent Contact Line" v={form.parent_phone} on={v => setForm({...form, parent_phone: v})} placeholder="Parent mobile" testid="cs-pphone" icon={Smartphone}/>
          <Input label="Emergency Contact Phone" v={form.emergency_phone} on={v => setForm({...form, emergency_phone: v})} placeholder="Alternative phone" testid="cs-ephone" icon={Smartphone}/>
          <Input label="Batch Code Allocation" v={form.batch} on={v => setForm({...form, batch: v})} placeholder="NEET-2026-ALPHA" testid="cs-batch" icon={ClipboardList}/>
          
          <Sel label="Operation Branch Center" v={form.branch_id} on={v => setForm({...form, branch_id: v, counsellor_id: ""})} req disabled={!isSuper(erpUser)} testid="cs-branch"
            opts={branches.map(b => ({ v: b.id, l: b.name }))} />
          <Sel label="Course Syllabus Track" v={form.course_id} on={v => setForm({...form, course_id: v})} req testid="cs-course"
            opts={courses.map(c => ({ v: c.id, l: `${c.title} (${c.category})` }))} />
          <Sel label="Onboarding Executive Counsellor" v={form.counsellor_id} on={v => setForm({...form, counsellor_id: v})} testid="cs-counsellor"
            opts={[{ v: "", l: "— Direct Walk-In (No Tag) —" }, ...counsellors.map(c => ({ v: c.id, l: c.name }))]} />
            
          <Input label="Gross Fee Structure Value (INR)" type="number" v={form.total_fee} on={v => setForm({...form, total_fee: v})} req placeholder="0.00" testid="cs-fee" icon={Receipt}/>
          <Input label="Waiver Scholarship %" type="number" v={form.scholarship_percent} on={v => setForm({...form, scholarship_percent: v})} placeholder="0" testid="cs-sch" icon={BadgeAlert}/>
          <Input label="Special Flat Discount (INR)" type="number" v={form.discount} on={v => setForm({...form, discount: v})} placeholder="0" testid="cs-disc" icon={Receipt}/>
          
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Residential Physical Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} placeholder="Complete geographical verification details..." className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent transition resize-none" data-testid="cs-address"/>
          </div>
        </div>

        {/* Dynamic State Preview Mathematical Feedback Row */}
        <div className="p-4 border border-dashed border-border rounded-xl bg-white/[0.01] flex items-center justify-between shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Ledger Preview Metrics</div>
            <div className="text-xs text-muted-foreground/60 mt-0.5">Exemptions: {fmtINR(calculatedScholarshipAmt + calculatedFlatDiscount)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Net Fee Obligation</div>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{fmtINR(previewNetFeePayable)}</div>
          </div>
        </div>

        <div className="flex gap-3 pt-2 shrink-0">
          <button disabled={busy} type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center" data-testid="cs-submit">
            {busy ? "Writing Ledger Matrix..." : "Authorize Academic Enrollment"}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, v, on, type = "text", req, testid, placeholder, icon: Icon }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <div className="relative">
        {Icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><Icon size={14}/></span>}
        <input 
          type={type} 
          value={v} 
          required={req} 
          placeholder={placeholder} 
          onChange={e => on(e.target.value)}
          className={`w-full pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent transition text-foreground ${Icon ? "pl-9" : "px-3"}`} 
          data-testid={testid}
        />
      </div>
    </div>
  );
}

function Sel({ label, v, on, opts, req, disabled, testid }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <select 
        value={v} 
        onChange={e => on(e.target.value)} 
        required={req} 
        disabled={disabled}
        className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent transition disabled:opacity-50" 
        data-testid={testid}
      >
        {req && <option value="">— Select Reference Track —</option>}
        {opts.map(o => <option key={o.v} value={o.v} className="bg-background text-foreground">{o.l}</option>)}
      </select>
    </div>
  );
}