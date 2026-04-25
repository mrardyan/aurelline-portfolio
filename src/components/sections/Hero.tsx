import { motion, useScroll, useTransform } from 'motion/react'
import { Navbar } from '@/components/layout/Navbar'

interface HeroProps {
  scrollToSection: (id: string) => void
  headline: string
  subtext?: string
  ctaLabel?: string
}

export function Hero({ scrollToSection, headline, subtext, ctaLabel }: HeroProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section id="home" className="relative border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="border-r-0 md:border-r border-border p-8 md:p-10 flex flex-col gap-12 md:gap-20"
          >
            <p className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-default text-foreground">
              rare
            </p>
            <motion.p
              style={{ opacity }}
              className="font-['DM_Sans',sans-serif] font-medium text-[32px] md:text-[48px] leading-[1.1] text-brand-purple"
            >
              {headline}
            </motion.p>
            {subtext && (
              <p className="font-['DM_Sans',sans-serif] text-[16px] md:text-[18px] leading-[1.6] text-foreground/70">
                {subtext}
              </p>
            )}
            {ctaLabel && (
              <button
                onClick={() => scrollToSection('about')}
                className="font-['DM_Sans',sans-serif] font-medium text-[14px] tracking-[0.5px] uppercase text-brand-purple border border-brand-purple px-5 py-2 w-fit hover:bg-brand-purple hover:text-white transition-colors duration-200"
              >
                {ctaLabel}
              </button>
            )}
          </motion.div>
          <div className="h-fit md:h-full px-8 md:p-10 flex flex-col items-end justify-between">
            <Navbar scrollToSection={scrollToSection} />
          </div>
        </div>
      </div>
    </section>
  )
}
