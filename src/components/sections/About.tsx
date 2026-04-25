import { motion } from 'motion/react'
import { PortableText } from '@portabletext/react'
import type { ComponentProps } from 'react'

type PortableTextValue = ComponentProps<typeof PortableText>['value']

const bioComponents: ComponentProps<typeof PortableText>['components'] = {
  block: {
    normal: ({ children }) => (
      <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[22px] leading-[1.6] text-foreground">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    underline: ({ children }) => (
      <span className="underline decoration-solid decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
        {children}
      </span>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-primary"
      >
        {children}
      </a>
    ),
  },
}

interface AboutProps {
  bio: unknown
  photo: string
}

export function About({ bio, photo }: AboutProps) {
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
            <div className="relative w-full h-full">
              {photo && (
                <img
                  alt="Rare - Brand Manager"
                  className="w-full h-full sm:min-h-[300px] object-cover transition-all duration-500 select-none user-select-none pointer-events-none"
                  src={photo}
                  draggable="false"
                />
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 md:p-10 flex items-center"
          >
            <div>
              <PortableText value={bio as PortableTextValue} components={bioComponents} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
