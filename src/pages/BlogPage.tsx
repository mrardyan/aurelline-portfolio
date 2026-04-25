import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'

export function BlogPage() {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined)

  useEffect(() => {
    cms.getPosts().then(setPosts)
  }, [])

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-10 text-foreground">
        Blog
      </h1>
      {posts === undefined ? (
        <p className="font-['Open_Sans',sans-serif] text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="font-['Open_Sans',sans-serif] text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="border border-border p-6">
              <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] mb-2 text-foreground">
                {post.title}
              </h2>
              <p className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground mb-2">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-[15px] text-foreground/80">{post.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
