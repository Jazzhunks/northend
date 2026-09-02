import { useEffect } from "react";
import Lenis from "lenis";

/** Wraps the app in Lenis smooth-scroll on desktop. Disabled on touch devices. */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch / small screens — native scroll is faster + saves battery
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return children;
}
