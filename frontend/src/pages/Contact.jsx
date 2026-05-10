import { useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  const [f, setF] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/contact", f); setDone(true); toast.success("Inquiry sent!"); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="contact-page">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Contact</div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">Talk to a counselor.</h1>
          <p className="mt-4 text-muted-foreground">We respond within a few hours, six days a week.</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><div className="h-10 w-10 grid place-items-center bg-primary/10 text-primary rounded-md"><Phone size={18}/></div>+91-9876500001</div>
            <div className="flex items-center gap-3"><div className="h-10 w-10 grid place-items-center bg-primary/10 text-primary rounded-md"><Mail size={18}/></div>hello@northend.edu</div>
            <div className="flex items-center gap-3"><div className="h-10 w-10 grid place-items-center bg-primary/10 text-primary rounded-md"><MapPin size={18}/></div>Lal Chowk, Srinagar, J&K</div>
            <a href="https://wa.me/919876500001" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><div className="h-10 w-10 grid place-items-center bg-[#25D366]/10 text-[#25D366] rounded-md"><MessageCircle size={18}/></div>Chat on WhatsApp</a>
          </div>
        </div>
        <div className="lg:col-span-7">
          {done ? (
            <div className="border border-primary p-8 rounded-md bg-primary/5" data-testid="contact-success">
              <h3 className="font-display text-2xl font-black">Message received.</h3>
              <p className="text-sm text-muted-foreground mt-2">A counselor will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-border p-8 rounded-md space-y-3 bg-background">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Name" value={f.name} onChange={e=>setF({...f, name: e.target.value})} required data-testid="contact-name"/>
                <Input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f, email: e.target.value})} required data-testid="contact-email"/>
                <Input placeholder="Phone (optional)" value={f.phone} onChange={e=>setF({...f, phone: e.target.value})} data-testid="contact-phone"/>
                <Input placeholder="Subject" value={f.subject} onChange={e=>setF({...f, subject: e.target.value})} required data-testid="contact-subject"/>
              </div>
              <textarea className="w-full border border-border rounded-md px-3 py-2 bg-background min-h-32" placeholder="Your message" value={f.message} onChange={e=>setF({...f, message: e.target.value})} required data-testid="contact-msg"/>
              <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" data-testid="contact-submit">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
