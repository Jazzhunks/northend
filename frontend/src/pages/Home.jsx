import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Star, BookOpen, Users, MapPin, Sparkles, Target, ShieldCheck, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Counter from "@/components/Counter";
import { SectionHeader } from "@/components/SectionHeader";

const HERO_IMG = "https://lh3.googleusercontent.com/p/AF1QipNJi9ktWhKPKIxJE2b_TtkFkM8VItvYUWdPmeUJ=s1360-w1360-h1020-rw";
const KASHMIR = "https://images.unsplash.com/photo-1606355792317-4dcadc93ed26?w=1200";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ students_trained: 0, selections: 0, educators: 0, centers: 0 });
  const [notices, setNotices] = useState([]);
  const [results, setResults] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/courses?featured=true").then(r => setCourses(r.data)),
      api.get("/stats").then(r => setStats(r.data)),
      api.get("/notices").then(r => setNotices(r.data.slice(0, 3))),
      api.get("/results").then(r => setResults(r.data.slice(0, 6))),
      api.get("/testimonials").then(r => setTestimonials(r.data)),
    ]).catch(()=>{});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60"/>
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full opacity-30" style={{background:"radial-gradient(circle, hsl(var(--primary)/.25), transparent 60%)"}}/>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-16 lg:pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 rounded-full text-xs font-medium text-primary mb-6" data-testid="hero-badge">
              <Sparkles size={14}/> Authorized Unacademy Franchise · Kashmir
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              Empowering <span className="italic font-light">Kashmir's</span><br/>
              future through<br/>
              <span className="text-primary">quality education.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
              NEET · IIT-JEE · Foundation · CBSE · JKBOSE — taught by India's best educators, anchored by 5 centers across the valley.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/enroll"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-12 px-6" data-testid="hero-enroll-btn">Enroll Now <ArrowRight size={16}/></Button></Link>
              <Link to="/scholarship"><Button size="lg" variant="outline" className="rounded-md h-12 px-6 border-2" data-testid="hero-scholarship-btn">Apply Scholarship</Button></Link>
              <Link to="/courses"><Button size="lg" variant="ghost" className="rounded-md h-12 px-6" data-testid="hero-courses-btn">Explore Courses <ChevronRight size={16}/></Button></Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent"/> 4.9 / 5 by 2,400+ parents</div>
              <div className="hidden sm:flex items-center gap-1"><ShieldCheck size={14} className="text-primary"/> Trusted since 2018</div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-border">
              <img src={HERO_IMG} alt="Kashmir classroom" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-md p-4 border border-white/40">
                <div className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-1">Featured</div>
                <div className="font-display font-bold">NEET Scholarship Test 2026</div>
                <div className="text-xs text-muted-foreground mt-1">Up to 100% fee waiver · Feb 28</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { i: Users, label: "Students trained", n: stats.students_trained, suffix: "+", id: "stat-students" },
            { i: Trophy, label: "Top selections", n: stats.selections, suffix: "+", id: "stat-selections" },
            { i: Award, label: "Expert educators", n: stats.educators, suffix: "+", id: "stat-educators" },
            { i: MapPin, label: "Centers in Kashmir", n: stats.centers, suffix: "", id: "stat-centers" },
          ].map(({ i: Icon, label, n, suffix, id }) => (
            <div key={label} className="border-r last:border-r-0 border-border/60 pr-4">
              <Icon className="text-primary mb-2" size={20}/>
              <div className="font-display text-3xl lg:text-4xl font-black"><Counter end={n} suffix={suffix} testId={id}/></div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 section">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <SectionHeader overline="Featured Courses" title="Built for the toughest exams in India." subtitle="Curated programmes from Class 8 to NEET-PG aspirants."/>
          <Link to="/courses"><Button variant="outline" data-testid="view-all-courses-btn">View all courses <ChevronRight size={16}/></Button></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="group border border-border rounded-md overflow-hidden hover:border-primary/40 transition" data-testid={`course-card-${c.id}`}>
              <div className="aspect-[16/10] relative overflow-hidden bg-secondary">
                {c.image_url && <img src={c.image_url} alt={c.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-700"/>}
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">{c.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg leading-tight">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                  <span className="text-sm font-mono">{c.duration}</span>
                  <span className="font-display font-bold text-primary">₹{c.fee.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 section grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <SectionHeader overline="Why Northend" title="The most disciplined coaching ecosystem in Kashmir."/>
            <p className="text-muted-foreground leading-relaxed">An authorized Unacademy partnership backed by Kashmir's most committed academic team — built on small batches, weekly tests and personal mentoring.</p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              [Target, "National-grade curriculum", "Same Unacademy syllabus that produces AIIMS, IIT and NIT toppers — adapted for Kashmir."],
              [Users, "Mentorship that scales", "1 mentor for every 30 students. Direct doubt sessions, not just lectures."],
              [Trophy, "Proven selections", "850+ NEET, JEE and CBSE selections in the last 4 years."],
              [BookOpen, "Test discipline", "Weekly Mock Tests + Detailed PDF analytics every Sunday."],
            ].map(([Icon, t, d]) => (
              <div key={t} className="bg-background border border-border p-6 rounded-md hover:-translate-y-0.5 transition">
                <Icon className="text-primary mb-3" size={22}/>
                <div className="font-display font-bold mb-1">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHOLARSHIP BANNER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 section">
        <div className="relative overflow-hidden rounded-md border border-border bg-primary text-primary-foreground p-8 lg:p-14">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-15" style={{background:"radial-gradient(circle at right, white, transparent 60%)"}}/>
          <div className="relative grid lg:grid-cols-2 items-center gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-3">Northend Scholarship Test 2026</div>
              <h3 className="font-display text-3xl lg:text-5xl font-black leading-tight">Win up to <span className="text-accent">100% off</span> on tuition fees.</h3>
              <p className="mt-4 text-primary-foreground/80 max-w-md">Open for Class 8–12 students. Online + offline modes. Result on Day-3 with detailed feedback report.</p>
            </div>
            <div className="flex lg:justify-end gap-3">
              <Link to="/scholarship"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6" data-testid="banner-apply-scholarship">Apply now <ArrowRight size={16}/></Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOPPERS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 section">
        <SectionHeader overline="Results" title="Selections that speak louder." subtitle="A glimpse of our students rewriting Kashmir's academic story."/>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r) => (
            <div key={r.id} className="border border-border rounded-md p-6 bg-background" data-testid={`topper-${r.id}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-bold text-lg">{r.student_name}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{r.exam}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{r.year}</div>
                  <div className="font-display font-black text-primary">{r.rank}</div>
                </div>
              </div>
              {r.quote && <p className="mt-4 text-sm text-muted-foreground italic leading-relaxed">"{r.quote}"</p>}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 section">
          <SectionHeader overline="Testimonials" title="Words from parents and students."/>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-background border border-border p-6 rounded-md">
                <Star className="text-accent fill-accent mb-3" size={18}/>
                <p className="text-base leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTICES + KASHMIR */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 section grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <SectionHeader overline="Latest Notices" title="What's happening at Northend."/>
          <div className="space-y-3">
            {notices.map(n => (
              <Link to="/notices" key={n.id} className="flex items-start gap-4 p-5 border border-border rounded-md hover:border-primary/40 transition" data-testid={`notice-${n.id}`}>
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary mt-1 w-24 shrink-0">{n.category}</div>
                <div className="flex-1">
                  <div className="font-display font-bold">{n.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.content}</div>
                </div>
                <ArrowRight size={16} className="mt-1 text-muted-foreground"/>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 relative rounded-md overflow-hidden border border-border min-h-[300px]">
          <img src={KASHMIR} alt="Kashmir" className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-primary/70"/>
          <div className="relative z-10 p-8 lg:p-12 text-primary-foreground h-full flex flex-col justify-end">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-3">Made for Kashmir</div>
            <h3 className="font-display text-3xl font-black leading-tight">Built in the valley.<br/>Built for the valley.</h3>
            <p className="mt-3 text-primary-foreground/80 text-sm">5 centers across Anantnag, Soura, Zakura and Parraypora — and growing.</p>
            <Link to="/centers" className="mt-6"><Button variant="secondary" data-testid="see-centers-btn">See our centers <ArrowRight size={16}/></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
