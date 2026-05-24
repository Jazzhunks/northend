import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, CTAGhost, Eyebrow, Reveal } from "@/components/Cinematic";
import { CheckCircle, Clock, Users, Trophy } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

export default function CourseDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);

  useEffect(() => { api.get(`/courses/${id}`).then(r => setC(r.data)).catch(()=>setC(false)); }, [id]);

  if (c === null) return <div className="p-20 text-center text-muted-foreground">Loading…</div>;
  if (!c) return <div className="p-20 text-center">Course not found.</div>;

  return (
    <div className="relative" data-testid="course-detail">
      <div className="ambient-orb ambient-orb--primary drift" style={{ width: 500, height: 500, top: "-100px", left: "-100px" }} />
      <div className="ambient-orb ambient-orb--accent" style={{ width: 380, height: 380, top: "30%", right: "-100px", opacity: 0.3 }} />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>{c.category}</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="font-display text-5xl lg:text-7xl font-light tracking-[-0.04em] leading-[0.98] mt-4"
            >
              {c.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {c.description}
            </motion.p>

            {c.image_url && (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
                className="mt-10 rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] glass-elevated">
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover"/>
              </motion.div>
            )}

            <Reveal>
              <div className="mt-12">
                <Eyebrow>Syllabus</Eyebrow>
                <h3 className="font-display text-3xl font-light tracking-tight mt-3">What you'll master</h3>
                <ul className="grid sm:grid-cols-2 gap-3 mt-6">
                  {c.syllabus.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <CheckCircle weight="duotone" size={18} className="text-accent flex-shrink-0"/>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {c.features?.length > 0 && (
              <Reveal>
                <div className="mt-12">
                  <Eyebrow>What you get</Eyebrow>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {c.features.map(f => <span key={f} className="px-4 py-2 glass rounded-full text-sm">{f}</span>)}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal>
              <div className="mt-12">
                <Eyebrow>Faculty</Eyebrow>
                <div className="flex flex-wrap gap-2 mt-5">
                  {c.faculty.map(f => <span key={f} className="px-4 py-2 border border-white/10 rounded-full text-sm">{f}</span>)}
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <GlassPanel elevated className="p-7">
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Programme fee</div>
                <div className="font-display text-5xl font-medium tracking-tight mt-2 text-accent text-glow-accent">₹{c.fee.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground mt-1">Inclusive of all study material + Unacademy access</div>

                <div className="mt-7 space-y-4 text-sm border-t border-white/[0.06] pt-6">
                  <Row Icon={Clock} label="Duration" value={c.duration}/>
                  <Row Icon={Users} label="Mentors" value={`${c.faculty.length}+`}/>
                  <Row Icon={Trophy} label="Scholarship" value={c.scholarship_available ? "Available" : "Not available"}/>
                </div>

                <div className="mt-7 space-y-2">
                  <Link to={`/enroll?course=${c.id}`}><CTAPrimary className="w-full justify-center" data-testid="enroll-btn">Enrol now</CTAPrimary></Link>
                  <Link to="/contact"><CTAGhost className="w-full justify-center" data-testid="demo-btn">Book demo class</CTAGhost></Link>
                </div>
              </GlassPanel>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon weight="duotone" size={16} className="text-accent flex-shrink-0"/>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium ml-auto">{value}</span>
    </div>
  );
}
