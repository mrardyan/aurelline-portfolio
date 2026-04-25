import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { PortableTextValue } from '@/components/PortableTextRenderer'
import { ImageCarousel } from '@/components/ImageCarousel'
import { ImageMasonry } from '@/components/ImageMasonry'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
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

  const seoTitle = post.seo?.title ?? `${post.title} — Rare`
  const seoDescription = post.seo?.description ?? post.excerpt
  const seoImage = post.seo?.ogImage ?? ''
  const gallery = post.images && post.images.length > 0 ? post.images : null
  const imageLayout = post.imageLayout ?? 'masonry'

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        {post.seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}
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
            onClick={() => navigate('/blog')}
            className="font-['DM_Sans',sans-serif] text-[12px] uppercase tracking-[1px] text-[#555] hover:text-[#888] transition-colors mb-6 flex items-center gap-1.5"
          >
            ← Blog
          </button>
          <div className="font-['DM_Sans',sans-serif] text-[12px] uppercase tracking-[1.2px] text-[#555] mb-4">
            {post.category ? `${post.category} · ` : ''}
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[28px] md:text-[36px] leading-[1.2] tracking-tight max-w-[720px] mb-5 text-white">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-[#888] max-w-[600px]">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Cover image — full-width, no padding */}
        {post.coverImage && (
          <div className="w-full aspect-[16/6] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover block"
            />
          </div>
        )}

        {/* Reading body */}
        <div className="max-w-[720px] mx-auto px-6 md:px-10 py-14">
          {!!post.body && <PortableTextRenderer value={post.body as PortableTextValue} />}
        </div>

        {/* Gallery */}
        {gallery && (
          <div className={imageLayout === 'carousel' ? 'pb-14' : 'max-w-[720px] mx-auto px-6 md:px-10 pb-14'}>
            {imageLayout === 'carousel' ? (
              <ImageCarousel images={gallery} alt={post.title} />
            ) : (
              <ImageMasonry images={gallery} alt={post.title} />
            )}
          </div>
        )}
      </div>
    </>
  )
}
