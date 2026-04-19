import { useOnceInView } from '@/hooks/useOnceInView'
import type { Testimonial } from '@/types/content'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [headingRef, headingInView] = useOnceInView<HTMLDivElement>(0.3)
  const [gridRef, gridInView] = useOnceInView<HTMLDivElement>(0.05)

  return (
    <section id="testimonials" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <div
          ref={headingRef}
          className={`mb-10 ${headingInView ? 'anim-fade-in-up' : 'opacity-0'}`}
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            What clients say
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`border border-border p-6 md:p-8 bg-card transition-colors hover:bg-accent/5 shadow-sm ${gridInView ? 'anim-fade-in-up' : 'opacity-0'}`}
              style={gridInView ? { animationDelay: `${0.2 + index * 0.15}s` } : undefined}
            >
              <p className="font-['Open_Sans',sans-serif] text-[14px] md:text-[15px] leading-[1.7] text-foreground/90 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-['DM_Sans',sans-serif] font-semibold text-[15px] text-foreground">
                  {testimonial.author}
                </p>
                <p className="font-['Open_Sans',sans-serif] text-[13px] text-muted-foreground/80 mt-1">
                  {testimonial.role}
                </p>
                <p className="font-['Open_Sans',sans-serif] text-[12px] text-muted-foreground/60 mt-0.5">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
