import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { CaseStudy } from '@/types/content'

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

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
        {caseStudy.title}
      </h1>
      <p className="font-['DM_Sans',sans-serif] text-muted-foreground mb-2">{caseStudy.category}</p>
      <p className="font-['DM_Sans',sans-serif] font-medium text-primary mb-6">{caseStudy.metrics}</p>
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80">{caseStudy.desc}</p>
    </div>
  )
}
