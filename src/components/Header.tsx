"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import type { Lens } from "@/lib/types";

const lensLabels: Record<Lens, { zh: string; en: string }> = {
  hue: { zh: "色系", en: "Hue" },
  dynasty: { zh: "朝代", en: "Dynasty" },
  mood: { zh: "情绪", en: "Mood" },
};

export default function Header() {
  const activeLens = useAppStore((s) => s.activeLens);
  const setLens = useAppStore((s) => s.setLens);
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const neutralMode = useAppStore((s) => s.neutralMode);
  const toggleNeutralMode = useAppStore((s) => s.toggleNeutralMode);

  if (currentView === "landing") return null;

  const lenses: Lens[] = ["hue", "dynasty", "mood"];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-30 flex items-center select-none"
      style={{
        background: "linear-gradient(to bottom, rgba(10,10,10,0.85), transparent)",
        padding: "20px 32px",
        justifyContent: "space-between",
      }}
    >
      {/* Logo — fixed width to balance with right controls */}
      <div style={{ minWidth: "120px" }}>
        <button
          onClick={() => setView("landing")}
          className="text-xl font-bold tracking-wider hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-serif-cn)" }}
        >
          色脉
        </button>
      </div>

      {/* Lens toggles — absolutely centered */}
      {currentView === "explore" ? (
        <div
          className="flex items-center rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            padding: "5px 6px",
            gap: "4px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {lenses.map((lens) => (
            <button
              key={lens}
              onClick={() => setLens(lens)}
              className="relative rounded-full transition-colors"
              style={{
                padding: "8px 22px",
                fontSize: "14px",
                letterSpacing: "0.05em",
                color:
                  activeLens === lens
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
              }}
            >
              {activeLens === lens && (
                <motion.div
                  layoutId="lens-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">
                {locale === "zh" ? lensLabels[lens].zh : lensLabels[lens].en}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div />
      )}

      {/* Right controls */}
      <div className="flex items-center" style={{ gap: "12px" }}>
        {/* Neutral mode toggle */}
        <button
          onClick={toggleNeutralMode}
          className="rounded-full transition-colors hover:bg-white/5"
          style={{
            fontSize: "13px",
            padding: "8px 18px",
            border: `1px solid ${neutralMode ? "var(--color-text-secondary)" : "rgba(107,100,89,0.4)"}`,
            color: neutralMode ? "var(--color-text-primary)" : "var(--color-text-muted)",
          }}
        >
          {neutralMode
            ? locale === "zh" ? "沉浸" : "Immerse"
            : locale === "zh" ? "中性" : "Neutral"}
        </button>

        {/* Palette Lab link */}
        <button
          onClick={() => setView(currentView === "palette" ? "explore" : "palette")}
          className="rounded-full transition-colors hover:bg-white/5"
          style={{
            fontSize: "13px",
            padding: "8px 18px",
            border: `1px solid ${currentView === "palette" ? "var(--color-text-secondary)" : "rgba(107,100,89,0.4)"}`,
            color: currentView === "palette" ? "var(--color-text-primary)" : "var(--color-text-muted)",
          }}
        >
          {locale === "zh" ? "调色板" : "Palette"}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
          className="rounded-full hover:bg-white/5 transition-colors"
          style={{
            fontSize: "13px",
            padding: "8px 14px",
            color: "var(--color-text-muted)",
          }}
        >
          {locale === "zh" ? "EN" : "中"}
        </button>
      </div>
    </motion.header>
  );
}
