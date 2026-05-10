// Reusable section header
export function SectionHeader({ overline, title, subtitle, align = "left" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-12`}>
      {overline && <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-3">{overline}</div>}
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight font-black leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
}
