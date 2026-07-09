import { memo } from "react";

function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(Particles);