"use client";

import { motion } from "motion/react";

interface AboutProps {
  imageSrc: string;
}

export function About({ imageSrc }: AboutProps) {
  return (
    <section id="about" className="border-b border-border bg-background overflow-hidden">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <img
                alt="Rare - Brand Manager"
                className="w-full h-full sm:min-h-[300px] object-cover transition-all duration-500 select-none user-select-none pointer-events-none"
                src={imageSrc}
                draggable="false"
              />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 md:p-10 flex items-center"
          >
            <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[22px] leading-[1.6] text-foreground">
              I'm Rare, a{" "}
              <span className="underline decoration-solid decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                brand & marketing manager
              </span>{" "}
              working at the intersection of brand strategy,
              content, and growth. I specialize in turning
              creative concepts into high-impact campaigns,
              from high-end production and event orchestration
              to strategic KOL management.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
