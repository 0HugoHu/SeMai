"use client";

import { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { TraditionalColor } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { getContrastText } from "@/lib/colorUtils";

interface PaletteLabProps {
  colors: TraditionalColor[];
}

export default function PaletteLab({ colors }: PaletteLabProps) {
  const palette = useAppStore((s) => s.palette);
  const removeFromPalette = useAppStore((s) => s.removeFromPalette);
  const clearPalette = useAppStore((s) => s.clearPalette);
  const addToPalette = useAppStore((s) => s.addToPalette);
  const locale = useAppStore((s) => s.locale);
  const [copiedExport, setCopiedExport] = useState<string | null>(null);

  const paletteColors = useMemo(
    () =>
      palette
        .map((p) => colors.find((c) => c.id === p.colorId))
        .filter(Boolean) as TraditionalColor[],
    [palette, colors]
  );

  // Find complementary suggestions
  const suggestions = useMemo(() => {
    if (paletteColors.length === 0) return colors.slice(0, 12);
    // Find colors that are distant from current palette
    const paletteHues = paletteColors.map((c) => c.hsl[0]);
    return colors
      .filter((c) => !palette.some((p) => p.colorId === c.id))
      .sort((a, b) => {
        const aMinDist = Math.min(
          ...paletteHues.map((h) => Math.abs(((a.hsl[0] - h + 540) % 360) - 180))
        );
        const bMinDist = Math.min(
          ...paletteHues.map((h) => Math.abs(((b.hsl[0] - h + 540) % 360) - 180))
        );
        return bMinDist - aMinDist;
      })
      .slice(0, 12);
  }, [paletteColors, palette, colors]);

  const exportJSON = useCallback(async () => {
    const data = paletteColors.map((c) => ({
      name: c.name,
      pinyin: c.pinyin,
      hex: c.hex,
      rgb: `rgb(${c.rgb.join(", ")})`,
    }));
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedExport("json");
    setTimeout(() => setCopiedExport(null), 1500);
  }, [paletteColors]);

  const exportCSS = useCallback(async () => {
    const css = paletteColors
      .map((c) => `  --${c.id}: ${c.hex};`)
      .join("\n");
    await navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedExport("css");
    setTimeout(() => setCopiedExport(null), 1500);
  }, [paletteColors]);

  const exportTailwind = useCallback(async () => {
    const tw = paletteColors.reduce(
      (acc, c) => {
        acc[c.id] = c.hex;
        return acc;
      },
      {} as Record<string, string>
    );
    const config = `// tailwind.config.js colors\n${JSON.stringify(tw, null, 2)}`;
    await navigator.clipboard.writeText(config);
    setCopiedExport("tw");
    setTimeout(() => setCopiedExport(null), 1500);
  }, [paletteColors]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-10 flex"
      style={{ paddingTop: "80px" }}
    >
      {/* Sidebar: color picker */}
      <div
        className="h-full overflow-y-auto border-r"
        style={{
          width: "280px",
          flexShrink: 0,
          padding: "24px",
          borderColor: "rgba(107, 100, 89, 0.2)",
          background: "rgba(10, 10, 10, 0.5)",
        }}
      >
        <h3
          className="tracking-wider"
          style={{ color: "var(--color-text-muted)", fontSize: "13px", marginBottom: "16px" }}
        >
          {locale === "zh" ? "选择颜色" : "Pick Colors"}
        </h3>
        <div className="grid grid-cols-4" style={{ gap: "10px" }}>
          {suggestions.map((color) => (
            <button
              key={color.id}
              onClick={() => addToPalette(color.id)}
              className="group relative"
              title={color.name}
            >
              <div
                className="w-full aspect-square rounded-lg transition-transform hover:scale-110"
                style={{
                  background: color.hex,
                  boxShadow: `0 2px 6px ${color.hex}30`,
                }}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--color-text-secondary)", bottom: "-16px" }}
              >
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col" style={{ padding: "24px 40px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "28px" }}>
          <h2
            className="text-lg tracking-wider"
            style={{ fontFamily: "var(--font-serif-cn)" }}
          >
            {locale === "zh" ? "调色板" : "Palette Lab"}
          </h2>
          {paletteColors.length > 0 && (
            <button
              onClick={clearPalette}
              className="rounded hover:bg-white/5 transition-colors"
              style={{
                fontSize: "12px",
                padding: "6px 16px",
                border: "1px solid rgba(107, 100, 89, 0.4)",
                color: "var(--color-text-muted)",
              }}
            >
              {locale === "zh" ? "清空" : "Clear"}
            </button>
          )}
        </div>

        {/* Palette slots */}
        <div className="flex" style={{ gap: "14px", marginBottom: "32px" }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const color = paletteColors[i];
            return (
              <motion.div
                key={i}
                layout
                className="flex-1 aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden"
                style={{
                  borderColor: color ? "transparent" : "rgba(107, 100, 89, 0.2)",
                  background: color ? color.hex : "transparent",
                }}
              >
                {color && (
                  <>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: getContrastText(color.hex),
                        fontFamily: "var(--font-serif-cn)",
                      }}
                    >
                      {color.name}
                    </span>
                    <button
                      onClick={() => removeFromPalette(color.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center
                        opacity-0 hover:opacity-100 transition-opacity text-xs"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        color: "#fff",
                      }}
                    >
                      x
                    </button>
                  </>
                )}
                {!color && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Preview strip */}
        {paletteColors.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p
              className="text-xs mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              {locale === "zh" ? "预览" : "Preview"}
            </p>
            {/* Gradient strip */}
            <div
              className="h-16 rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${paletteColors.map((c) => c.hex).join(", ")})`,
              }}
            />
            {/* UI mockup */}
            <div className="flex gap-3 mt-4">
              {paletteColors.slice(0, 4).map((c, i) => (
                <button
                  key={c.id}
                  className="px-4 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: i === 0 ? c.hex : "transparent",
                    color: i === 0 ? getContrastText(c.hex) : c.hex,
                    border: i > 0 ? `1px solid ${c.hex}` : "none",
                  }}
                >
                  {locale === "zh" ? "按钮" : "Button"} {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Export buttons */}
        {paletteColors.length > 0 && (
          <div className="flex gap-3">
            <ExportButton
              label={copiedExport === "json" ? (locale === "zh" ? "已复制" : "Copied") : "JSON"}
              onClick={exportJSON}
            />
            <ExportButton
              label={copiedExport === "css" ? (locale === "zh" ? "已复制" : "Copied") : "CSS"}
              onClick={exportCSS}
            />
            <ExportButton
              label={
                copiedExport === "tw" ? (locale === "zh" ? "已复制" : "Copied") : "Tailwind"
              }
              onClick={exportTailwind}
            />
          </div>
        )}

        {/* Empty state */}
        {paletteColors.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p
              className="text-sm"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-serif-cn)",
              }}
            >
              {locale === "zh"
                ? "从左侧选择颜色，或在探索页面中添加"
                : "Pick colors from the left, or add from the Explorer"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ExportButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg hover:bg-white/5 transition-colors"
      style={{
        padding: "10px 20px",
        fontSize: "13px",
        border: "1px solid rgba(107, 100, 89, 0.4)",
        color: "var(--color-text-secondary)",
      }}
    >
      {label}
    </button>
  );
}
