import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { cms } from '@/lib/cms'
import type { CaseStudy } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { PortableTextValue } from '@/components/PortableTextRenderer'

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null | undefined>(undefined)

  useEffect(() => {
    if (slug) cms.getCaseStudy(slug).then(setCaseStudy)
  }, [slug])

  if (caseStudy === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (caseStudy === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Case study not found.</p>
      </div>
    )
  }

  const seoTitle = caseStudy.seo?.title ?? `${caseStudy.title} — Rare`
  const seoDescription = caseStudy.seo?.description ?? caseStudy.desc
  const seoImage = caseStudy.seo?.ogImage ?? ''

  return (
    <>
    <Helmet>
      <title>{seoTitle}</title>
      {caseStudy.seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}
      {seoDescription && <meta name="description" content={seoDescription} />}
      <meta property="og:title" content={seoTitle} />
      {seoDescription && <meta property="og:description" content={seoDescription} />}
      {seoImage && <meta property="og:image" content={seoImage} />}
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content={seoImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={seoTitle} />
      {seoDescription && <meta name="twitter:description" content={seoDescription} />}
      {seoImage && <meta name="twitter:image" content={seoImage} />}
    </Helmet>
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
        {caseStudy.title}
      </h1>
      <p className="font-['DM_Sans',sans-serif] text-muted-foreground mb-2">{caseStudy.category}</p>
      <p className="font-['DM_Sans',sans-serif] font-medium text-primary mb-6">{caseStudy.metrics}</p>
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-10">
        {caseStudy.desc}
      </p>
      {caseStudy.body && (
        <div className="border-t border-border pt-10">
          <PortableTextRenderer value={caseStudy.body as PortableTextValue} />
        </div>
      )}
      {caseStudy.images && caseStudy.images.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          {caseStudy.images.map((url, i) => (
            <img key={i} src={url} alt={`${caseStudy.title} image ${i + 1}`} className="w-full" />
          ))}
        </div>
      )}
    </div>
    </>
  )
}
