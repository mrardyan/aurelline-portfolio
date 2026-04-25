import { useEffect, useState, useMemo, Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { cms } from '@/lib/cms'
import type { Homepage, CaseStudy } from '@/types/content'
import { PageLoader } from '@/components/PageLoader'
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([cms.getHomepage(), cms.getCaseStudies()]).then(([hp, cs]) => {
      setHomepage(hp)
      setCaseStudies(cs)

      if (!hp) {
        setIsLoading(false)
        return
      }

      const imageUrls = [
        hp.about?.photo,
        hp.expertise?.image,
        ...hp.clients.map((c) => c.logo),
      ].filter(Boolean) as string[]

      if (imageUrls.length === 0) {
        setIsLoading(false)
        return
      }

      Promise.all(
        imageUrls.map(
          (url) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.onload = () => resolve()
              img.onerror = () => resolve()
              img.src = url
            })
        )
      ).then(() => setIsLoading(false))
    })
  }, [])

  const sectionMap = useMemo<Record<string, React.ReactNode>>(() => {
    if (!homepage) return {}
    return {
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
  }, [homepage, caseStudies])

  if (!homepage) {
    return <PageLoader isVisible />
  }

  const order = homepage.sectionOrder?.length ? homepage.sectionOrder : DEFAULT_SECTION_ORDER

  const seoTitle = homepage.seo?.title ?? 'Rare — Brand & Content Strategist'
  const seoDescription = homepage.seo?.description ?? ''
  const seoImage = homepage.seo?.ogImage ?? ''

  return (
    <>
      <PageLoader isVisible={isLoading} />
      <Helmet>
        <title>{seoTitle}</title>
        {homepage.seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}
        {seoDescription && <meta name="description" content={seoDescription} />}
        <meta property="og:title" content={seoTitle} />
        {seoDescription && <meta property="og:description" content={seoDescription} />}
        {seoImage && <meta property="og:image" content={seoImage} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content={seoImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={seoTitle} />
        {seoDescription && <meta name="twitter:description" content={seoDescription} />}
        {seoImage && <meta name="twitter:image" content={seoImage} />}
      </Helmet>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero
            scrollToSection={scrollToSection}
            headline={homepage.hero.headline}
            subtext={homepage.hero.subtext}
            ctaLabel={homepage.hero.ctaLabel}
          />
          {order.map((section) => sectionMap[section] ?? null)}
          <Footer scrollToSection={scrollToSection} contact={homepage.contact} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  )
}
