"use client";

import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useMouse } from "@/hooks/useMouse";
import AmbientBackground from "@/components/AmbientBackground";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import Explorer from "@/components/Explorer";
import PaletteLab from "@/components/PaletteLab";
import colors from "@/data/colors";

export default function Home() {
  const currentView = useAppStore((s) => s.currentView);
  useMouse();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AmbientBackground />
      <Header />

      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <LandingPage key="landing" colors={colors} />
        )}
        {currentView === "explore" && (
          <Explorer key="explore" colors={colors} />
        )}
        {currentView === "palette" && (
          <PaletteLab key="palette" colors={colors} />
        )}
      </AnimatePresence>
    </main>
  );
}
