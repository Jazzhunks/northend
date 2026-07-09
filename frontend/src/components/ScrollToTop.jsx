import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let raf1;
    let raf2;
    let timeout;

    const scroll = () => {
      // HASH SUPPORT (#section)
      if (hash) {
        const element = document.querySelector(hash);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          return;
        }
      }

      // FORCE HARD RESET
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // LENIS SUPPORT
      if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(0, {
          immediate: true,
          force: true,
        });
      }
    };

    // IMMEDIATE
    scroll();

    // NEXT FRAME
    raf1 = requestAnimationFrame(() => {
      scroll();

      // DOUBLE FRAME FIX (Safari + heavy pages)
      raf2 = requestAnimationFrame(() => {
        scroll();
      });
    });

    // FINAL FALLBACK
    timeout = setTimeout(() => {
      scroll();
    }, 120);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, [pathname, hash]);

  return null;
}