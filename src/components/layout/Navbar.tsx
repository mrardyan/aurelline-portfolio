import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  scrollToSection: (id: string) => void
}

export function Navbar({ scrollToSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false)
    scrollToSection(id)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, staggerChildren: 0.1, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <nav className="relative h-full">
      {/* Desktop Navigation */}
      <motion.div
        className="hidden h-full md:flex flex-col justify-between items-end"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-4 items-end">
          {(['works', 'about', 'testimonials'] as const).map((id) => (
            <motion.button
              key={id}
              variants={itemVariants}
              onClick={() => handleScroll(id)}
              className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase transition-colors hover:text-primary"
            >
              {id}
            </motion.button>
          ))}
          <motion.div variants={itemVariants} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => handleScroll('contact')}
              className="group relative overflow-hidden px-4 py-1 h-auto font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-none transition-all duration-300"
            >
              <div className="relative flex flex-col items-center">
                <motion.span className="inline-block transition-transform duration-300 group-hover:-translate-y-[150%]">
                  Contact
                </motion.span>
                <motion.span className="absolute inline-block translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                  Contact
                </motion.span>
              </div>
            </Button>
          </motion.div>
        </div>
        <motion.div variants={itemVariants}>
          <ModeToggle />
        </motion.div>
      </motion.div>

      {/* Mobile */}
      <motion.div
        className="md:hidden flex items-center justify-end w-full gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ModeToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-accent transition-colors rounded text-foreground"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full right-0 w-[200px] border border-border bg-background shadow-xl z-50 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-6">
              {(['works', 'about', 'testimonials'] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase text-left hover:text-primary transition-colors"
                >
                  {id}
                </button>
              ))}
              <Button
                variant="outline"
                onClick={() => handleScroll('contact')}
                className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none w-full"
              >
                Contact
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
