import { useEffect, useState } from "react";

/** Hook that returns true on touch / small viewport — used to auto-degrade R3F scenes. */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint || (("ontouchstart" in window) && navigator.maxTouchPoints > 0);
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setIsMobile(mq.matches || (("ontouchstart" in window) && navigator.maxTouchPoints > 0));
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);

  return isMobile;
}

/** Hook that respects user's reduced-motion preference. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
