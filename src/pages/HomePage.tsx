import { useEffect, useState, Fragment } from 'react'
import { cms } from '@/lib/cms'
import type { Homepage, CaseStudy } from '@/types/content'
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

const DEFAULT_SECTION_ORDER = ['about', 'clients', 'expertise', 'caseStudies', 'testimonials', 'services']

export function HomePage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null)
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    Promise.all([cms.getHomepage(), cms.getCaseStudies()]).then(([hp, cs]) => {
      setHomepage(hp)
      setCaseStudies(cs)
    })
  }, [])

  if (!homepage) {
    return <div className="min-h-screen bg-background" />
  }

  const order = homepage.sectionOrder?.length ? homepage.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionMap: Record<string, React.ReactNode> = {
    about: <About key="about" bio={homepage.about.bio} photo={homepage.about.photo} />,
    clients: <NotableClients key="clients" clients={homepage.clients} />,
    expertise: (
      <Fragment key="expertise">
        <Expertise image={homepage.expertise.image} title={homepage.expertise.title} />
        <Works categories={homepage.expertise.categories} />
      </Fragment>
    ),
    caseStudies: <CaseStudies key="caseStudies" caseStudies={caseStudies} />,
    testimonials: <Testimonials key="testimonials" testimonials={homepage.testimonials} />,
    services: <Services key="services" services={homepage.services} />,
  }

  return (
    <>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero
            scrollToSection={scrollToSection}
            headline={homepage.hero.headline}
          />
          {order.map((section) => sectionMap[section] ?? null)}
          <Footer scrollToSection={scrollToSection} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  )
}
