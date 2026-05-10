import { SectionHeader } from "@/components/SectionHeader";
import { GraduationCap, Target, Eye, Users } from "lucide-react";

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-12">
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">About Us</div>
        <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter max-w-4xl">A franchise born from one promise — bring India's best teaching to Kashmir.</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl">Northend Educational World is the authorized Unacademy partner for the Kashmir region — operating 4 centers and serving thousands of students preparing for NEET, IIT-JEE, Foundation, CBSE and JKBOSE exams.</p>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid md:grid-cols-3 gap-8">
          {[
            [Target, "Mission", "Make national-grade competitive coaching universally accessible to every Kashmiri student — irrespective of locality or income."],
            [Eye, "Vision", "Become the most trusted educational ecosystem in J&K with a track record of measurable outcomes — selections, scholarships, careers."],
            [Users, "Philosophy", "Small batches. Daily mentoring. Honest weekly assessments. No shortcuts. No empty promises."],
          ].map(([Icon, t, d]) => (
            <div key={t} className="bg-background border border-border p-8 rounded-md">
              <Icon className="text-primary mb-4" size={26}/>
              <h3 className="font-display text-xl font-bold mb-2">{t}</h3>
              <p className="text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <SectionHeader overline="Partnership" title="Authorized franchise of Unacademy." subtitle="We bring Unacademy's national curriculum, top educators and assessment systems — directly to Kashmir, with on-ground mentorship from local academic leaders."/>
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {[
            ["2022", "Founded in Srinagar"],
            ["2023", "Unacademy partnership"],
            ["2025", "Expanded to 3 centers"],
            ["2026", "Expanded to 4 centers"],
            
          ].map(([year, txt]) => (
            <div key={year} className="border border-border p-6 rounded-md">
              <div className="font-display text-3xl font-black text-primary">{year}</div>
              <div className="text-sm text-muted-foreground mt-1">{txt}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
