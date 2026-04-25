# Blog & Case Study Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the blog list, blog post, and case study pages for readability; add full-width cover image, metrics bar, and per-document image gallery (carousel or masonry) driven by CMS fields.

**Architecture:** Each page gets a dark hero header + centered reading column (max 720px). Two new shared components (`ImageCarousel`, `ImageMasonry`) handle gallery rendering. Gallery mode and all new content fields are authored in Sanity Studio and consumed via updated GROQ queries.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vite, Sanity v3, embla-carousel-react (already installed), react-router v7, lucide-react.

> **No test framework is configured in this project.** Each task uses `bun run dev` + browser visual verification instead of automated tests.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/types/content.ts` | Add `category`, `coverImage`, `images`, `imageLayout` to `Post`; add `coverImage`, `metricItems`, `imageLayout` to `CaseStudy` |
| Modify | `studio/schemaTypes/documents/post.ts` | Add 4 new Sanity fields |
| Modify | `studio/schemaTypes/documents/caseStudy.ts` | Add 3 new Sanity fields |
| Modify | `src/lib/cms/sanity.ts` | Update `getPosts`, `getPost`, `getCaseStudy` GROQ queries |
| Modify | `src/components/PortableTextRenderer.tsx` | Add `max-w-[65ch]` to normal paragraph |
| Create | `src/components/ImageCarousel.tsx` | Embla carousel with prev/next arrows, dot indicators, peek of next slide |
| Create | `src/components/ImageMasonry.tsx` | 2-column CSS columns masonry, collapses to 1-col on mobile |
| Modify | `src/pages/BlogPage.tsx` | Featured post + 2-col grid redesign |
| Modify | `src/pages/BlogPostPage.tsx` | Dark hero + cover image + reading column + gallery |
| Modify | `src/pages/CaseStudyPage.tsx` | Dark hero + cover image + metrics bar + reading column + gallery |

---

## Task 1: Update TypeScript types

**Files:**
- Modify: `src/types/content.ts`

- [ ] **Step 1: Open and update `src/types/content.ts`**

Replace the `Post` and `CaseStudy` interfaces with:

```ts
export interface CaseStudy {
  slug: string
  title: string
  category: string
  metrics: string
  desc: string
  body?: unknown
  images?: string[]
  coverImage?: string
  metricItems?: { value: string; label: string }[]
  imageLayout?: 'carousel' | 'masonry'
  seo?: Seo
}

export interface Post {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  body?: unknown
  category?: string
  coverImage?: string
  images?: string[]
  imageLayout?: 'carousel' | 'masonry'
  seo?: Seo
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run build 2>&1 | grep -E "error TS|warning" | head -20
```

Expected: no new type errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: add coverImage, metricItems, imageLayout, category fields to content types"
```

---

## Task 2: Update Sanity post schema

**Files:**
- Modify: `studio/schemaTypes/documents/post.ts`

- [ ] **Step 1: Add 4 fields to the post schema**

Replace the entire file content with:

```ts
import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. "UX Research", "Strategy", "Process"',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width image displayed between the header and body. Recommended: 1600×600px.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Displayed after the body content as a gallery.',
    }),
    defineField({
      name: 'imageLayout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      description: 'How to display gallery images. Defaults to masonry if unset.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Page Title', type: 'string', description: '~50–60 chars. Defaults to the post title.' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, description: '~150–160 chars. Defaults to the excerpt.' }),
        defineField({ name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Recommended: 1200×630px.', options: { hotspot: true } }),
        defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt' },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add studio/schemaTypes/documents/post.ts
git commit -m "feat: add category, coverImage, images, imageLayout fields to post schema"
```

---

## Task 3: Update Sanity caseStudy schema

**Files:**
- Modify: `studio/schemaTypes/documents/caseStudy.ts`

- [ ] **Step 1: Add 3 fields to the caseStudy schema**

Replace the entire file content with:

```ts
import { defineType, defineField } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics (legacy)',
      type: 'string',
      description: 'Used on homepage cards. e.g. "12M+ Reach • 450% Engagement Increase"',
    }),
    defineField({
      name: 'metricItems',
      title: 'Metric Items',
      type: 'array',
      description: 'Structured metrics shown in the detail page header bar.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "+40%"' }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Conversion rate"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name: 'desc',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width image displayed between the header and body. Recommended: 1600×600px.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Displayed after the body content as a gallery.',
    }),
    defineField({
      name: 'imageLayout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      description: 'How to display gallery images. Defaults to masonry if unset.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Page Title', type: 'string', description: '~50–60 chars. Defaults to the case study title.' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, description: '~150–160 chars. Defaults to the summary.' }),
        defineField({ name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Recommended: 1200×630px.', options: { hotspot: true } }),
        defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add studio/schemaTypes/documents/caseStudy.ts
git commit -m "feat: add coverImage, metricItems, imageLayout fields to caseStudy schema"
```

---

## Task 4: Update GROQ queries in Sanity adapter

**Files:**
- Modify: `src/lib/cms/sanity.ts`

- [ ] **Step 1: Update all three queries**

Replace the entire file content with:

```ts
import { createClient } from '@sanity/client'
import type { ContentRepository } from './index'
import type { CaseStudy, Post, Homepage, Contact } from '@/types/content'

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export const sanityRepo: ContentRepository = {
  async getCaseStudies() {
    return client.fetch<CaseStudy[]>(`
      *[_type == "caseStudy"] | order(_createdAt desc) {
        "slug": slug.current,
        title,
        category,
        metrics,
        desc
      }
    `)
  },

  async getCaseStudy(slug) {
    return client.fetch<CaseStudy | null>(`
      *[_type == "caseStudy" && slug.current == $slug][0] {
        "slug": slug.current,
        title,
        category,
        metrics,
        metricItems[]{ value, label },
        desc,
        "coverImage": coverImage.asset->url,
        body[] {
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{ url }
          }
        },
        "images": images[].asset->url,
        imageLayout,
        seo {
          title,
          description,
          "ogImage": ogImage.asset->url,
          noIndex
        }
      }
    `, { slug })
  },

  async getPosts() {
    return client.fetch<Post[]>(`
      *[_type == "post"] | order(publishedAt desc) {
        "slug": slug.current,
        title,
        publishedAt,
        category,
        excerpt,
        "coverImage": coverImage.asset->url
      }
    `)
  },

  async getPost(slug) {
    return client.fetch<Post | null>(`
      *[_type == "post" && slug.current == $slug][0] {
        "slug": slug.current,
        title,
        publishedAt,
        category,
        excerpt,
        "coverImage": coverImage.asset->url,
        body[] {
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{ url }
          }
        },
        "images": images[].asset->url,
        imageLayout,
        seo {
          title,
          description,
          "ogImage": ogImage.asset->url,
          noIndex
        }
      }
    `, { slug })
  },

  async getHomepage() {
    return client.fetch<Homepage | null>(`
      *[_type == "homepage"][0] {
        seo {
          title,
          description,
          "ogImage": ogImage.asset->url,
          noIndex
        },
        hero,
        about {
          bio,
          "photo": photo.asset->url
        },
        "clients": clients[] {
          name,
          "logo": logo.asset->url
        },
        expertise {
          "image": image.asset->url,
          title,
          categories
        },
        "testimonials": testimonials[],
        "services": services[],
        sectionOrder,
        "contact": *[_type == "contact"][0] {
          tagline,
          email,
          socialLinks
        }
      }
    `)
  },

  async getContact() {
    return client.fetch<Contact | null>(`*[_type == "contact"][0]{ tagline, email, socialLinks }`)
  },
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build 2>&1 | grep -E "error TS|error:" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/cms/sanity.ts
git commit -m "feat: update GROQ queries to fetch coverImage, category, metricItems, imageLayout"
```

---

## Task 5: Update PortableTextRenderer paragraph width

**Files:**
- Modify: `src/components/PortableTextRenderer.tsx`

- [ ] **Step 1: Add `max-w-[65ch]` to the normal paragraph**

In `src/components/PortableTextRenderer.tsx`, change the `normal` block from:

```tsx
normal: ({ children }) => (
  <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-4">
    {children}
  </p>
),
```

To:

```tsx
normal: ({ children }) => (
  <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-4 max-w-[65ch]">
    {children}
  </p>
),
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PortableTextRenderer.tsx
git commit -m "feat: constrain body paragraph line length to 65ch for readability"
```

---

## Task 6: Create ImageMasonry component

**Files:**
- Create: `src/components/ImageMasonry.tsx`

- [ ] **Step 1: Create the file**

```tsx
interface Props {
  images: string[]
  alt?: string
}

export function ImageMasonry({ images, alt = '' }: Props) {
  return (
    <div className="columns-1 sm:columns-2 gap-3">
      {images.map((url, i) => (
        <div key={i} className="break-inside-avoid mb-3">
          <img
            src={url}
            alt={`${alt} ${i + 1}`}
            className="w-full block"
          />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server shows no import errors**

```bash
bun run dev
```

Open browser console — no errors expected.

- [ ] **Step 3: Commit**

```bash
git add src/components/ImageMasonry.tsx
git commit -m "feat: add ImageMasonry component (2-col CSS columns, collapses on mobile)"
```

---

## Task 7: Create ImageCarousel component

**Files:**
- Create: `src/components/ImageCarousel.tsx`

`embla-carousel-react` is already in `package.json` — no install needed.

- [ ] **Step 1: Create the file**

```tsx
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt?: string
}

export function ImageCarousel({ images, alt = '' }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((url, i) => (
            <div key={i} className="flex-[0_0_85%] md:flex-[0_0_75%] mr-3 last:mr-0">
              <img
                src={url}
                alt={`${alt} ${i + 1}`}
                className="w-full aspect-[4/3] object-cover block"
              />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow transition-opacity hover:opacity-100 opacity-80"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={scrollNext}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow transition-opacity hover:opacity-100 opacity-80"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {images.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === selectedIndex
                  ? 'w-4 bg-foreground'
                  : 'w-1.5 bg-foreground/25 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server, no import errors**

```bash
bun run dev
```

Check browser console — no errors expected.

- [ ] **Step 3: Commit**

```bash
git add src/components/ImageCarousel.tsx
git commit -m "feat: add ImageCarousel component using embla-carousel-react"
```

---

## Task 8: Redesign BlogPage

**Files:**
- Modify: `src/pages/BlogPage.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
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
                    i % 2 === 0 ? 'md:pr-8 md:border-r md:border-border' : 'md:pl-8',
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
```

- [ ] **Step 2: Verify in browser**

```bash
bun run dev
```

Navigate to `http://localhost:5173/blog`. Verify:
- If posts exist: featured post is displayed with `Latest Post` badge, cover image or placeholder, rest in 2-col grid
- If no posts: centered "No posts yet." message
- Grid cells have border-right divider on desktop between columns

- [ ] **Step 3: Commit**

```bash
git add src/pages/BlogPage.tsx
git commit -m "feat: redesign blog list page with featured post and 2-col grid"
```

---

## Task 9: Redesign BlogPostPage

**Files:**
- Modify: `src/pages/BlogPostPage.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
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
          {post.body && <PortableTextRenderer value={post.body as PortableTextValue} />}
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
```

- [ ] **Step 2: Verify in browser**

```bash
bun run dev
```

Navigate to a blog post URL (e.g. `http://localhost:5173/blog/some-slug`). Verify:
- Dark hero with back link, category/date meta, title, excerpt
- Cover image renders edge-to-edge if set
- Body text is centered and constrained to ~720px
- Gallery section appears if images are set (test both masonry and carousel by temporarily hardcoding `imageLayout`)

- [ ] **Step 3: Commit**

```bash
git add src/pages/BlogPostPage.tsx
git commit -m "feat: redesign blog post page with dark hero, cover image, reading column, gallery"
```

---

## Task 10: Redesign CaseStudyPage

**Files:**
- Modify: `src/pages/CaseStudyPage.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
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
```

- [ ] **Step 2: Verify in browser**

```bash
bun run dev
```

Navigate to a case study URL (e.g. `http://localhost:5173/case-studies/barbie-shopee-campaign`). Verify:
- Dark hero with `← Work` back link, category, title, desc
- Cover image renders edge-to-edge if set
- Metrics bar appears if `metricItems` is set — white values, muted labels, no purple text
- Body content is centered, paragraphs capped at 65ch
- Gallery section appears if images are set

- [ ] **Step 3: Commit**

```bash
git add src/pages/CaseStudyPage.tsx
git commit -m "feat: redesign case study page with dark hero, cover image, metrics bar, gallery"
```

---

## Task 11: Final verification

- [ ] **Step 1: Full build check**

```bash
bun run build 2>&1 | tail -20
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 2: Smoke-test all routes in browser**

```bash
bun run dev
```

Check each route:
- `/blog` — featured post + grid visible; empty state if no posts
- `/blog/:slug` — dark hero, cover image, reading body, gallery (if images set)
- `/case-studies/:slug` — dark hero, cover image, metrics bar (if metricItems set), gallery (if images set)
- `/` — homepage case study cards still work (CaseStudies section unchanged)

- [ ] **Step 3: Commit final state if any last tweaks were made**

```bash
git add -p
git commit -m "fix: post-review tweaks for blog and case study pages"
```
