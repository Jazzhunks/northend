import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import {
  CheckCircle,
  Clock,
  Users,
  Trophy,
  Sparkle,
} from "@phosphor-icons/react";

import { api } from "@/lib/api";

import GlassPanel from "@/components/GlassPanel";

import {
  CTAPrimary,
  CTAGhost,
  Eyebrow,
  Reveal,
} from "@/components/Cinematic";

/* -------------------------------------------------------------------------- */
/* CONFIG */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const shouldReduceMotion = useReducedMotion();

  /* ---------------------------------------------------------------------- */
  /* FETCH */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function loadCourse() {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${id}`);

        if (mounted) {
          setCourse(response.data);
        }
      } catch {
        if (mounted) {
          setCourse(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* MEMOS */
  /* ---------------------------------------------------------------------- */

  const formattedFee = useMemo(() => {
    if (!course?.fee) return "";
    return `₹${course.fee.toLocaleString("en-IN")}`;
  }, [course]);

  /* ---------------------------------------------------------------------- */
  /* STATES */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div
        className="min-h-screen grid place-items-center"
        data-testid="course-loading"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm tracking-wide text-muted-foreground">
            Loading course experience...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="min-h-screen grid place-items-center px-4"
        data-testid="course-not-found"
      >
        <GlassPanel className="max-w-lg p-10 text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="font-display text-3xl font-medium">
            Course not found
          </h2>
          <p className="mt-3 text-muted-foreground">
            The course you are looking for may have been removed or updated.
          </p>
          <Link to="/courses">
            <CTAPrimary className="mt-7">
              Explore Courses
            </CTAPrimary>
          </Link>
        </GlassPanel>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      className="relative overflow-hidden"
      data-testid="course-detail"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.16]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative container-luxury pt-24 lg:pt-32 pb-24"
      >
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* ================================================================ */}
          {/* LEFT */}
          {/* ================================================================ */}

          <div className="lg:col-span-7 space-y-6">
            <motion.div variants={fadeUp}>
              <Eyebrow>
                <span className="flex items-center gap-2">
                  <Sparkle
                    weight="fill"
                    size={12}
                    className="text-accent"
                  />
                  {course.category}
                </span>
              </Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="
                font-display
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-medium
                tracking-[-0.03em]
                leading-[1.05]
              "
            >
              {course.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="
                text-base
                sm:text-lg
                leading-relaxed
                text-muted-foreground
              "
            >
              {course.description}
            </motion.p>

            {/* -------------------------------------------------------------- */}
            {/* HERO IMAGE */}
            {/* -------------------------------------------------------------- */}

            {course.image_url && (
              <motion.div variants={fadeUp} className="pt-2">
                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border border-border
                    glass-elevated
                    aspect-[16/9]
                  "
                >
                  <img
                    src={course.image_url}
                    alt={course.title}
                    loading="lazy"
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-[1.03]
                    "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SYLLABUS */}
            {/* -------------------------------------------------------------- */}

            <Reveal className="pt-8">
              <Eyebrow>Syllabus Overview</Eyebrow>

              <div className="mt-4">
                <h2 className="font-display text-2xl lg:text-3xl font-medium tracking-tight">
                  What you'll master
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Structured modules designed to build strong conceptual
                  understanding and competitive exam readiness.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {course.syllabus?.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 16 }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? {}
                        : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border border-border
                      bg-muted/30
                      p-4
                    "
                  >
                    <CheckCircle
                      weight="duotone"
                      size={20}
                      className="text-accent flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm leading-relaxed">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* -------------------------------------------------------------- */}
            {/* FEATURES */}
            {/* -------------------------------------------------------------- */}

            {!!course.features?.length && (
              <Reveal className="pt-8">
                <Eyebrow>Premium Benefits</Eyebrow>

                <div className="mt-4">
                  <h2 className="font-display text-2xl lg:text-3xl font-medium tracking-tight">
                    What you get
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-6">
                  {course.features.map((feature) => (
                    <motion.div
                      whileHover={{ y: -2 }}
                      key={feature}
                      className="
                        px-4
                        py-2.5
                        rounded-full
                        glass
                        border border-border
                        text-sm
                        font-medium
                      "
                    >
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* -------------------------------------------------------------- */}
            {/* FACULTY */}
            {/* -------------------------------------------------------------- */}

            {!!course.faculty?.length && (
              <Reveal className="pt-8">
                <Eyebrow>Faculty & Mentors</Eyebrow>

                <div className="mt-4">
                  <h2 className="font-display text-2xl lg:text-3xl font-medium tracking-tight">
                    Learn from expert educators
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-6">
                  {course.faculty.map((faculty) => (
                    <motion.div
                      whileHover={{
                        y: -2,
                        borderColor: "rgba(255,255,255,0.2)",
                      }}
                      key={faculty}
                      className="
                        px-4
                        py-2.5
                        rounded-full
                        border border-border
                        bg-muted/30
                        text-sm
                      "
                    >
                      {faculty}
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ================================================================ */}
          {/* RIGHT */}
          {/* ================================================================ */}

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <motion.div variants={fadeUp}>
                <GlassPanel
                  elevated
                  className="
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    p-6
                    lg:p-8
                  "
                >
                  {/* CARD LIGHT */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      opacity-40
                    "
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(0,47,167,0.35), transparent 40%)",
                    }}
                  />

                  {/* TOP */}
                  <div className="relative z-10">
                    <div
                      className="
                        text-[11px]
                        uppercase
                        tracking-[0.28em]
                        font-bold
                        text-accent
                      "
                    >
                      Programme Fee
                    </div>

                    <div
                      className="
                        mt-2
                        font-display
                        text-5xl
                        lg:text-6xl
                        font-medium
                        tracking-[-0.04em]
                        text-accent
                        text-glow-accent
                      "
                    >
                      {formattedFee}
                    </div>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Inclusive of study material, tests, digital
                      resources, and premium academic support.
                    </p>
                  </div>

                  {/* STATS */}
                  <div
                    className="
                      relative z-10
                      mt-6
                      border-t border-border
                      pt-6
                      space-y-4
                    "
                  >
                    <InfoRow
                      Icon={Clock}
                      label="Duration"
                      value={course.duration}
                    />
                    <InfoRow
                      Icon={Users}
                      label="Mentors"
                      value={`${course.faculty?.length || 0}+`}
                    />
                    <InfoRow
                      Icon={Trophy}
                      label="Scholarship"
                      value={
                        course.scholarship_available
                          ? "Available"
                          : "Not available"
                      }
                    />
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 mt-7 space-y-3">
                    <Link
                      to={`/enroll?course=${course.id}`}
                      className="block"
                    >
                      <CTAPrimary
                        className="
                          w-full
                          justify-center
                          h-14
                          text-sm
                          tracking-[0.2em]
                        "
                        data-testid="enroll-btn"
                      >
                        Enrol Now
                      </CTAPrimary>
                    </Link>

                    <Link to="/contact" className="block">
                      <CTAGhost
                        className="
                          w-full
                          justify-center
                          h-14
                          text-sm
                          tracking-[0.16em]
                        "
                        iconRight={false}
                        data-testid="demo-btn"
                      >
                        Book Demo Class
                      </CTAGhost>
                    </Link>
                  </div>

                  {/* TRUST */}
                  <div
                    className="
                      relative z-10
                      mt-5
                      flex items-center justify-center
                      gap-2
                      text-xs
                      text-muted-foreground
                    "
                  >
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Limited seats available for this batch
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* INFO ROW */
/* -------------------------------------------------------------------------- */

function InfoRow({ Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="
            w-10
            h-10
            rounded-full
            grid
            place-items-center
            border border-border
            bg-muted/40
          "
        >
          <Icon
            weight="duotone"
            size={18}
            className="text-accent"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="text-sm font-medium text-right">
        {value}
      </span>
    </div>
  );
}