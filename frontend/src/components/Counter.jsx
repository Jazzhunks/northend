import { useEffect, useRef, useState } from "react";

export default function Counter({ end, suffix = "+", duration = 1600, testId }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
      else setVal(end);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!end) return;
    // Always set final value as fallback so UI never shows 0 if observer misses
    const fallback = setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setVal(end);
      }
    }, 1200);

    const el = ref.current;
    if (!el) return () => clearTimeout(fallback);

    // If element is already visible, start immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      clearTimeout(fallback);
      start();
      return;
    }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        clearTimeout(fallback);
        start();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(fallback); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  return <span ref={ref} data-testid={testId}>{val.toLocaleString()}{suffix}</span>;
}
