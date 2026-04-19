import { motion } from 'motion/react'
import type { WorkCategory } from '@/types/content'

interface WorksProps {
  categories: WorkCategory[]
}

export function Works({ categories }: WorksProps) {
  return (
    <section id="works" className="border-b border-border bg-background w-full overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-border flex md:justify-end">
          <div className="w-full md:max-w-site-column p-6 md:p-10 flex md:justify-start">
            <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase">
              WORKS
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              initial="initial"
              whileHover="hover"
              className="relative border-b last:border-b-0 border-border w-full flex justify-start transition-all overflow-hidden hover:text-foreground hover:bg-accent/10 select-none group"
            >
              <div className="w-full md:max-w-site-column px-8 md:px-20 py-8 md:py-12">
                <div className="relative h-[60px] md:h-[80px] flex items-center overflow-hidden">
                  <motion.div
                    variants={{ initial: { y: 0, opacity: 1 }, hover: { y: -100, opacity: 0 } }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full"
                  >
                    <p className="font-['DM_Sans',sans-serif] font-medium text-[24px] md:text-[32px] leading-[1.2]">
                      {category.title}
                    </p>
                  </motion.div>
                  <motion.div
                    variants={{ initial: { y: 100, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex items-center"
                  >
                    <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[20px] leading-[1.5] text-foreground/80 max-w-[90%]">
                      {category.desc}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
