import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'

export function BlogPage() {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    cms.getPosts().then(setPosts)
  }, [])

  if (posts === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">No posts yet.</p>
      </div>
    )
  }

  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-background max-w-site-container mx-auto">
      {/* Page header */}
      <div className="px-6 md:px-10 pt-10 pb-6 border-b border-border">
        <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[40px] tracking-tight text-foreground">
          Blog
        </h1>
      </div>

      {/* Featured post */}
      <div
        className="flex flex-col md:flex-row px-6 md:px-10 py-8 md:py-10 border-b border-border cursor-pointer group"
        onClick={() => navigate(`/blog/${featured.slug}`)}
      >
        <div className="flex-1 md:pr-10 flex flex-col justify-center">
          <span className="font-['DM_Sans',sans-serif] text-[11px] font-bold uppercase tracking-[1.5px] text-brand-purple mb-3">
            Latest Post
          </span>
          <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] md:text-[26px] leading-[1.25] tracking-tight mb-3 text-foreground group-hover:opacity-75 transition-opacity">
            {featured.title}
          </h2>
          {featured.excerpt && (
            <p className="font-['Open_Sans',sans-serif] text-[15px] leading-[1.65] text-foreground/60 mb-4">
              {featured.excerpt}
            </p>
          )}
          <span className="font-['DM_Sans',sans-serif] text-[12px] uppercase tracking-[0.8px] text-muted-foreground">
            {featured.category ? `${featured.category} · ` : ''}
            {new Date(featured.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {featured.coverImage ? (
          <img
            src={featured.coverImage}
            alt={featured.title}
            className="w-full md:w-[280px] h-[180px] md:h-auto object-cover flex-shrink-0 mt-6 md:mt-0"
          />
        ) : (
          <div className="w-full md:w-[280px] h-[180px] md:h-[200px] bg-accent flex-shrink-0 mt-6 md:mt-0" />
        )}
      </div>

      {/* Post grid */}
      {rest.length > 0 && (
        <div className="px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {rest.map((post, i) => {
              const isLastRow = i >= rest.length - (rest.length % 2 === 0 ? 2 : 1)
              return (
                <div
                  key={post.slug}
                  className={[
                    'py-6 cursor-pointer group',
                    i % 2 === 0 ? `md:pr-8 ${!isLastRow ? 'md:border-r md:border-border' : ''}` : 'md:pl-8',
                    !isLastRow ? 'border-b border-border' : '',
                  ].join(' ')}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.category && (
                    <span className="font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground block mb-2">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[15px] leading-[1.35] mb-2 text-foreground group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-['Open_Sans',sans-serif] text-[13px] leading-[1.55] text-foreground/60 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="font-['DM_Sans',sans-serif] text-[11px] text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
