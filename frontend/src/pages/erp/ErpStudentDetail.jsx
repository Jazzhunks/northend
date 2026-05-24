import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, fmtINR, fmtDate } from "@/lib/erpApi";
import { api, API_BASE } from "@/lib/api";
import { ArrowLeft, Plus, FileDown, Receipt as ReceiptIcon } from "lucide-react";

export default function ErpStudentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { erpUser } = useOutletContext();
  const [stmt, setStmt] = useState(null);
  const [course, setCourse] = useState(null);
  const [showPay, setShowPay] = useState(false);

  const reload = () => erp.studentStatement(id).then(setStmt).catch(e => toast.error(e.response?.data?.detail || "Failed"));

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [id]);
  useEffect(() => {
    if (stmt?.student?.course_id) api.get(`/courses/${stmt.student.course_id}`).then(r => setCourse(r.data)).catch(()=>{});
  }, [stmt?.student?.course_id]);

  if (!stmt) return <div className="text-muted-foreground">Loading…</div>;
  const s = stmt.student;
  const canRecordPayment = erpUser.role !== "counsellor";

  return (
    <div className="space-y-6" data-testid="erp-student-detail">
      <button onClick={() => nav("/erp/students")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" data-testid="back-to-students">
        <ArrowLeft size={14}/>Back to students
      </button>

      <div className="bg-background border border-border rounded-md p-6">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">{s.student_no}</div>
            <h1 className="font-display text-3xl font-black mt-1">{s.full_name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{course?.title} · Batch {s.batch || "—"} · Admitted {fmtDate(s.admission_date)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${s.status==="active"?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-700"}`} data-testid="student-status">{s.status}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <Field label="Phone" v={s.contact_phone}/>
          <Field label="Email" v={s.contact_email}/>
          <Field label="Parent" v={s.parent_name}/>
          <Field label="Parent phone" v={s.parent_phone}/>
        </div>
        {s.address && <div className="mt-3 text-sm text-muted-foreground">📍 {s.address}</div>}
      </div>

      {/* Ledger summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Total fee" value={fmtINR(stmt.total_fee)}/>
        <Stat label="Scholarship" value={`${stmt.scholarship_percent}%`} sub={fmtINR(stmt.scholarship_amount)}/>
        <Stat label="Discount" value={fmtINR(stmt.discount)}/>
        <Stat label="Net payable" value={fmtINR(stmt.net_fee)} accent="text-primary"/>
        <Stat label="Pending" value={fmtINR(stmt.pending)} accent={stmt.pending > 0 ? "text-rose-600" : "text-emerald-600"} testid="pending-amount"/>
      </div>

      {/* Payments / receipts */}
      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-display font-bold text-lg">Payment history</h3>
          {canRecordPayment && (
            <button onClick={() => setShowPay(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2" data-testid="record-payment-btn">
              <Plus size={14}/>Record payment
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Receipt</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Mode</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">Base</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">CGST</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">SGST</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {stmt.payments.map(p => (
                <tr key={p.id} className="border-t border-border" data-testid={`payment-row-${p.id}`}>
                  <td className="px-5 py-3 font-mono text-xs">{p.receipt_no}</td>
                  <td className="px-5 py-3 text-xs">{fmtDate(p.paid_at)}</td>
                  <td className="px-5 py-3 text-xs uppercase">{p.mode}</td>
                  <td className="px-5 py-3 font-mono text-right text-xs">{fmtINR(p.base_amount)}</td>
                  <td className="px-5 py-3 font-mono text-right text-xs">{fmtINR(p.cgst)}</td>
                  <td className="px-5 py-3 font-mono text-right text-xs">{fmtINR(p.sgst)}</td>
                  <td className="px-5 py-3 font-mono text-right font-bold">{fmtINR(p.amount)}</td>
                  <td className="px-5 py-3">
                    <a href={`${API_BASE}/erp/payments/${p.id}/receipt`} target="_blank" rel="noreferrer" className="text-primary text-xs font-bold underline" data-testid={`download-receipt-${p.id}`}>
                      <FileDown size={12} className="inline"/> PDF
                    </a>
                  </td>
                </tr>
              ))}
              {stmt.payments.length === 0 && (
                <tr><td colSpan="8" className="px-5 py-12 text-center text-muted-foreground"><ReceiptIcon size={28} className="mx-auto mb-2 opacity-40"/>No payments recorded yet.</td></tr>
              )}
            </tbody>
            {stmt.payments.length > 0 && (
              <tfoot className="bg-secondary/40 font-bold">
                <tr className="border-t-2 border-border">
                  <td colSpan="6" className="px-5 py-3 text-right">Total paid</td>
                  <td className="px-5 py-3 font-mono text-right">{fmtINR(stmt.total_paid)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {showPay && (
        <RecordPaymentModal
          studentId={s.id}
          pending={stmt.pending}
          onClose={() => setShowPay(false)}
          onCreated={() => { setShowPay(false); reload(); toast.success("Payment recorded"); }}
        />
      )}
    </div>
  );
}

function Field({ label, v }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm mt-0.5 font-medium">{v || "—"}</div>
    </div>
  );
}

function Stat({ label, value, sub, accent, testid }) {
  return (
    <div className="bg-background border border-border rounded-md p-4" data-testid={testid}>
      <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
      <div className={`font-display text-2xl font-black mt-1 ${accent || ""}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function RecordPaymentModal({ studentId, pending, onClose, onCreated }) {
  const [form, setForm] = useState({ amount: "", mode: "cash", next_due_date: "", notes: "", apply_gst: true });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await erp.createPayment({
        student_id: studentId,
        amount: Number(form.amount),
        mode: form.mode,
        apply_gst: form.apply_gst,
        next_due_date: form.next_due_date || null,
        notes: form.notes || null,
      });
      onCreated();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose} data-testid="record-payment-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-md max-w-md w-full p-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Fee collection</div>
          <h3 className="font-display text-2xl font-black mt-1">Record a payment</h3>
          <p className="text-sm text-muted-foreground mt-1">Pending balance: <b>{fmtINR(pending)}</b></p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Amount (incl. GST) *</label>
          <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="rp-amount"/>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Mode *</label>
          <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="rp-mode">
            {["cash","upi","online","cheque","card"].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Next instalment due (optional)</label>
          <input type="date" value={form.next_due_date} onChange={e => setForm({...form, next_due_date: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="rp-due"/>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Notes</label>
          <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="rp-notes"/>
        </div>
        <label className="flex items-center gap-2 text-sm" data-testid="rp-gst-toggle">
          <input type="checkbox" checked={form.apply_gst} onChange={e => setForm({...form, apply_gst: e.target.checked})}/>
          Apply CGST 9% + SGST 9% (recommended)
        </label>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50" data-testid="rp-submit">{busy ? "Saving…" : "Record payment"}</button>
      </form>
    </div>
  );
}
