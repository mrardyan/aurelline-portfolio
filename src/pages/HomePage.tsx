import { SmoothScroll } from '@/components/SmoothScroll'
import { ThemeTransitionOverlay } from '@/components/ThemeTransitionOverlay'
import { CustomCursor } from '@/components/CustomCursor'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { NotableClients } from '@/components/sections/NotableClients'
import { Expertise } from '@/components/sections/Expertise'
import { Works } from '@/components/sections/Works'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { Testimonials } from '@/components/sections/Testimonials'
import { Services } from '@/components/sections/Services'
import { Footer } from '@/components/layout/Footer'
import { scrollToSection } from '@/lib/scrollTo'
import imgPersonal from '@/assets/personal-picture.png'
import imgIllustration from '@/assets/illustration-1.png'
import { clients } from '@/data/clients'
import { caseStudies } from '@/data/caseStudies'
import { testimonials } from '@/data/testimonials'
import { services } from '@/data/services'
import { workCategories } from '@/data/works'

export function HomePage() {
  return (
    <>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero scrollToSection={scrollToSection} />
          <About imageSrc={imgPersonal} />
          <NotableClients clients={clients} />
          <Expertise imageSrc={imgIllustration} />
          <Works categories={workCategories} />
          <CaseStudies caseStudies={caseStudies} />
          <Testimonials testimonials={testimonials} />
          <Services services={services} />
          <Footer scrollToSection={scrollToSection} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  )
}
