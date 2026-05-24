/**
 * Cinematic hero background — currently CSS-only (ambient orbs + grid + drifting layers).
 *
 * NOTE: A full @react-three/fiber 9.x scene exists in `HeroScene.r3f.jsx` but is
 * temporarily disabled due to a CRA + r3f9 + babel-plugin-transform-react-jsx-source
 * incompatibility (`__source` props leak into r3f's applyProps, causing
 * "x-line-number" runtime errors). The CSS hero below ships the same premium
 * aesthetic — orbs, grid, depth, fade — at 0 GPU cost. Re-enable WebGL after
 * migrating to Next.js or after r3f releases a fix for this combo.
 */
export default function HeroScene({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Animated drifting orbs */}
      <div className="ambient-orb ambient-orb--primary drift"
        style={{ width: 620, height: 620, top: "5%", left: "10%" }} />
      <div className="ambient-orb ambient-orb--accent drift"
        style={{ width: 480, height: 480, top: "20%", right: "5%", animationDelay: "-7s" }} />
      <div className="ambient-orb ambient-orb--primary drift"
        style={{ width: 380, height: 380, bottom: "5%", left: "30%", animationDelay: "-3.5s", opacity: 0.4 }} />

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Concentric "knowledge core" rings — pure CSS */}
      <div className="absolute right-[8%] top-[18%] hidden lg:block">
        <div className="relative w-[420px] h-[420px]">
          <div className="absolute inset-0 rounded-full border border-accent/30 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border border-primary/40 animate-[spin_45s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-accent/20 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent glow-accent" />
          {/* Tracker dots on rings */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-accent glow-accent" />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary glow-primary" />
        </div>
      </div>

      {/* Bottom fade into background */}
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--background)))" }} />
    </div>
  );
}

export function HeroSceneFallback() {
  return <HeroScene />;
}
