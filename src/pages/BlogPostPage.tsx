import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { PortableTextValue } from '@/components/PortableTextRenderer'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null | undefined>(undefined)

  useEffect(() => {
    if (slug) cms.getPost(slug).then(setPost)
  }, [slug])

  if (post === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (post === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Post not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <p className="font-['Open_Sans',sans-serif] text-[13px] text-muted-foreground mb-4">
        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-6 text-foreground">
        {post.title}
      </h1>
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-10">
        {post.excerpt}
      </p>
      {post.body && (
        <div className="border-t border-border pt-10">
          <PortableTextRenderer value={post.body as PortableTextValue} />
        </div>
      )}
    </div>
  )
}
