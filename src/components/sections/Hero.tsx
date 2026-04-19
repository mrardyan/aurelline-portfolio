import { motion, useScroll, useTransform } from 'motion/react'
import { Navbar } from '@/components/layout/Navbar'

interface HeroProps {
  scrollToSection: (id: string) => void
}

export function Hero({ scrollToSection }: HeroProps) {
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
            <motion.p className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-default text-foreground">
              rare
            </motion.p>
            <motion.p
              style={{ opacity }}
              className="font-['DM_Sans',sans-serif] font-medium text-[32px] md:text-[48px] leading-[1.1] text-brand-purple"
            >
              between viral moments and brand growth.
            </motion.p>
          </motion.div>
          <div className="h-fit md:h-full px-8 md:p-10 flex flex-col items-end justify-between">
            <Navbar scrollToSection={scrollToSection} />
          </div>
        </div>
      </div>
    </section>
  )
}
