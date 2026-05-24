import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ArrowUpRight } from "@phosphor-icons/react";

/** Hover-tilt glass course card. Touch devices get a flat card without tilt. */
export default function CourseCard3D({ course, onClick }) {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={isMobile ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative cursor-pointer"
      data-testid={`course-card-${course.id}`}
    >
      <div className="glass-elevated rounded-2xl p-6 lg:p-7 h-full transition-shadow hover:shadow-[0_0_50px_rgba(0,47,167,0.35)]">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{course.category}</span>
          {course.featured && (
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-accent text-accent-foreground">★ Featured</span>
          )}
        </div>
        {/* Title */}
        <h3 className="font-display text-2xl lg:text-3xl font-medium tracking-tight leading-[1.05]">
          {course.title}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">{course.description}</p>

        {/* Meta */}
        <div className="mt-6 grid grid-cols-2 gap-3 pt-5 border-t border-white/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Duration</div>
            <div className="font-display font-medium mt-1">{course.duration}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tuition</div>
            <div className="font-display font-medium mt-1 text-accent">₹{course.fee.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-ring" />
            Admissions open
          </div>
          <span className="w-10 h-10 rounded-full grid place-items-center border border-white/10 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all">
            <ArrowUpRight weight="bold" size={16} />
          </span>
        </div>

        {/* Inner glow on hover */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,193,7,0.08), transparent 40%)"
          }} />
      </div>
    </motion.div>
  );
}
