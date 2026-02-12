"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TraditionalColor } from "@/lib/types";
import { getContrastText, findSimilarColors, dynastyInfo, moodInfo } from "@/lib/colorUtils";
import { useAppStore } from "@/lib/store";

interface ColorDetailProps {
  color: TraditionalColor;
  allColors: TraditionalColor[];
}

export default function ColorDetail({ color, allColors }: ColorDetailProps) {
  const selectColor = useAppStore((s) => s.selectColor);
  const addToPalette = useAppStore((s) => s.addToPalette);
  const locale = useAppStore((s) => s.locale);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const similar = findSimilarColors(color, allColors, 4);
  const textColor = getContrastText(color.hex);

  const copyValue = useCallback(
    async (value: string, field: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
      } catch {
        // Fallback for older browsers
      }
    },
    []
  );

  const copyAll = useCallback(async () => {
    const data = {
      name: color.name,
      pinyin: color.pinyin,
      hex: color.hex,
      rgb: `rgb(${color.rgb.join(", ")})`,
      hsl: `hsl(${color.hsl[0]}deg, ${color.hsl[1]}%, ${color.hsl[2]}%)`,
      cmyk: color.cmyk.join(", "),
    };
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 1500);
  }, [color]);

  const colorValues = [
    { label: "HEX", value: color.hex, copyVal: color.hex },
    {
      label: "RGB",
      value: color.rgb.join(", "),
      copyVal: `rgb(${color.rgb.join(", ")})`,
    },
    {
      label: "HSL",
      value: `${color.hsl[0]}°, ${color.hsl[1]}%, ${color.hsl[2]}%`,
      copyVal: `hsl(${color.hsl[0]}deg, ${color.hsl[1]}%, ${color.hsl[2]}%)`,
    },
    {
      label: "CMYK",
      value: color.cmyk.join(", "),
      copyVal: color.cmyk.join(", "),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={() => selectColor(null)}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Detail card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-[101] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--color-bg-secondary)",
          width: "min(90vw, 480px)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Color swatch header */}
        <div
          className="relative flex items-end shrink-0"
          style={{
            background: color.hex,
            padding: "28px 28px 20px 28px",
            minHeight: "120px",
          }}
        >
          <div>
            <h2
              className="font-bold"
              style={{
                color: textColor,
                fontFamily: "var(--font-serif-cn)",
                fontSize: "28px",
                lineHeight: 1.2,
              }}
            >
              {color.name}
            </h2>
            <p style={{ color: textColor, opacity: 0.8, fontSize: "14px", marginTop: "6px" }}>
              {color.pinyin}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Tags */}
          <div className="flex flex-wrap" style={{ gap: "8px" }}>
            {color.dynasties.map((d) => (
              <span
                key={d}
                className="rounded-full"
                style={{
                  padding: "5px 14px",
                  fontSize: "12px",
                  border: "1px solid rgba(107, 100, 89, 0.4)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {d}
                {locale === "en" && dynastyInfo[d] && (
                  <span style={{ marginLeft: "4px", opacity: 0.6 }}>{dynastyInfo[d].en}</span>
                )}
              </span>
            ))}
            {color.moods.map((m) => (
              <span
                key={m}
                className="rounded-full"
                style={{
                  padding: "5px 14px",
                  fontSize: "12px",
                  background: `${color.hex}20`,
                  color: "var(--color-text-secondary)",
                }}
              >
                {m}
                {locale === "en" && moodInfo[m] && (
                  <span style={{ marginLeft: "4px", opacity: 0.6 }}>{moodInfo[m].en}</span>
                )}
              </span>
            ))}
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-serif-cn)",
            }}
          >
            {locale === "zh" ? color.description : color.descriptionEn}
          </p>

          {/* Color values */}
          <div className="space-y-1.5">
            {colorValues.map(({ label, value, copyVal }) => (
              <div
                key={label}
                className="flex items-center justify-between group/row py-1 px-2 -mx-2 rounded hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-xs font-mono w-12"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
                <span
                  className="text-sm font-mono flex-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {value}
                </span>
                <button
                  onClick={() => copyValue(copyVal, label)}
                  className="opacity-0 group-hover/row:opacity-100 transition-opacity text-xs px-2 py-0.5 rounded
                    hover:bg-white/10"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {copiedField === label ? (
                    <span style={{ color: color.hex }}>
                      {locale === "zh" ? "已复制" : "Copied"}
                    </span>
                  ) : (
                    locale === "zh" ? "复制" : "Copy"
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Copy all */}
          <button
            onClick={copyAll}
            className="w-full rounded-lg hover:bg-white/5 transition-colors"
            style={{
              padding: "10px 0",
              fontSize: "14px",
              border: "1px solid rgba(107, 100, 89, 0.4)",
              color: "var(--color-text-secondary)",
            }}
          >
            {copiedField === "all"
              ? locale === "zh"
                ? "已复制全部"
                : "All Copied"
              : locale === "zh"
                ? "复制全部为 JSON"
                : "Copy All as JSON"}
          </button>

          {/* Similar colors */}
          <div>
            <p
              className="text-xs mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              {locale === "zh" ? "相近色" : "Similar Colors"}
            </p>
            <div className="flex gap-2">
              {similar.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectColor(s.id)}
                  className="group/sim flex flex-col items-center"
                >
                  <div
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: s.hex,
                      boxShadow: `0 2px 8px ${s.hex}40`,
                    }}
                  />
                  <span
                    className="text-[10px] mt-1 opacity-0 group-hover/sim:opacity-100 transition-opacity"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to palette */}
          <button
            onClick={() => addToPalette(color.id)}
            className="w-full py-2.5 text-sm rounded-lg font-medium transition-colors"
            style={{
              background: color.hex,
              color: textColor,
            }}
          >
            {locale === "zh" ? "加入调色板" : "Add to Palette"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
