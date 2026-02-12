"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";

export function useMouse() {
  const setCursorPos = useAppStore((s) => s.setCursorPos);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = {
          x: (e.clientX - lastPosRef.current.x) / dt,
          y: (e.clientY - lastPosRef.current.y) / dt,
        };
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = now;
      setCursorPos(e.clientX, e.clientY);
    },
    [setCursorPos]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return velocityRef;
}
