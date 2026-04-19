import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Work } from '@/types/content'

export function WorkPage() {
  const { slug } = useParams<{ slug: string }>()
  const [work, setWork] = useState<Work | null | undefined>(undefined)

  useEffect(() => {
    if (slug) cms.getWork(slug).then(setWork)
  }, [slug])

  if (work === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (work === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Work not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
        {work.title}
      </h1>
      <p className="font-['DM_Sans',sans-serif] text-muted-foreground">{work.category}</p>
    </div>
  )
}
