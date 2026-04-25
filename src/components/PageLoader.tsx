import { motion, AnimatePresence } from 'motion/react'

interface PageLoaderProps {
  isVisible: boolean
}

export function PageLoader({ isVisible }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-4"
        >
          <div className="h-[100px] overflow-hidden flex items-center justify-center [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_75%,transparent_100%)]">
            <motion.p
              animate={{ y: ['100%', '0%', '0%', '-100%'] }}
              transition={{
                duration: 1.8,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="font-['DM_Serif_Display',serif] text-[48px] md:text-[64px] leading-none text-brand-purple select-none"
            >
              rare
            </motion.p>
          </div>
          <div className="w-24 h-[1px] bg-border overflow-hidden">
            <motion.div
              className="h-full bg-brand-purple"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
