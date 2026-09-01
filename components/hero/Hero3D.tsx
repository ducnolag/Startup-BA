'use client';

import { useEffect, useState } from 'react';

/**
 * Light hero background with floating animated shapes.
 * Inspired by antigravity — subtle gradient washes, slow-moving orbs,
 * soft grid mask for depth.
 */
export default function Hero3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f4f8fb]" />

      {/* Right accent radial — strong */}
      <div
        className="absolute -top-20 right-0 w-[60%] h-[80%]"
        style={{
          background:
            'radial-gradient(ellipse at top right, rgba(0,168,212,0.18) 0%, rgba(0,168,212,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Left subtle wash */}
      <div
        className="absolute top-[10%] left-[-10%] w-[50%] h-[60%]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,26,58,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Animated gradient orb — large, slow */}
      {mounted && (
        <div
          className="absolute top-[5%] left-[15%] w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(0,168,212,0.18) 0%, transparent 65%)',
            filter: 'blur(40px)',
            animation: 'floatOrb1 18s ease-in-out infinite',
          }}
        />
      )}

      {mounted && (
        <div
          className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(10,26,58,0.12) 0%, transparent 65%)',
            filter: 'blur(40px)',
            animation: 'floatOrb2 22s ease-in-out infinite',
          }}
        />
      )}

      {/* Floating shape — small accent */}
      {mounted && (
        <div
          className="absolute top-[12%] right-[18%] w-32 h-32 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,168,212,0.35), rgba(0,168,212,0.08))',
            animation: 'float1 8s ease-in-out infinite',
            opacity: 0.5,
          }}
        />
      )}

      {mounted && (
        <div
          className="absolute top-[45%] left-[5%] w-20 h-20 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(10,26,58,0.1), transparent)',
            animation: 'float2 10s ease-in-out infinite',
            opacity: 0.6,
          }}
        />
      )}

      {/* Subtle grid — masked to top portion only */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at center top, black 10%, transparent 65%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center top, black 10%, transparent 65%)',
        }}
      />

      {/* Bottom fade — smooth transition into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}