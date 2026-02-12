"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { TraditionalColor } from "@/lib/types";
import { getContrastText } from "@/lib/colorUtils";
import { useAppStore } from "@/lib/store";

interface ColorOrbProps {
  color: TraditionalColor;
  index: number;
  position: { x: number; y: number };
  size?: number;
}

export default function ColorOrb({
  color,
  index,
  position,
  size = 64,
}: ColorOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const selectColor = useAppStore((s) => s.selectColor);
  const selectedColorId = useAppStore((s) => s.selectedColorId);
  const cursorPos = useAppStore((s) => s.cursorPos);
  const locale = useAppStore((s) => s.locale);
  const isSelected = selectedColorId === color.id;

  // Magnetic drift: calculate offset based on cursor proximity
  const dx = cursorPos.x - position.x;
  const dy = cursorPos.y - position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const magnetRadius = 200;
  const magnetStrength = 15;
  let magnetX = 0;
  let magnetY = 0;
  if (dist < magnetRadius && dist > 0) {
    const force = (1 - dist / magnetRadius) * magnetStrength;
    magnetX = (dx / dist) * force;
    magnetY = (dy / dist) * force;
  }

  // Material-based visual style
  const getMaterialStyle = () => {
    const base = {
      background: color.hex,
      boxShadow: `0 4px 20px ${color.hex}40, inset 0 1px 2px rgba(255,255,255,0.15)`,
    };
    switch (color.material) {
      case "丝绸":
      case "织锦":
        return {
          ...base,
          boxShadow: `0 4px 24px ${color.hex}50, inset 0 2px 4px rgba(255,255,255,0.25)`,
          background: `linear-gradient(135deg, ${color.hex}ee, ${color.hex}, ${color.hex}dd)`,
        };
      case "陶瓷":
        return {
          ...base,
          boxShadow: `0 6px 28px ${color.hex}60, inset 0 3px 6px rgba(255,255,255,0.35)`,
          background: `radial-gradient(circle at 35% 35%, ${color.hex}ff, ${color.hex}cc)`,
        };
      case "漆器":
        return {
          ...base,
          boxShadow: `0 8px 32px ${color.hex}70, inset 0 2px 8px rgba(255,255,255,0.2)`,
          background: `radial-gradient(circle at 40% 30%, ${color.hex}, ${adjustBrightness(color.hex, -20)})`,
        };
      case "矿石":
        return {
          ...base,
          boxShadow: `0 3px 16px ${color.hex}30`,
          filter: "saturate(0.9)",
        };
      case "金属":
        return {
          ...base,
          boxShadow: `0 4px 24px ${color.hex}50, inset 0 1px 3px rgba(255,255,255,0.4)`,
          background: `linear-gradient(145deg, ${adjustBrightness(color.hex, 15)}, ${color.hex}, ${adjustBrightness(color.hex, -10)})`,
        };
      default:
        return base;
    }
  };

  const handleClick = useCallback(() => {
    selectColor(isSelected ? null : color.id);
  }, [selectColor, color.id, isSelected]);

  const textColor = getContrastText(color.hex);

  return (
    <motion.div
      ref={orbRef}
      layout
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.3 : 1,
        x: position.x + magnetX,
        y: position.y + magnetY,
        zIndex: isSelected ? 50 : 1,
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 80, damping: 20 },
        opacity: { duration: 0.4, delay: index * 0.02 },
        scale: { type: "spring", stiffness: 200, damping: 15 },
        x: { type: "spring", stiffness: 50, damping: 20 },
        y: { type: "spring", stiffness: 50, damping: 20 },
      }}
      whileHover={{
        scale: 1.2,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
      onClick={handleClick}
      className="absolute cursor-pointer group"
      style={{
        width: size,
        height: size,
        left: -size / 2,
        top: -size / 2,
      }}
    >
      {/* Floating bob animation */}
      <motion.div
        animate={{
          y: [0, -4, 0, 3, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
        className="w-full h-full rounded-full relative"
        style={getMaterialStyle()}
      >
        {/* Hover label */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            text-sm font-medium pointer-events-none"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span style={{ fontFamily: "var(--font-serif-cn)" }}>
            {color.name}
          </span>
          {locale === "en" && (
            <span className="ml-1.5 opacity-60 text-xs">{color.pinyin}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Adjust hex color brightness */
function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
