"use client";

import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export function Footer({ scrollToSection }: FooterProps) {
  return (
    <section id="contact" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex flex-col justify-between"
          >
            <motion.p
              onClick={() => scrollToSection("home")}
              className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-pointer text-foreground"
            >
              rare
            </motion.p>
            <div className="flex justify-between items-end">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="group relative overflow-hidden px-6 py-2 h-auto font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-none w-full md:w-auto transition-all duration-300"
                >
                  <div className="relative flex flex-col items-center">
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-[150%]">
                      Contact
                    </span>
                    <span className="absolute inline-block translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                      Contact
                    </span>
                  </div>
                </Button>
              </motion.div>

              <div className="flex gap-6">
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="transition-colors hover:text-primary text-foreground"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="transition-colors hover:text-primary text-foreground"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
          <div className="p-6 md:p-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="font-['DM_Sans',sans-serif] text-[16px] md:text-[18px] text-muted-foreground mb-4">
                Let's craft a rare journey for your brand.
              </p>
              <span>
                <a
                  href="mailto:hello@rare.studio"
                  className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline inline-flex items-center gap-2 group"
                >
                  hello@rare.studio
                  <ExternalLink size={20} />
                </a>
              </span>
              <p className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground mt-6">
                © 2026 Rare. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
