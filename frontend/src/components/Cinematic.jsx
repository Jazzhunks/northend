import { forwardRef, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

/* -------------------------------------------------------------------------- */
/* CONFIG */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1];

const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 26,
  mass: 0.8,
};

const fadeUp = {
  hidden: (y = 30) => ({
    opacity: 0,
    y,
    filter: "blur(10px)",
  }),

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

/* -------------------------------------------------------------------------- */
/* UTILS */
/* -------------------------------------------------------------------------- */

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* PRIMARY CTA */
/* -------------------------------------------------------------------------- */

export const CTAPrimary = forwardRef(
  (
    {
      children,
      className = "",
      iconRight = true,
      isLoading = false,
      disabled = false,
      size = "md",
      ...rest
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    const sizes = {
      sm: "h-11 px-5 text-[11px]",
      md: "h-14 px-7 text-sm",
      lg: "h-16 px-9 text-base",
    };

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        whileHover={
          reduceMotion
            ? {}
            : {
                y: -2,
                scale: 1.01,
              }
        }
        whileTap={
          reduceMotion
            ? {}
            : {
                scale: 0.98,
              }
        }
        transition={SPRING}
        className={cn(
          "group tracing-beam relative inline-flex items-center justify-center gap-3",
          "overflow-hidden rounded-full",
          "transform-gpu will-change-transform",
          "font-bold uppercase tracking-[0.18em]",
          "bg-primary text-primary-foreground",
          "shadow-[0_10px_40px_rgba(0,47,167,0.35)]",
          "transition-all duration-300",
          "hover:shadow-[0_0_60px_rgba(0,47,167,0.55)]",
          "active:shadow-[0_0_30px_rgba(0,47,167,0.4)]",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          sizes[size],
          className
        )}
        {...rest}
      >
        {/* hover glow */}
        <span
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_65%)]",
            "group-hover:opacity-100"
          )}
        />

        {/* content */}
        <span className="relative z-10 flex items-center gap-3">
          <span>
            {isLoading ? "Loading..." : children}
          </span>

          {iconRight && !isLoading && (
            <motion.span
              className="flex items-center justify-center"
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: [0, 2, 0],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight
                weight="bold"
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.span>
          )}
        </span>
      </motion.button>
    );
  }
);

CTAPrimary.displayName = "CTAPrimary";

/* -------------------------------------------------------------------------- */
/* GHOST CTA */
/* -------------------------------------------------------------------------- */

export const CTAGhost = forwardRef(
  (
    {
      children,
      className = "",
      iconRight = false,
      disabled = false,
      size = "md",
      ...rest
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    const sizes = {
      sm: "h-11 px-5 text-[11px]",
      md: "h-14 px-7 text-sm",
      lg: "h-16 px-9 text-base",
    };

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled}
        whileHover={
          reduceMotion
            ? {}
            : {
                y: -2,
              }
        }
        whileTap={
          reduceMotion
            ? {}
            : {
                scale: 0.98,
              }
        }
        transition={SPRING}
        className={cn(
          "group relative inline-flex items-center justify-center gap-3",
          "overflow-hidden rounded-full",
          "transform-gpu will-change-transform",
          "border border-white/10",
          "bg-white/[0.04]",
          "backdrop-blur-xl",
          "text-foreground",
          "font-bold uppercase tracking-[0.18em]",
          "transition-all duration-300",
          "hover:border-white/20",
          "hover:bg-white/[0.07]",
          "hover:shadow-[0_10px_40px_rgba(255,255,255,0.04)]",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-white/30",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          sizes[size],
          className
        )}
        {...rest}
      >
        <span className="relative z-10 flex items-center gap-3">
          <span>{children}</span>

          {iconRight && (
            <ArrowRight
              weight="bold"
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </span>
      </motion.button>
    );
  }
);

CTAGhost.displayName = "CTAGhost";

/* -------------------------------------------------------------------------- */
/* EYEBROW */
/* -------------------------------------------------------------------------- */

export const Eyebrow = memo(function Eyebrow({
  children,
  className = "",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 10,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.7,
        ease: EASE,
      }}
      className={cn(
        "inline-flex items-center gap-3",
        "text-[11px] font-bold uppercase tracking-[0.28em]",
        "text-accent",
        className
      )}
    >
      <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />

      <span className="text-glow-accent">
        {children}
      </span>
    </motion.div>
  );
});

/* -------------------------------------------------------------------------- */
/* REVEAL */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
  as = "div",
}) {
  const reduceMotion = useReducedMotion();

  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      custom={y}
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.9,
        ease: EASE,
        delay,
      }}
      className={cn(
        "transform-gpu will-change-transform",
        className
      )}
    >
      {children}
    </MotionTag>
  );
}