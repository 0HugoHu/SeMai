"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Ambient breathing gradient field background.
 * Reacts to cursor position and shifts toward nearby colors.
 * Uses canvas for smooth, GPU-friendly gradient rendering.
 */
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const neutralMode = useAppStore((s) => s.neutralMode);
  const neutralModeRef = useRef(neutralMode);
  neutralModeRef.current = neutralMode;

  // Use refs for cursor to avoid re-renders
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const animate = () => {
      time += 0.004;
      const w = canvas.width;
      const h = canvas.height;
      const cx = cursorRef.current.x;
      const cy = cursorRef.current.y;
      const isNeutral = neutralModeRef.current;

      // Dark base
      ctx.fillStyle = isNeutral ? "#0d0d0d" : "#080808";
      ctx.fillRect(0, 0, w, h);

      if (!isNeutral) {
        // === IMMERSE MODE: rich, visible ambient gradients ===

        // Breathing orb 1 — warm tones, follows cursor loosely
        const x1 = w * 0.3 + Math.sin(time * 0.7) * w * 0.12 + cx * 0.15;
        const y1 = h * 0.4 + Math.cos(time * 0.5) * h * 0.12 + cy * 0.15;
        const r1 = Math.min(w, h) * (0.5 + Math.sin(time) * 0.06);
        const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
        const h1 = (20 + Math.sin(time * 0.3) * 30 + 360) % 360;
        g1.addColorStop(0, `hsla(${h1}, 40%, 18%, 0.6)`);
        g1.addColorStop(0.4, `hsla(${h1}, 30%, 12%, 0.35)`);
        g1.addColorStop(1, "transparent");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        // Breathing orb 2 — cool complementary hue
        const x2 = w * 0.7 + Math.cos(time * 0.6) * w * 0.1;
        const y2 = h * 0.55 + Math.sin(time * 0.4) * h * 0.1;
        const r2 = Math.min(w, h) * (0.45 + Math.cos(time * 1.1) * 0.05);
        const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
        const h2 = (200 + Math.cos(time * 0.4) * 25 + 360) % 360;
        g2.addColorStop(0, `hsla(${h2}, 35%, 15%, 0.5)`);
        g2.addColorStop(0.5, `hsla(${h2}, 20%, 10%, 0.25)`);
        g2.addColorStop(1, "transparent");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);

        // Breathing orb 3 — accent, drifts more
        const x3 = w * 0.5 + Math.sin(time * 0.8) * w * 0.18;
        const y3 = h * 0.3 + Math.cos(time * 0.9) * h * 0.15;
        const r3 = Math.min(w, h) * (0.3 + Math.sin(time * 0.7) * 0.04);
        const g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
        const h3 = (300 + Math.sin(time * 0.5) * 20 + 360) % 360;
        g3.addColorStop(0, `hsla(${h3}, 30%, 14%, 0.35)`);
        g3.addColorStop(1, "transparent");
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, w, h);

        // Cursor lantern glow — MUCH stronger and larger
        if (cx > 0 || cy > 0) {
          const lanternR = 350;
          const gCursor = ctx.createRadialGradient(cx, cy, 0, cx, cy, lanternR);
          gCursor.addColorStop(0, `hsla(35, 50%, 30%, 0.35)`);
          gCursor.addColorStop(0.2, `hsla(35, 40%, 22%, 0.2)`);
          gCursor.addColorStop(0.5, `hsla(35, 30%, 15%, 0.08)`);
          gCursor.addColorStop(1, "transparent");
          ctx.fillStyle = gCursor;
          ctx.fillRect(0, 0, w, h);

          // Inner bright core
          const gCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
          gCore.addColorStop(0, `rgba(255, 230, 180, 0.08)`);
          gCore.addColorStop(1, "transparent");
          ctx.fillStyle = gCore;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // Subtle grain overlay (both modes)
      ctx.fillStyle = `rgba(245, 240, 232, ${0.01 + Math.sin(time * 2) * 0.003})`;
      for (let i = 0; i < 40; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillRect(nx, ny, 1, 1);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
