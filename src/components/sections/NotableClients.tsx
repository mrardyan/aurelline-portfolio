import { motion } from 'motion/react'
import type { Client } from '@/types/content'

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const clientVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
}

interface NotableClientsProps {
  clients: Client[]
}

export function NotableClients({ clients }: NotableClientsProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex flex-col justify-between"
          >
            <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase">
              Notable Clients
            </p>
            <p className="font-['Open_Sans',sans-serif] text-[14px] text-foreground mt-4 md:mt-0">
              Trusted by 100+ brands from various industries
            </p>
          </motion.div>
          <div className="p-4 xl:p-10 h-full">
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 sm:gap-2 items-center justify-items-center h-fit md:h-full"
            >
              {clients.map((client) => (
                <motion.div
                  key={client.name}
                  variants={clientVariants}
                  className="flex items-center justify-center cursor-default h-auto md:h-full w-full"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-auto object-contain transition-all dark:brightness-0 dark:invert dark:opacity-70 select-none user-select-none pointer-events-none"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
