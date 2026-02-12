"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TraditionalColor, Lens } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  dynastyOrder,
  majorDynasties,
  dynastyInfo,
  moodInfo,
} from "@/lib/colorUtils";
import ColorOrb from "./ColorOrb";
import ColorDetail from "./ColorDetail";

interface ExplorerProps {
  colors: TraditionalColor[];
}

interface PositionedColor {
  color: TraditionalColor;
  x: number;
  y: number;
}

// Stable seeded random to avoid layout jitter on re-render
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/**
 * Classify a color into a hue family using HSL values, not the category field.
 * This ensures proper visual grouping regardless of metadata errors.
 *
 * Key design decisions:
 * - Achromatic: s < 10 → white (l>80) or black (l<20), gray otherwise
 * - Brown/earth: warm hues (h 0-50) + low lightness (l<45) + moderate sat (s<65)
 *   OR warm hues + very low saturation (s<30)
 * - Red expanded to include deep pinks/carmines (h>=320)
 * - Orange: narrow band h 20-40 with decent saturation
 * - Yellow: h 40-70
 * - Green: h 70-160
 * - Cyan/青: h 160-200
 * - Blue: h 200-270
 * - Purple: h 270-320
 */
function classifyHue(color: TraditionalColor): string {
  const [h, s, l] = color.hsl;

  // 1. Achromatic (very low saturation)
  if (s < 10) {
    if (l > 80) return "白";
    if (l < 20) return "黑";
    return l > 50 ? "白" : "黑";
  }

  // 2. Near-white (high lightness regardless of hue)
  if (l > 85) return "白";

  // 3. Near-black (very low lightness)
  if (l < 12) return "黑";

  // 4. Brown/earth tones: warm hues with low-to-moderate sat and darker lightness
  //    Covers: 栗色(h9,s52,l25), 赭石(h29,s44,l36), 驼色(h29,s28,l52),
  //    秋色(h38,s41,l38), 檀色(h9,s33,l54), 琥珀(h25,s70,l47)
  const isWarmHue = h < 50 || h >= 345;
  if (isWarmHue) {
    // Dark warm color with moderate saturation → brown
    if (l < 35 && s < 70) return "棕";
    // Medium warm color with low saturation → brown
    if (l < 55 && s < 35) return "棕";
  }

  // 5. Low saturation mid-tones that aren't warm → gray/dark
  if (s < 20 && l < 50) return "黑";

  // 6. Chromatic classification by hue angle
  // Red: includes deep pinks, carmines (胭脂 h326, 海棠红 h352, etc.)
  if (h < 20 || h >= 320) return "红";
  // Orange: 杏黄(h34), 橘红(h26)
  if (h >= 20 && h < 40) return "橙";
  // Yellow
  if (h >= 40 && h < 70) return "黄";
  // Green
  if (h >= 70 && h < 160) return "绿";
  // Cyan/青
  if (h >= 160 && h < 200) return "青";
  // Blue
  if (h >= 200 && h < 270) return "蓝";
  // Purple
  if (h >= 270 && h < 320) return "紫";

  return "红";
}

export default function Explorer({ colors }: ExplorerProps) {
  const activeLens = useAppStore((s) => s.activeLens);
  const selectedColorId = useAppStore((s) => s.selectedColorId);
  const locale = useAppStore((s) => s.locale);
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const update = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const selectedColor = useMemo(
    () => colors.find((c) => c.id === selectedColorId) || null,
    [colors, selectedColorId]
  );

  const positions = useMemo(
    () => computePositions(colors, activeLens, dimensions.w, dimensions.h),
    [colors, activeLens, dimensions]
  );

  const orbSizes = useMemo(
    () => colors.map((_, i) => 48 + seededRandom(i + 100) * 22),
    [colors]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-10 overflow-hidden select-none"
      style={{ paddingTop: 80 }}
    >
      {/* Hue stem visual (only in hue lens) */}
      {activeLens === "hue" && (
        <HueStemLine
          colors={colors}
          w={dimensions.w}
          h={dimensions.h}
        />
      )}

      {/* Lens labels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLens}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute z-20"
          style={{
            bottom: activeLens === "dynasty" ? "auto" : 52,
            top: activeLens === "dynasty" ? 95 : "auto",
            left: 0,
            right: 0,
          }}
        >
          {activeLens === "hue" && <HueSpectrumBar locale={locale} />}
          {activeLens === "dynasty" && (
            <DynastyTimeline locale={locale} colors={colors} />
          )}
          {activeLens === "mood" && (
            <MoodAnchors locale={locale} colors={colors} w={dimensions.w} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Color orbs */}
      <AnimatePresence>
        {positions.map((pc, i) => (
          <ColorOrb
            key={pc.color.id}
            color={pc.color}
            index={i}
            position={{ x: pc.x, y: pc.y }}
            size={orbSizes[i]}
          />
        ))}
      </AnimatePresence>

      {/* Color detail overlay */}
      <AnimatePresence>
        {selectedColor && (
          <ColorDetail color={selectedColor} allColors={colors} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function computePositions(
  colors: TraditionalColor[],
  lens: Lens,
  w: number,
  h: number
): PositionedColor[] {
  const padX = 140;
  const padTop = 150;
  const padBottom = 130;
  const usableW = w - padX * 2;
  const usableH = h - padTop - padBottom;

  switch (lens) {
    case "hue":
      return layoutByHueStem(colors, padX, padTop, usableW, usableH, w);
    case "dynasty":
      return layoutByDynasty(colors, padX, padTop, usableW, usableH);
    case "mood":
      return layoutByMood(colors, padX, padTop, usableW, usableH);
    default:
      return layoutByHueStem(colors, padX, padTop, usableW, usableH, w);
  }
}

/**
 * 色脉 (Color Vein) layout:
 * A central vertical stem runs down the center. Colors branch off the stem
 * sorted by actual hue, creating a vein-like structure. The stem subtly
 * curves to feel organic. Colors alternate left and right.
 */
function layoutByHueStem(
  colors: TraditionalColor[],
  padX: number,
  padTop: number,
  w: number,
  h: number,
  fullW: number
): PositionedColor[] {
  // Sort by actual hue using the algorithm, not metadata
  const sorted = [...colors].sort((a, b) => {
    const aClass = classifyHue(a);
    const bClass = classifyHue(b);
    const order = ["红", "橙", "黄", "绿", "青", "蓝", "紫", "棕", "白", "黑"];
    const aOrder = order.indexOf(aClass);
    const bOrder = order.indexOf(bClass);
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Within same family, sort by hue
    return a.hsl[0] - b.hsl[0];
  });

  const result: PositionedColor[] = [];
  const total = sorted.length;
  const centerX = fullW / 2;

  sorted.forEach((color, i) => {
    const seed = i * 7 + 42;
    const t = i / Math.max(total - 1, 1);

    // Vertical: top to bottom
    const y = padTop + t * h;

    // Stem: gentle sine wave centered on screen
    const stemX = centerX + Math.sin(t * Math.PI * 3) * w * 0.06;

    // Branch: alternate left/right with varying length
    const side = i % 2 === 0 ? 1 : -1;
    const branchLen = 40 + seededRandom(seed) * 100;
    const x = stemX + side * branchLen;

    // Jitter
    const jx = (seededRandom(seed + 1) - 0.5) * 16;
    const jy = (seededRandom(seed + 2) - 0.5) * 10;

    result.push({
      color,
      x: Math.max(padX, Math.min(fullW - padX, x + jx)),
      y: y + jy,
    });
  });

  return result;
}

function layoutByDynasty(
  colors: TraditionalColor[],
  padX: number,
  padTop: number,
  w: number,
  h: number
): PositionedColor[] {
  const grouped = new Map<string, TraditionalColor[]>();
  for (const d of dynastyOrder) grouped.set(d, []);

  for (const color of colors) {
    const dynasty = color.dynasties[0] || "明";
    const group = grouped.get(dynasty) || [];
    group.push(color);
    grouped.set(dynasty, group);
  }

  const activeDynasties = dynastyOrder.filter(
    (d) => (grouped.get(d)?.length || 0) > 0
  );

  const result: PositionedColor[] = [];
  const totalCols = activeDynasties.length;

  activeDynasties.forEach((dynasty, colIndex) => {
    const group = grouped.get(dynasty) || [];
    const cx = padX + ((colIndex + 0.5) / totalCols) * w;

    group.forEach((color, i) => {
      const seed = colIndex * 100 + i * 13;
      const spacing = Math.min((h - 60) / (group.length + 1), 70);
      const startY = padTop + 60 + (h - 60 - group.length * spacing) / 2;
      result.push({
        color,
        x: cx + (seededRandom(seed) - 0.5) * 30,
        y: startY + i * spacing + (seededRandom(seed + 1) - 0.5) * 12,
      });
    });
  });

  return result;
}

function layoutByMood(
  colors: TraditionalColor[],
  padX: number,
  padTop: number,
  w: number,
  h: number
): PositionedColor[] {
  const moods = ["威严", "温润", "庄重", "空灵", "深沉", "喜庆", "雅致", "天然"];

  // Pre-count colors per mood so we can center each column
  const moodGroups = new Map<string, TraditionalColor[]>();
  for (const mood of moods) moodGroups.set(mood, []);
  const placed = new Set<string>();

  for (const color of colors) {
    if (placed.has(color.id)) continue;
    placed.add(color.id);
    const primaryMood = color.moods[0] || "天然";
    const group = moodGroups.get(primaryMood);
    if (group) group.push(color);
  }

  const result: PositionedColor[] = [];
  // Leave space for labels at bottom (80px) and header at top
  const usableH = h - 80;

  moods.forEach((mood, moodIndex) => {
    const group = moodGroups.get(mood) || [];
    if (group.length === 0) return;

    const cx = padX + ((moodIndex + 0.5) / moods.length) * w;
    const columnSpacing = Math.min(55, usableH / Math.max(group.length + 1, 6));
    const totalColumnH = (group.length - 1) * columnSpacing;
    // Center the column vertically in available space
    const startY = padTop + (usableH - totalColumnH) / 2;

    group.forEach((color, i) => {
      const seed = i * 11 + moodIndex * 77;
      result.push({
        color,
        x: cx + (seededRandom(seed) - 0.5) * 40,
        y: startY + i * columnSpacing + (seededRandom(seed + 1) - 0.5) * 10,
      });
    });
  });

  return result;
}

/**
 * SVG stem/vein line for the hue layout.
 * A subtle curved line running vertically through the center.
 */
function HueStemLine({ colors, w, h }: { colors: TraditionalColor[]; w: number; h: number }) {
  const padTop = 150;
  const padBottom = 130;
  const usableH = h - padTop - padBottom;
  const cx = w / 2;

  // Build SVG path for the stem
  const points: string[] = [];
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = padTop + t * usableH;
    const x = cx + Math.sin(t * Math.PI * 3) * (w - 280) * 0.06;
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <path
        d={points.join(" ")}
        fill="none"
        stroke="rgba(168, 159, 145, 0.12)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hue spectrum bar at the bottom */
function HueSpectrumBar({ locale }: { locale: string }) {
  return (
    <div className="flex justify-center items-center gap-2 px-16 select-none">
      <div
        className="h-1.5 rounded-full flex-1 max-w-md"
        style={{
          background:
            "linear-gradient(to right, #DC143C, #E87A00, #FFD700, #228B22, #2E8B8B, #1E3A8A, #6E3E8E, #8B4513, #D4D0C8, #2D2D2D)",
          opacity: 0.5,
        }}
      />
      <span
        className="ml-3 whitespace-nowrap"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-serif-cn)",
          fontSize: "13px",
        }}
      >
        {locale === "zh" ? "色相 · 脉" : "Hue Vein"}
      </span>
    </div>
  );
}

/**
 * Dynasty timeline — stable row with no width changes on hover.
 * Tooltip rendered as a fixed-position element to avoid clipping.
 */
function DynastyTimeline({
  locale,
  colors,
}: {
  locale: string;
  colors: TraditionalColor[];
}) {
  const [hoveredDynasty, setHoveredDynasty] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of colors) {
      const d = c.dynasties[0];
      if (d) m.set(d, (m.get(d) || 0) + 1);
    }
    return m;
  }, [colors]);

  const handlePointerEnter = (dynasty: string, e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.bottom + 10 });
    setHoveredDynasty(dynasty);
  };

  const hoveredInfo = hoveredDynasty ? dynastyInfo[hoveredDynasty] : null;
  const hoveredCount = hoveredDynasty ? (counts.get(hoveredDynasty) || 0) : 0;

  return (
    <>
      <div
        className="flex items-end justify-center select-none"
        style={{ gap: "6px", padding: "0 48px" }}
      >
        {dynastyOrder.map((dynasty) => {
          const count = counts.get(dynasty) || 0;
          const isMajor = majorDynasties.has(dynasty);
          const isHovered = hoveredDynasty === dynasty;
          const show = isMajor || count > 0;

          return (
            <div
              key={dynasty}
              className="flex flex-col items-center cursor-default"
              onPointerEnter={(e) => handlePointerEnter(dynasty, e)}
              onPointerLeave={() => setHoveredDynasty(null)}
              style={{
                opacity: show || isHovered ? 1 : 0.25,
                width: isMajor ? 56 : 28,
                flexShrink: 0,
              }}
            >
              <span
                className="whitespace-nowrap"
                style={{
                  color: isHovered
                    ? "var(--color-text-primary)"
                    : count > 0
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                  fontFamily: "var(--font-serif-cn)",
                  fontSize: isMajor ? "14px" : "12px",
                  transition: "color 0.2s",
                }}
              >
                {dynasty}
              </span>

              {/* Timeline dot */}
              <div
                className="rounded-full"
                style={{
                  marginTop: "6px",
                  width: count > 0 ? 6 : 3,
                  height: count > 0 ? 6 : 3,
                  background: isHovered
                    ? "var(--color-text-primary)"
                    : count > 0
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                  opacity: count > 0 || isHovered ? 1 : 0.3,
                  transition: "background 0.2s, opacity 0.2s",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Tooltip — fixed position, not inside the flex row */}
      {hoveredDynasty && hoveredInfo && (
        <div
          className="pointer-events-none"
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translateX(-50%)",
            background: "rgba(18, 18, 18, 0.96)",
            border: "1px solid rgba(107, 100, 89, 0.35)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            padding: "14px 18px",
            zIndex: 200,
            whiteSpace: "nowrap",
          }}
        >
          <p
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-serif-cn)",
              fontSize: "15px",
              fontWeight: 500,
              marginBottom: "4px",
            }}
          >
            {hoveredDynasty}
            {locale === "en" && (
              <span style={{ marginLeft: "8px", opacity: 0.6, fontWeight: 400 }}>
                {hoveredInfo.en}
              </span>
            )}
          </p>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "12px",
            }}
          >
            {hoveredInfo.years}
          </p>
          {hoveredCount > 0 && (
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {locale === "zh"
                ? `${hoveredCount} 种传统色`
                : `${hoveredCount} traditional color${hoveredCount > 1 ? "s" : ""}`}
            </p>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Mood anchors — single row with subtle colored underlines
 * to visually connect each label to its color cluster.
 */
function MoodAnchors({
  locale,
  colors,
  w,
}: {
  locale: string;
  colors: TraditionalColor[];
  w: number;
}) {
  const moods = ["威严", "温润", "庄重", "空灵", "深沉", "喜庆", "雅致", "天然"];

  // Compute average color per mood for the accent underline
  const moodColors = useMemo(() => {
    const result = new Map<string, string>();
    for (const mood of moods) {
      const moodColorList = colors.filter((c) => c.moods[0] === mood);
      if (moodColorList.length > 0) {
        // Average RGB
        let r = 0, g = 0, b = 0;
        for (const c of moodColorList) {
          r += c.rgb[0];
          g += c.rgb[1];
          b += c.rgb[2];
        }
        const n = moodColorList.length;
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        result.set(mood, `rgb(${r},${g},${b})`);
      } else {
        result.set(mood, "var(--color-text-muted)");
      }
    }
    return result;
  }, [colors]);

  return (
    <div className="flex justify-center select-none" style={{ gap: "32px", padding: "0 48px" }}>
      {moods.map((mood) => {
        const accentColor = moodColors.get(mood) || "var(--color-text-muted)";
        return (
          <div key={mood} className="flex flex-col items-center">
            <span
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-serif-cn)",
                fontSize: "14px",
                letterSpacing: "0.05em",
              }}
            >
              {mood}
            </span>
            {locale === "en" && moodInfo[mood] && (
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "11px",
                  marginTop: "2px",
                  opacity: 0.6,
                }}
              >
                {moodInfo[mood].en}
              </span>
            )}
            {/* Colored accent dot showing the mood's average color */}
            <div
              style={{
                width: 20,
                height: 3,
                borderRadius: 2,
                marginTop: "6px",
                background: accentColor,
                opacity: 0.7,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
