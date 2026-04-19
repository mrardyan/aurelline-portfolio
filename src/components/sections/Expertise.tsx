import { motion } from 'motion/react'

interface ExpertiseProps {
  imageSrc: string
}

export function Expertise({ imageSrc }: ExpertiseProps) {
  return (
    <section id="expertise" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex items-end"
          >
            <div className="relative w-full aspect-video">
              <img
                alt="Brand Strategy"
                className="w-full h-full object-cover transition-all duration-700 select-none user-select-none pointer-events-none"
                src={imageSrc}
                draggable="false"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-10 flex items-end"
          >
            <p className="font-['DM_Sans',sans-serif] text-[28px] md:text-[40px] leading-[1.2] text-foreground">
              Building consumer brands through{' '}
              <span className="underline decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                content, KOL & growth strategy
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
