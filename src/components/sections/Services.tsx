import { motion } from 'motion/react'
import type { Service } from '@/types/content'

interface ServicesProps {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            Services
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border"
        >
          {services.map((service, index) => {
            const total = services.length
            const isLastMobile = index === total - 1
            const isLastTablet = index >= total - (total % 2 === 0 ? 2 : total % 2)
            const isLastDesktop = index >= total - (total % 3 === 0 ? 3 : total % 3)
            const mobileBorderClass = isLastMobile ? 'border-b-0' : 'border-b'
            const tabletBorderClass = isLastTablet ? 'sm:border-b-0' : 'sm:border-b'
            const desktopBorderClass = isLastDesktop ? 'lg:border-b-0' : 'lg:border-b'

            return (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
                }}
                className={`
                  p-6 md:p-8 transition-colors hover:bg-brand-purple/5 border-border
                  border-r-0
                  sm:border-r sm:[&:nth-child(2n)]:border-r-0
                  lg:border-r lg:[&:nth-child(3n)]:border-r-0
                  lg:[&:nth-child(2n)]:border-r
                  ${mobileBorderClass} ${tabletBorderClass} ${desktopBorderClass}
                `}
              >
                <h4 className="font-['DM_Sans',sans-serif] font-semibold text-[18px] md:text-[20px] mb-4 text-foreground">
                  {service.title}
                </h4>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
