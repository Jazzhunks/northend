import { memo } from "react";

function FloatingRings() {
  return (
    <div className="hero-rings">
      <div className="ring ring-1" />
      <div className="ring ring-2" />
      <div className="ring ring-3" />
    </div>
  );
}

export default memo(FloatingRings);