import { useState } from "react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary } from "@/components/Cinematic";
import { api, formatError } from "@/lib/api";
import { Phone, EnvelopeSimple, MapPin, WhatsappLogo } from "@phosphor-icons/react";

export default function Contact() {
  const [f, setF] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/contact", f); setDone(true); toast.success("Inquiry sent!"); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <div data-testid="contact-page">
      <PageHero
        eyebrow="Contact"
        title="Talk to"
        accent="a counsellor."
        subtitle="We respond within a few hours, six days a week. Walk in, call, WhatsApp or email — whichever is easiest."
      />
      <section className="relative pb-24 -mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3">
            {[
              { Icon: Phone, label: "Call us", value: "+91-8766238623", href: "tel:+918766238623" },
              { Icon: EnvelopeSimple, label: "Email", value: "info@northendedu.com", href: "mailto:info@northendedu.com" },
              { Icon: MapPin, label: "Headquarters", value: "I G Road, Parray Pora, Srinagar, J&K 190005" },
              { Icon: WhatsappLogo, label: "WhatsApp", value: "Chat with a counsellor", href: "https://wa.me/917006149481" },
            ].map((c, i) => (
              <a key={i} href={c.href} target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
                <GlassPanel className="p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:border-accent/30">
                  <div className="h-12 w-12 grid place-items-center rounded-xl glass-elevated">
                    <c.Icon weight="duotone" size={22} className="text-accent"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">{c.label}</div>
                    <div className="text-sm mt-1 truncate">{c.value}</div>
                  </div>
                </GlassPanel>
              </a>
            ))}
          </div>
          <div className="lg:col-span-7">
            {done ? (
              <GlassPanel elevated className="p-10" data-testid="contact-success">
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Message received</div>
                <h3 className="font-display text-3xl font-medium mt-3">We'll be in touch.</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">A Northend counsellor will reach out within 24 hours. For urgent admissions, use WhatsApp.</p>
              </GlassPanel>
            ) : (
              <GlassPanel elevated className="p-7" as="form" onSubmit={submit}>
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Name" value={f.name} onChange={e=>setF({...f, name: e.target.value})} required data-testid="contact-name"/>
                    <input className={inputCls} type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f, email: e.target.value})} required data-testid="contact-email"/>
                    <input className={inputCls} placeholder="Phone (optional)" value={f.phone} onChange={e=>setF({...f, phone: e.target.value})} data-testid="contact-phone"/>
                    <input className={inputCls} placeholder="Subject" value={f.subject} onChange={e=>setF({...f, subject: e.target.value})} required data-testid="contact-subject"/>
                  </div>
                  <textarea className={`${inputCls} min-h-36`} placeholder="Your message" value={f.message} onChange={e=>setF({...f, message: e.target.value})} required data-testid="contact-msg"/>
                </div>
                <div className="mt-5">
                  <CTAPrimary type="submit" className="w-full justify-center" data-testid="contact-submit">Send message</CTAPrimary>
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
