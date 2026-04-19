"use client";

import { motion, AnimatePresence } from "motion/react";
import { useThemeTransition } from "./theme-transition-context";

export function ThemeTransitionOverlay() {
  const { isTransitioning, transitionColors } = useThemeTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ 
            duration: 0.6, 
            ease: [0.77, 0, 0.175, 1] 
          }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
          style={{ 
            willChange: "transform",
            backgroundColor: transitionColors.bg
          }}
        >
          <div className="h-[100px] overflow-hidden flex items-center justify-center [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: ["100%", "0%", "0%", "-100%"]
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.6,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut"
              }}
              className="flex flex-col items-center"
            >
              <p 
                className="font-['DM_Serif_Display',serif] text-[48px] md:text-[64px]"
                style={{ color: transitionColors.logo }}
              >
                rare
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
