import { motion } from "framer-motion";
import { Eyebrow } from "@/components/Cinematic";

const EASE = [0.16, 1, 0.3, 1];

/** Universal page hero used by inner pages. Dark luxury, ambient orbs, eyebrow + title. */
export default function PageHero({ eyebrow, title, accent, subtitle, children, align = "left" }) {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="ambient-orb ambient-orb--primary drift" style={{ width: 500, height: 500, top: "-100px", left: "-150px" }} />
      <div className="ambient-orb ambient-orb--accent" style={{ width: 380, height: 380, top: "20%", right: "-100px", opacity: 0.35 }} />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className={`relative max-w-7xl mx-auto px-4 lg:px-8 ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="font-display text-5xl lg:text-7xl xl:text-[88px] font-light tracking-[-0.04em] leading-[0.95] mt-6"
        >
          {title}{accent && <> <span className="font-medium italic text-accent">{accent}</span></>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className={`mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
