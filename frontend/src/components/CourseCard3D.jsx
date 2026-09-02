import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  memo,
  useCallback,
  useRef,
  useState,
} from "react";

import { ArrowUpRight } from "@phosphor-icons/react";
import { useIsMobile } from "@/hooks/useIsMobile";

/* -------------------------------------------------------------------------- */
/* CONFIG */
/* -------------------------------------------------------------------------- */

const CARD_SPRING = {
  stiffness: 160,
  damping: 18,
  mass: 0.7,
};

const HOVER_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 24,
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

function CourseCard3D({
  course,
  onClick,
  className = "",
}) {
  const ref = useRef(null);

  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const disableMotion = isMobile || reduceMotion;

  const [isHovering, setIsHovering] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* MOTION VALUES */
  /* ---------------------------------------------------------------------- */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, CARD_SPRING);
  const smoothMouseY = useSpring(mouseY, CARD_SPRING);

  const rotateX = useSpring(
    useTransform(smoothMouseY, [-0.5, 0.5], [11, -11]),
    CARD_SPRING
  );

  const rotateY = useSpring(
    useTransform(smoothMouseX, [-0.5, 0.5], [-11, 11]),
    CARD_SPRING
  );

  const glowX = useTransform(
    smoothMouseX,
    [-0.5, 0.5],
    ["0%", "100%"]
  );

  const glowY = useTransform(
    smoothMouseY,
    [-0.5, 0.5],
    ["0%", "100%"]
  );

  const glowOpacity = useTransform(
    smoothMouseY,
    [-0.5, 0, 0.5],
    [0.25, 0.45, 0.25]
  );

  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(
        600px circle at ${x} ${y},
        rgba(255,255,255,0.14),
        transparent 38%
      )`
  );

  /* ---------------------------------------------------------------------- */
  /* HANDLERS */
  /* ---------------------------------------------------------------------- */

  const handleMove = useCallback(
    (e) => {
      if (disableMotion || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) / rect.width - 0.5;

      const y =
        (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.set(x);
      mouseY.set(y);
    },
    [disableMotion, mouseX, mouseY]
  );

  const handleLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);

    setIsHovering(false);
  }, [mouseX, mouseY]);

  const handleEnter = () => {
    setIsHovering(true);
  };

  /* ---------------------------------------------------------------------- */
  /* ACCESSIBILITY */
  /* ---------------------------------------------------------------------- */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  /* ---------------------------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------------------------- */

  return (
    <motion.article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title} course`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={
        disableMotion
          ? {}
          : {
              rotateX,
              rotateY,
              transformPerspective: 1800,
              transformStyle: "preserve-3d",
            }
      }
      whileHover={
        disableMotion
          ? {}
          : {
              y: -10,
              scale: 1.01,
            }
      }
      whileTap={
        disableMotion
          ? {}
          : {
              scale: 0.985,
            }
      }
      transition={HOVER_SPRING}
      className={cn(
        "group relative cursor-pointer outline-none",
        "transform-gpu will-change-transform",
        className
      )}
      data-testid={`course-card-${course.id}`}
    >
      {/* OUTER CINEMATIC GLOW */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-[1.6rem]",
          "opacity-0 blur-2xl",
          "transition-all duration-700",
          "group-hover:opacity-100",
          "bg-gradient-to-br",
          "from-primary/40 via-accent/20 to-primary/30"
        )}
      />

      {/* CARD */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.6rem]",
          "glass-ultra",
          "border border-border",
          "bg-muted/30",
          "p-6 lg:p-7",
          "transition-all duration-500",
          "hover:border-border",
          "hover:shadow-[0_20px_80px_rgba(0,47,167,0.22)]",
          "focus-visible:ring-2",
          "focus-visible:ring-primary",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background"
        )}
      >
        {/* BORDER LIGHT */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[1.6rem]",
            "opacity-0 transition-opacity duration-500",
            "group-hover:opacity-100"
          )}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />

        {/* NOISE TEXTURE */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        {/* DYNAMIC LIGHT */}
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0",
            disableMotion && "hidden"
          )}
          style={{
            opacity: glowOpacity,
            background: glowBackground,
          }}
        />

        {/* TOP */}
        <div
          className="relative z-10 mb-6 flex items-center justify-between"
          style={{
            transform: disableMotion
              ? undefined
              : "translateZ(50px)",
          }}
        >
          <span
            className={cn(
              "text-[10px] font-bold uppercase",
              "tracking-[0.24em] text-accent"
            )}
          >
            {course.category}
          </span>

          {course.featured && (
            <span
              className={cn(
                "rounded-full px-3 py-1",
                "bg-accent/95 text-accent-foreground",
                "text-[10px] font-bold uppercase",
                "tracking-[0.18em]",
                "shadow-lg shadow-accent/25"
              )}
            >
              Featured
            </span>
          )}
        </div>

        {/* TITLE */}
        <div
          className="relative z-10"
          style={{
            transform: disableMotion
              ? undefined
              : "translateZ(75px)",
          }}
        >
          <h3
            className={cn(
              "font-display text-2xl lg:text-[2rem]",
              "leading-[1.02] tracking-[-0.04em]",
              "font-semibold"
            )}
          >
            {course.title}
          </h3>

          <p
            className={cn(
              "mt-4 line-clamp-2",
              "text-sm leading-relaxed",
              "text-muted-foreground"
            )}
          >
            {course.description}
          </p>
        </div>

        {/* META */}
        <div
          className={cn(
            "relative z-10 mt-7 grid grid-cols-2 gap-4",
            "border-t border-border pt-5"
          )}
          style={{
            transform: disableMotion
              ? undefined
              : "translateZ(60px)",
          }}
        >
          <div>
            <div
              className={cn(
                "text-[10px] uppercase tracking-[0.18em]",
                "text-muted-foreground"
              )}
            >
              Duration
            </div>

            <div className="mt-1.5 font-display text-base font-medium">
              {course.duration}
            </div>
          </div>

          <div className="text-right">
            <div
              className={cn(
                "text-[10px] uppercase tracking-[0.18em]",
                "text-muted-foreground"
              )}
            >
              Tuition
            </div>

            <div
              className={cn(
                "mt-1.5 font-display text-lg font-bold",
                 "text-foreground"
              )}
            >
              ₹{course.fee.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="relative z-10 mt-7 flex items-center justify-between"
          style={{
            transform: disableMotion
              ? undefined
              : "translateZ(90px)",
          }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,193,7,0.7)]" />
            </span>

            Admissions open
          </div>

          <motion.span
            animate={
              isHovering && !disableMotion
                ? {
                    rotate: 45,
                  }
                : {
                    rotate: 0,
                  }
            }
            transition={HOVER_SPRING}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full",
              "border border-border",
              "bg-muted/40",
              "backdrop-blur-md",
              "transition-all duration-300",
              "group-hover:border-accent",
              "group-hover:bg-accent",
              "group-hover:text-accent-foreground",
              "group-hover:shadow-[0_0_30px_rgba(255,193,7,0.35)]"
            )}
          >
            <ArrowUpRight
              weight="bold"
              size={18}
            />
          </motion.span>
        </div>

        {/* PREMIUM SHINE */}
        <motion.div
          animate={
            isHovering && !disableMotion
              ? {
                  x: ["-120%", "140%"],
                }
              : {}
          }
          transition={{
            duration: 1.4,
            ease: "easeInOut",
          }}
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0",
            "w-[30%] rotate-12",
            "bg-gradient-to-r",
            "from-transparent via-white/10 to-transparent",
            "blur-xl"
          )}
        />
      </div>
    </motion.article>
  );
}

export default memo(CourseCard3D);