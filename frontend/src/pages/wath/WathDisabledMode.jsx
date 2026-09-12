import { Clock } from "@phosphor-icons/react";

export default function WathDisabledMode({ message }) {
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div className="max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-6">
          <Clock size={12}/> Registrations paused
        </div>
        <h1 className="font-display text-4xl lg:text-6xl font-light tracking-[-0.02em] leading-[0.95]">
          WATH is <span className="italic text-accent">taking a breath</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {message || "The next scholarship examination window is being scheduled. Follow us on WhatsApp to be the first to know when registrations open."}
        </p>
      </div>
    </section>
  );
}
