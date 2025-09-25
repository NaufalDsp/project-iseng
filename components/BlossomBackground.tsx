"use client";
import React from "react";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function BlossomBackground({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  if (!enabled) return null;

  // base positions supaya bunga tersebar; animasi akan memindahkannya relatif ke base
  const bases = [
    { left: "6%", top: "18%" },
    { left: "18%", top: "8%" },
    { left: "34%", top: "24%" },
    { left: "52%", top: "10%" },
    { left: "72%", top: "20%" },
    { left: "88%", top: "6%" },
    { left: "12%", top: "72%" },
    { left: "28%", top: "82%" },
    { left: "60%", top: "72%" },
    { left: "80%", top: "78%" },
  ];

  // buat konfigurasi per bunga: size, durasi, delay, rotate, dan 3 offset posisi acak
  const flowers = bases.map((b, i) => {
    const size = Math.round(rand(36, 72));
    const dur = `${rand(6.5, 11).toFixed(2)}s`;
    const delay = `${rand(0, 3.5).toFixed(2)}s`;
    const rotate = Math.round(rand(-18, 18));
    // offsets dalam px supaya pergerakan terlihat natural
    const dx1 = `${Math.round(rand(-40, 40))}px`;
    const dy1 = `${Math.round(rand(-28, 28))}px`;
    const dx2 = `${Math.round(rand(-80, 80))}px`;
    const dy2 = `${Math.round(rand(-40, 40))}px`;
    const dx3 = `${Math.round(rand(-20, 20))}px`;
    const dy3 = `${Math.round(rand(-12, 12))}px`;

    return {
      ...b,
      size,
      dur,
      delay,
      rotate,
      dx1,
      dy1,
      dx2,
      dy2,
      dx3,
      dy3,
      key: `f-${i}-${size}-${Date.now() % 1000}`,
    };
  });

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="relative w-full h-full">
          {flowers.map((f) => {
            // css custom properties as plain object (no `any`)
            const cssVars: Record<string, string> = {
              "--dx1": f.dx1,
              "--dy1": f.dy1,
              "--dx2": f.dx2,
              "--dy2": f.dy2,
              "--dx3": f.dx3,
              "--dy3": f.dy3,
              "--dur": f.dur,
              "--delay": f.delay,
            };

            const style = {
              left: f.left,
              top: f.top,
              fontSize: `${f.size}px`,
              transform: `rotate(${f.rotate}deg)`,
              ...cssVars,
            } as React.CSSProperties;

            return (
              <span key={f.key} className="flower" style={style}>
                🌸
              </span>
            );
          })}
        </div>
      </div>

      <style>{`
        .flower {
          position: absolute;
          display: inline-block;
          transform-origin: center center;
          opacity: 0.2;
          will-change: transform, opacity, filter;
          text-shadow: 0 6px 14px rgba(0,0,0,0.08);
          animation-name: blossomMove;
          animation-duration: var(--dur, 8s);
          animation-delay: var(--delay, 0s);
          animation-timing-function: cubic-bezier(.22,.9,.3,1);
          animation-iteration-count: infinite;
          animation-direction: normal;
          pointer-events: none;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.06));
        }

        @keyframes blossomMove {
          0% {
            transform: translate(0,0) scale(0.82);
            opacity: 0;
            filter: blur(2px);
          }
          12% {
            opacity: 0.9;
            filter: blur(0);
            transform: translate(var(--dx1), var(--dy1)) scale(1.12);
          }
          38% {
            transform: translate(calc(var(--dx1) * 1.1), calc(var(--dy1) * 0.9)) scale(1.18);
            opacity: 1;
          }
          58% {
            transform: translate(var(--dx2), var(--dy2)) scale(1.05);
            opacity: 0.8;
            filter: blur(0.4px);
          }
          78% {
            transform: translate(var(--dx3), var(--dy3)) scale(0.95);
            opacity: 0.45;
            filter: blur(0.8px);
          }
          100% {
            transform: translate(0,0) scale(0.86);
            opacity: 0.18;
            filter: blur(1.5px);
          }
        }

        /* smaller screens: scale down flowers but keep relative motion */
        @media (max-width: 640px) {
          .flower { font-size: calc(var(--fs, 40px) * 0.6); }
        }
      `}</style>
    </>
  );
}
