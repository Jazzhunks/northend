import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Eyebrow, Reveal, CTAPrimary } from "@/components/Cinematic";
import { AnimatedCounter } from "@/components/Metrics";
import {
  Target, Eye, Users, GraduationCap, Compass, Lightning, Trophy
} from "@phosphor-icons/react";

export default function About() {
  return (
    <div data-testid="about-page">
      <PageHero
        eyebrow="About Northend"
        title="A franchise born from one promise —"
        accent="bring India's best teachers to Kashmir."
        subtitle="Northend Educational World is the authorised Unacademy partner for the Kashmir region. We operate Five centres across the valley and equip thousands of students every year to compete on the national stage."
      />

      {/* Mission / Vision / Philosophy */}
      <section className="relative section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid md:grid-cols-3 gap-5">
          {[
            { Icon: Target, t: "Mission", d: "Make national-grade competitive coaching universally accessible to every Kashmiri student — regardless of locality or income." },
            { Icon: Eye, t: "Vision", d: "Become the most trusted educational ecosystem in J&K with a track record of measurable outcomes — selections, scholarships, careers." },
            { Icon: Users, t: "Philosophy", d: "Small batches. Daily mentoring. Honest weekly assessments. No shortcuts. No empty promises." },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.08}>
              <GlassPanel className="p-8 h-full">
                <x.Icon weight="duotone" size={30} className="text-accent mb-5" />
                <h3 className="font-display text-2xl font-medium">{x.t}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{x.d}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline — scroll storytelling */}
      <section className="relative section">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Eyebrow className="justify-center">Our journey</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
                Four years.<br/><span className="font-medium italic text-accent">One mission.</span>
              </h2>
            </Reveal>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
            {[
              { y: "2022", t: "Founded in Srinagar", d: "A tiny classroom. A big idea. Northend opens its first centre at Lal Chowk with 12 students." },
              { y: "2023", t: "Unacademy partnership", d: "Became an authorised Unacademy franchise — bringing national-grade curriculum and educators." },
              { y: "2025", t: "Expanded to 3 centres", d: "Anantnag and Sopore centres launched. Pass rate hits 86% for NEET aspirants." },
              { y: "2026", t: "Four centres, one valley", d: "Soura, Zakura and Parraypora join the network. ERP platform launches for transparent fee + attendance tracking." },
            ].map((s, i) => (
              <Reveal key={s.y} delay={i * 0.1}>
                <div className={`relative grid md:grid-cols-2 gap-8 mb-16 ${i % 2 ? "" : "md:[&>*:first-child]:order-2"}`}>
                  <div className={`md:text-${i % 2 ? "right" : "left"}`}>
                    <GlassPanel className="p-7">
                      <div className="font-mono text-xs text-accent">{s.y}</div>
                      <h3 className="font-display text-2xl font-medium mt-1">{s.t}</h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.d}</p>
                    </GlassPanel>
                  </div>
                  <div className="hidden md:block" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-8 w-3 h-3 rounded-full bg-accent glow-accent" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-y border-border">
        <div className="absolute inset-0 bg-dot opacity-30" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { n: 1323, s: "+", l: "Students trained" },
            { n: 100,  s: "+", l: "AIRs in NEET/JEE" },
            { n: 52,   s: "+", l: "Master educators" },
            { n: 6,    s: "",  l: "Centres" },
          ].map((x, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="text-center">
                <div className="font-display text-5xl lg:text-6xl font-medium text-accent">
                  <AnimatedCounter value={x.n} suffix={x.s}/>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">{x.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative section">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight">
              Ready to be part of the<br/><span className="font-medium italic text-accent">next chapter?</span>
            </h2>
            <div className="mt-10">
              <Link to="/enroll"><CTAPrimary data-testid="about-cta-btn">Enrol with Northend</CTAPrimary></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
