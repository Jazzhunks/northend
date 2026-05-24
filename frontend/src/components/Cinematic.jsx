import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

/** Primary cinematic CTA — tracing-beam border + arrow that slides on hover. */
export function CTAPrimary({ children, className = "", iconRight = true, ...rest }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group tracing-beam relative inline-flex items-center gap-3 px-7 py-4 rounded-full
                  bg-primary text-primary-foreground font-bold text-sm uppercase tracking-[0.18em]
                  glow-primary hover:shadow-[0_0_50px_rgba(0,47,167,0.6)] transition-shadow ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {iconRight && <ArrowRight weight="bold" size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />}
    </motion.button>
  );
}

/** Secondary ghost CTA — outline + subtle hover */
export function CTAGhost({ children, className = "", iconRight = false, ...rest }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group inline-flex items-center gap-3 px-7 py-4 rounded-full
                  border border-white/15 bg-white/[0.03] backdrop-blur-md
                  hover:bg-white/[0.06] hover:border-white/25
                  text-foreground font-bold text-sm uppercase tracking-[0.18em] transition-all ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {iconRight && <ArrowRight weight="bold" size={16} className="transition-transform group-hover:translate-x-1" />}
    </motion.button>
  );
}

/** Section eyebrow — small uppercase tag */
export function Eyebrow({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`text-xs font-bold uppercase tracking-[0.25em] text-accent flex items-center gap-2 ${className}`}
    >
      <span className="w-8 h-px bg-accent/60" />
      {children}
    </motion.div>
  );
}

/** Animated reveal — wraps children, fades up on scroll into view */
export function Reveal({ children, delay = 0, y = 30, className = "", as: Tag = "div" }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
