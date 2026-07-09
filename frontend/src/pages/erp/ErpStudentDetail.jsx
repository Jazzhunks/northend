import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, isFinance, fmtINR, fmtDate } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { api, API_BASE } from "@/lib/api";
import { 
  ArrowLeft, Plus, FileDown, Receipt as ReceiptIcon, Edit3, 
  X, Save, CheckCircle, Smartphone, Mail, MapPin, Milestone, User, Users, ClipboardList
} from "lucide-react";

export default function ErpStudentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { erpUser } = useOutletContext();
  
  const [stmt, setStmt] = useState(null);
  const [course, setCourse] = useState(null);
  const [showPay, setShowPay] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const reload = () => {
    erp.studentStatement(id)
      .then(setStmt)
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to sync statement data"));
  };

  useEffect(() => { reload(); }, [id]);
  
  useEffect(() => {
    if (stmt?.student?.course_id) {
      api.get(`/courses/${stmt.student.course_id}`)
        .then(r => setCourse(r.data))
        .catch(() => {});
    }
  }, [stmt?.student?.course_id]);

  if (!stmt) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20 text-center animate-pulse">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-muted-foreground text-xs font-mono tracking-wider uppercase">Loading Student Dossier...</div>
      </div>
    );
  }

  const s = stmt.student;
  const canRecordPayment = erpUser.role !== "counsellor";

  const notifyParentViaWhatsApp = () => {
    if (!s.parent_phone && !s.contact_phone) {
      toast.error("No communication endpoints available for this record");
      return;
    }
    const txt = `Dear Parent,\n\nThis is an official tracking reminder from Northend Educational World regarding the pending academic fee installment balance of ${fmtINR(stmt.pending)} for your child ${s.full_name} (${s.student_no}).\n\nKindly clear the outstanding amount at your earliest convenience.\n\nThank you,\nAdministration Management Console`;
    const phone = (s.parent_phone || s.contact_phone).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-fadeIn" data-testid="erp-student-detail">
      {/* Navigation Row */}
      <div className="flex items-center justify-between shrink-0">
        <button 
          onClick={() => nav("/erp/students")} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" 
          data-testid="back-to-students"
        >
          <ArrowLeft size={14}/> Back to directory
        </button>
        <button 
          onClick={() => setShowEditProfile(true)} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
        >
          <Edit3 size={13}/> Modify Profile
        </button>
      </div>

      {/* Profile dossier card */}
      <div className="glass-elevated rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 opacity-[0.02] text-foreground pointer-events-none transition-transform duration-500 group-hover:scale-105">
          <User size={160} />
        </div>
        
        <div className="flex justify-between items-start flex-wrap gap-3 relative z-10">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent font-mono">{s.student_no}</div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">{s.full_name}</h1>
            <p className="text-muted-foreground text-sm flex items-center flex-wrap gap-x-2 divide-x divide-white/10">
              <span>{course?.title || "Evaluating Syllabus Track..."}</span>
              {s.batch && <span className="pl-2 font-mono">Batch: {s.batch}</span>}
              <span className="pl-2">Admitted: {fmtDate(s.admission_date)}</span>
            </p>
          </div>
          <span 
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
              s.status === "active" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-white/5 text-muted-foreground border-white/10"
            }`} 
            data-testid="student-status"
          >
            {s.status}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/[0.04] relative z-10">
          <FieldCard icon={Smartphone} label="Student Phone" v={s.contact_phone}/>
          <FieldCard icon={Mail} label="Email Address" v={s.contact_email}/>
          <FieldCard icon={Users} label="Parent / Guardian" v={s.parent_name}/>
          <FieldCard icon={Smartphone} label="Parent Phone" v={s.parent_phone}/>
        </div>
        {s.address && (
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 relative z-10 font-sans">
            <MapPin size={13} className="text-accent"/> {s.address}
          </div>
        )}
      </div>

      {/* Ledger summary snapshot cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Course Fee" value={fmtINR(stmt.total_fee)}/>
        <StatCard label="Waiver Scholarship" value={`${stmt.scholarship_percent}%`} sub={`Saved ${fmtINR(stmt.scholarship_amount)}`}/>
        <StatCard label="Flat Discount" value={fmtINR(stmt.discount)}/>
        <StatCard label="Net Obligation" value={fmtINR(stmt.net_fee)} accent="text-sky-400"/>
        <StatCard 
          label="Outstanding Balance" 
          value={fmtINR(stmt.pending)} 
          accent={stmt.pending > 0 ? "text-rose-400" : "text-emerald-400"} 
          testid="pending-amount"
          actionElement={stmt.pending > 0 ? (
            <button onClick={notifyParentViaWhatsApp} className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 underline block mt-1 hover:text-emerald-300">
              Nudge via WhatsApp
            </button>
          ) : null}
        />
      </div>

      {/* Payments history ledger view (UPGRADED INDEPENDENT SCROLL ZONE) */}
      <div className="glass-elevated rounded-2xl overflow-hidden border border-white/5 animate-fadeIn flex flex-col max-h-[420px]">
        <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.01] shrink-0">
          <h3 className="font-display font-medium text-lg flex items-center gap-2">
            <ClipboardList size={18} className="text-accent" /> Transaction Ledger History
          </h3>
          {canRecordPayment && stmt.pending > 0 && (
            <button 
              onClick={() => setShowPay(true)} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition shrink-0" 
              data-testid="record-payment-btn"
            >
              <Plus size={14}/> Record Payment
            </button>
          )}
        </div>
        
        {/* Scroll Box Shell Container Layer */}
        <div className="overflow-y-auto overflow-x-auto w-full flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm table-fixed border-collapse min-w-[780px]">
            <thead className="bg-[#18181b] text-muted-foreground sticky top-0 z-10 border-b border-white/5 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                <th className="w-[18%] px-6 py-3.5 bg-[#131316]">Receipt ID</th>
                <th className="w-[15%] px-6 py-3.5 bg-[#131316]">Clearance Date</th>
                <th className="w-[12%] px-6 py-3.5 bg-[#131316]">Payment Method</th>
                <th className="w-[12%] px-6 py-3.5 text-right bg-[#131316]">Base Tuition</th>
                <th className="w-[10%] px-6 py-3.5 text-right bg-[#131316]">CGST (9%)</th>
                <th className="w-[10%] px-6 py-3.5 text-right bg-[#131316]">SGST (9%)</th>
                <th className="w-[15%] px-6 py-3.5 text-right bg-[#131316]">Gross Collected</th>
                <th className="w-[8%] bg-[#131316]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-background/20">
              {stmt.payments.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-foreground font-semibold">{p.receipt_no}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(p.paid_at)}</td>
                  <td className="px-6 py-4 text-xs whitespace-nowrap"><span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-bold text-muted-foreground">{p.mode}</span></td>
                  <td className="px-6 py-4 font-mono text-right text-xs text-muted-foreground whitespace-nowrap">{fmtINR(p.base_amount)}</td>
                  <td className="px-6 py-4 font-mono text-right text-xs text-muted-foreground/60 whitespace-nowrap">{fmtINR(p.cgst)}</td>
                  <td className="px-6 py-4 font-mono text-right text-xs text-muted-foreground/60 whitespace-nowrap">{fmtINR(p.sgst)}</td>
                  <td className="px-6 py-4 font-mono text-right font-bold text-emerald-400 text-sm whitespace-nowrap">{fmtINR(p.amount)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <a 
                      href={`${API_BASE}/erp/payments/${p.id}/receipt`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex p-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg text-accent transition" 
                      data-testid={`download-receipt-${p.id}`}
                    >
                      <FileDown size={14}/>
                    </a>
                  </td>
                </tr>
              ))}
              {stmt.payments.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-muted-foreground italic">
                    <ReceiptIcon size={28} className="mx-auto mb-3 opacity-30 text-accent"/>
                    No verified cashbook transaction sequences matching this enrollment signature.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fixed Foot Aggregate Ledger Totals */}
        {stmt.payments.length > 0 && (
          <div className="bg-[#131316] border-t border-white/[0.06] px-6 py-4 flex items-center justify-between font-bold text-foreground shrink-0 z-10 shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Aggregate Sunk Income</div>
            <div className="font-mono text-lg text-emerald-400">{fmtINR(stmt.total_paid)}</div>
          </div>
        )}
      </div>

      {/* CREATE RECORD PAYMENT SUB MODAL PORTAL */}
      {showPay && (
        <RecordPaymentModal
          studentId={s.id}
          pending={stmt.pending}
          onClose={() => setShowPay(false)}
          onCreated={() => { setShowPay(false); reload(); toast.success("Installment clearance written safely."); }}
        />
      )}

      {/* UPDATE STUDENT DOSSIER PARAMETERS MODAL SHEET */}
      {showEditProfile && (
        <EditStudentProfileModal 
          student={s}
          onClose={() => setShowEditProfile(false)}
          onUpdated={() => { setShowEditProfile(false); reload(); }}
        />
      )}
    </div>
  );
}

function FieldCard({ icon: Icon, label, v }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon size={14} className="text-accent mt-0.5 opacity-60 shrink-0"/>}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</div>
        <div className="text-sm mt-0.5 font-medium text-foreground">{v || "—"}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent, actionElement, testid }) {
  return (
    <div className="glass-elevated rounded-2xl p-5 border border-white/5" data-testid={testid}>
      <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
      <div className={`font-display text-3xl font-medium mt-2 tracking-tight ${accent || "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[11px] font-mono text-muted-foreground mt-1">{sub}</div>}
      {actionElement}
    </div>
  );
}

function EditStudentProfileModal({ student, onClose, onUpdated }) {
  const [form, setForm] = useState({
    full_name: student.full_name || "",
    contact_phone: student.contact_phone || "",
    contact_email: student.contact_email || "",
    parent_name: student.parent_name || "",
    parent_phone: student.parent_phone || "",
    batch: student.batch || "",
    address: student.address || "",
    status: student.status || "active"
  });
  const [busy, setBusy] = useState(false);

  const submitProfileChanges = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await erp.updateStudent(student.id, form);
      toast.success("Student profile infrastructure records customized cleanly");
      onUpdated();
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || "Failed to commit mutation array");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={submitProfileChanges} className="bg-background border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <Milestone size={12}/> Academic Registry Modification
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Edit Dossier State</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition"><X size={18}/></button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] px-1 custom-scrollbar">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Full Registration Name *</label>
            <input required type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Contact Phone *</label>
              <input required type="text" value={form.contact_phone} onChange={e => setForm({...form, contact_phone: v})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Email Address</label>
              <input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Parent Guardian Name</label>
              <input type="text" value={form.parent_name} onChange={e => setForm({...form, parent_name: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Parent Mobile Handle</label>
              <input type="text" value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Batch Code</label>
              <input type="text" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">System Standing Status *</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background rounded-xl text-sm text-foreground focus:outline-none">
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Residential Address Mapping</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-2">
            <Save size={14}/> {busy ? "Authorizing State Changes..." : "Authorize Dataset Mutation"}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function RecordPaymentModal({ studentId, pending, onClose, onCreated }) {
  const [form, setForm] = useState({ amount: "", mode: "cash", next_due_date: "", notes: "", apply_gst: true });
  const [busy, setBusy] = useState(false);

  const submitPaymentTransaction = async (e) => {
    e.preventDefault();
    const entryAmount = Number(form.amount);
    
    if (entryAmount <= 0) {
      toast.error("Collection metrics must exceed structural zero boundaries");
      return;
    }
    if (entryAmount > pending) {
      toast.error(`Collection values cannot break maximum outstanding cap boundary limits of ${fmtINR(pending)}`);
      return;
    }

    setBusy(true);
    try {
      await erp.createPayment({
        student_id: studentId,
        amount: entryAmount,
        mode: form.mode,
        apply_gst: form.apply_gst,
        next_due_date: form.next_due_date || null,
        notes: form.notes || null,
      });
      onCreated();
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || "Failed to finalize cash token allocation mapping");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose} data-testid="record-payment-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submitPaymentTransaction} className="bg-background border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
            <CheckCircle size={12}/> Cash Book Intake Layer
          </div>
          <h3 className="font-display text-2xl font-medium mt-1">Log Installment Collection</h3>
          <p className="text-sm text-muted-foreground mt-1">Outstanding sub-ledger collection boundary limit: <b className="text-rose-400 font-mono">{fmtINR(pending)}</b></p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Amount Settled (inclusive of GST) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-muted-foreground/50">₹</span>
              <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full pl-7 pr-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent" data-testid="rp-amount"/>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Intake Mode *</label>
              <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background rounded-xl text-sm text-foreground focus:outline-none" data-testid="rp-mode">
                {["cash", "upi", "online", "cheque", "card"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Next Term Due (Optional)</label>
              <input type="date" value={form.next_due_date} onChange={e => setForm({...form, next_due_date: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none" data-testid="rp-due"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Transaction Context References</label>
            <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="e.g. Bank reference token string or check context hashes..." className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent" data-testid="rp-notes"/>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer group" data-testid="rp-gst-toggle">
            <input type="checkbox" checked={form.apply_gst} onChange={e => setForm({...form, apply_gst: e.target.checked})} className="accent-primary rounded bg-background border-white/10" />
            <span className="group-hover:text-foreground transition-colors">Apply standardized split compliance taxation (CGST 9% + SGST 9%)</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-2" data-testid="rp-submit">
             Authorize Cash Intake State
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}