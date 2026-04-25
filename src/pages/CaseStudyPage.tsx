import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { cms } from '@/lib/cms'
import type { CaseStudy } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { PortableTextValue } from '@/components/PortableTextRenderer'
import { ImageCarousel } from '@/components/ImageCarousel'
import { ImageMasonry } from '@/components/ImageMasonry'

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
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
  const gallery = caseStudy.images && caseStudy.images.length > 0 ? caseStudy.images : null
  const imageLayout = caseStudy.imageLayout ?? 'masonry'

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

      <div className="min-h-screen bg-background">
        {/* Dark hero */}
        <div className="bg-[#0d0d0d] text-white px-6 md:px-10 pt-10 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="font-['DM_Sans',sans-serif] text-[12px] uppercase tracking-[1px] text-[#555] hover:text-[#888] transition-colors mb-6 flex items-center gap-1.5"
          >
            ← Work
          </button>
          {caseStudy.category && (
            <div className="font-['DM_Sans',sans-serif] text-[12px] uppercase tracking-[1.2px] text-[#555] mb-4">
              {caseStudy.category}
            </div>
          )}
          <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[28px] md:text-[36px] leading-[1.2] tracking-tight max-w-[720px] mb-5 text-white">
            {caseStudy.title}
          </h1>
          {caseStudy.desc && (
            <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-[#888] max-w-[600px]">
              {caseStudy.desc}
            </p>
          )}
        </div>

        {/* Cover image — full-width, no padding */}
        {caseStudy.coverImage && (
          <div className="w-full aspect-[16/6] overflow-hidden">
            <img
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover block"
            />
          </div>
        )}

        {/* Metrics bar */}
        {caseStudy.metricItems && caseStudy.metricItems.length > 0 && (
          <div className="bg-[#161616] px-6 md:px-10 py-6 flex flex-wrap gap-10 border-t border-[#1e1e1e]">
            {caseStudy.metricItems.map((item, i) => (
              <div key={i}>
                <div className="font-['DM_Sans',sans-serif] text-[26px] font-bold text-white tracking-tight leading-none">
                  {item.value}
                </div>
                <div className="font-['DM_Sans',sans-serif] text-[11px] uppercase tracking-[0.8px] text-[#555] mt-1.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reading body */}
        <div className="max-w-[720px] mx-auto px-6 md:px-10 py-14">
          {caseStudy.body && <PortableTextRenderer value={caseStudy.body as PortableTextValue} />}
        </div>

        {/* Gallery */}
        {gallery && (
          <div className={imageLayout === 'carousel' ? 'pb-14' : 'max-w-[720px] mx-auto px-6 md:px-10 pb-14'}>
            {imageLayout === 'carousel' ? (
              <ImageCarousel images={gallery} alt={caseStudy.title} />
            ) : (
              <ImageMasonry images={gallery} alt={caseStudy.title} />
            )}
          </div>
        )}
      </div>
    </>
  )
}
