"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import type { TraditionalColor } from "@/lib/types";

interface LandingPageProps {
  colors: TraditionalColor[];
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

export default function LandingPage({ colors }: LandingPageProps) {
  const setView = useAppStore((s) => s.setView);
  const locale = useAppStore((s) => s.locale);
  const [entered, setEntered] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  // Initialize particles from color data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // Create particles — each color gets 3-5 particles
    const particles: Particle[] = [];
    const sampleColors = colors.slice(0, 40);

    for (const color of sampleColors) {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        // Start from edges
        const edge = Math.floor(Math.random() * 4);
        let startX: number, startY: number;
        switch (edge) {
          case 0: startX = Math.random() * w; startY = -20; break;
          case 1: startX = w + 20; startY = Math.random() * h; break;
          case 2: startX = Math.random() * w; startY = h + 20; break;
          default: startX = -20; startY = Math.random() * h; break;
        }

        particles.push({
          x: startX,
          y: startY,
          targetX: w * 0.3 + Math.random() * w * 0.4,
          targetY: h * 0.3 + Math.random() * h * 0.4,
          color: color.hex,
          size: 2 + Math.random() * 4,
          speed: 0.005 + Math.random() * 0.01,
          opacity: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    particlesRef.current = particles;

    // Show title after particles start gathering
    setTimeout(() => setShowContent(true), 800);
  }, [colors]);

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let time = 0;
    const animate = () => {
      time += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        // Move toward target
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        // Gentle floating once near target
        const dx = Math.abs(p.targetX - p.x);
        const dy = Math.abs(p.targetY - p.y);
        if (dx < 5 && dy < 5) {
          p.x += Math.sin(time * 0.02 + p.phase) * 0.3;
          p.y += Math.cos(time * 0.015 + p.phase) * 0.3;
        }

        // Breathing opacity
        const breathe = 0.7 + Math.sin(time * 0.01 + p.phase) * 0.3;

        ctx.globalAlpha = p.opacity * breathe;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.globalAlpha = p.opacity * breathe * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(
          p.x, p.y, 0, p.x, p.y, p.size * 3
        );
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => setView("explore"), 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: entered ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <AnimatePresence>
        {showContent && !entered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center select-none"
          >
            <motion.h1
              className="text-7xl md:text-9xl font-bold tracking-wider mb-6"
              style={{ fontFamily: "var(--font-serif-cn)" }}
              initial={{ letterSpacing: "0.3em", opacity: 0 }}
              animate={{ letterSpacing: "0.15em", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              色脉
            </motion.h1>

            <motion.p
              className="text-base md:text-lg tracking-[0.3em]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-serif-cn)",
                marginBottom: "16px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {locale === "zh"
                ? "溯源千年色彩 · 探寻东方美学"
                : "Tracing Colors Through Millennia"}
            </motion.p>

            <motion.p
              className="text-sm tracking-[0.2em]"
              style={{ color: "var(--color-text-muted)", marginBottom: "48px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              SeMai
            </motion.p>

            <motion.button
              onClick={handleEnter}
              className="rounded-full text-sm tracking-[0.2em]
                transition-all duration-300 hover:bg-white/5"
              style={{
                padding: "14px 48px",
                border: "1px solid var(--color-text-muted)",
                color: "var(--color-text-secondary)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {locale === "zh" ? "进入 · Enter" : "Enter · 进入"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
