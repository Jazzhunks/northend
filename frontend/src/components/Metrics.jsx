import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/** Animated number that counts up from 0 → target when scrolled into view */
export function AnimatedCounter({ value = 100, suffix = "", duration = 1.8, prefix = "", testid }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} data-testid={testid}>{prefix}{n.toLocaleString("en-IN")}{suffix}</span>
  );
}

/** Circular SVG progress ring — for student dashboard widgets */
export function OrbitalProgress({ value = 75, size = 120, stroke = 8, label, sublabel, accent = "#FFC107" }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="transparent" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          stroke={accent} strokeWidth={stroke} fill="transparent"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-medium">{value}<span className="text-base text-muted-foreground">%</span></div>
          {label && <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>}
          {sublabel && <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
