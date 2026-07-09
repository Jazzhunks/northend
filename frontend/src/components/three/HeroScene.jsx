import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function HeroScene({ className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`
        absolute inset-0 overflow-hidden isolate pointer-events-none
        gpu
        ${className}
      `}
      aria-hidden="true"
    >
      {/* ---------------------------------------------------------------- */}
      {/* ATMOSPHERIC LIGHTING */}
      {/* ---------------------------------------------------------------- */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,47,167,0.18),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,193,7,0.10),transparent_28%)]" />

      {/* ---------------------------------------------------------------- */}
      {/* GRID + DOT DEPTH */}
      {/* ---------------------------------------------------------------- */}

      <div className="absolute inset-0 bg-grid opacity-[0.14]" />

      <motion.div
        animate={
          reduceMotion
            ? false
            : {
                opacity: [0.04, 0.12, 0.04],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-dot mix-blend-screen"
      />

      {/* ---------------------------------------------------------------- */}
      {/* ORBS */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        animate={
          reduceMotion
            ? false
            : {
                x: [0, 50, 0],
                y: [0, -35, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="ambient-orb ambient-orb--primary absolute"
        style={{
          width: 720,
          height: 720,
          top: "-12%",
          left: "-4%",
          opacity: 0.55,
        }}
      />

      <motion.div
        animate={
          reduceMotion
            ? false
            : {
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 1.12, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="ambient-orb ambient-orb--accent absolute"
        style={{
          width: 520,
          height: 520,
          top: "14%",
          right: "-6%",
          opacity: 0.45,
        }}
      />

      <motion.div
        animate={
          reduceMotion
            ? false
            : {
                x: [0, 25, 0],
                y: [0, -25, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="ambient-orb ambient-orb--primary absolute"
        style={{
          width: 380,
          height: 380,
          bottom: "-4%",
          left: "28%",
          opacity: 0.25,
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* KNOWLEDGE CORE */}
      {/* ---------------------------------------------------------------- */}

      <div className="absolute right-[5%] top-1/2 hidden lg:block -translate-y-1/2">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: EASE,
          }}
          className="relative w-[540px] h-[540px]"
        >
          {/* SOFT GLOW */}
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

          {/* OUTER RING */}
          <motion.div
            animate={reduceMotion ? false : { rotate: 360 }}
            transition={{
              duration: 70,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border border-primary/20"
          />

          {/* MIDDLE RING */}
          <motion.div
            animate={reduceMotion ? false : { rotate: -360 }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-8 rounded-full border border-accent/30"
          />

          {/* INNER RING */}
          <motion.div
            animate={reduceMotion ? false : { rotate: 360 }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-16 rounded-full border border-primary/25"
          />

          {/* PULSE */}
          <motion.div
            animate={
              reduceMotion
                ? false
                : {
                    scale: [1, 1.18, 1],
                    opacity: [0.2, 0.45, 0.2],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-24 rounded-full border border-accent/20"
          />

          {/* CORE GLOW */}
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

          {/* CORE */}
          <motion.div
            animate={
              reduceMotion
                ? false
                : {
                    scale: [1, 1.08, 1],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-accent glow-accent"
          />

          {/* TRACKER DOT */}
          {!reduceMotion && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rounded-full bg-accent glow-accent" />
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-8"
              >
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-primary glow-primary" />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FLOATING PARTICLES */}
      {/* ---------------------------------------------------------------- */}

      {!reduceMotion &&
        Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 7 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute rounded-full bg-white/20"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${6 + i * 6}%`,
              top: `${50 + (i % 5) * 8}%`,
              filter: "blur(1px)",
            }}
          />
        ))}

      {/* ---------------------------------------------------------------- */}
      {/* NOISE TEXTURE */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='64' cy='42' r='1'/%3E%3Ccircle cx='102' cy='96' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* VIGNETTE */}
      {/* ---------------------------------------------------------------- */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,6,23,0.55))]" />

      {/* ---------------------------------------------------------------- */}
      {/* BOTTOM FADE */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(var(--background)))",
        }}
      />
    </div>
  );
}

export default memo(HeroScene);

export function HeroSceneFallback() {
  return <HeroScene />;
}