# Blog & Case Study Readability — Design Spec
_Date: 2026-04-26_

## Overview

Redesign the blog list, blog post, and case study detail pages for better readability, visual hierarchy, and editorial feel — referencing the Figma blog as a style benchmark. Add full-width cover image support and per-document image gallery (carousel or masonry) to both blog posts and case studies, driven by CMS fields.

---

## Pages in Scope

| Page | Route | File |
|------|-------|------|
| Blog list | `/blog` | `src/pages/BlogPage.tsx` |
| Blog post | `/blog/:slug` | `src/pages/BlogPostPage.tsx` |
| Case study | `/case-studies/:slug` | `src/pages/CaseStudyPage.tsx` |

---

## 1. Blog List Page (`/blog`)

### Layout

- **Page header**: `Blog` title + optional subtitle tagline, padded `40px` horizontal, `border-bottom`.
- **Featured post**: Latest post rendered full-width in a split layout — left side has `Latest Post` badge (brand-purple), title at `26px`, excerpt, `category · date` meta; right side shows `coverImage` (if present) or a colored placeholder box.
- **Post grid**: All remaining posts in a 2-column grid separated by border lines (no outer card borders). Each cell: category label → title → excerpt → date. Odd cells have `border-right`, even cells have `padding-left`.
- Max-width container: `max-w-site-container mx-auto`, padded `40px` horizontal (`24px` on mobile).

### Data needs

`getPosts` query must return `coverImage` URL for the featured slot. Other grid posts don't need it.

---

## 2. Blog Post Page (`/blog/:slug`)

### Layout

1. **Dark hero** (`bg-[#0d0d0d]`, `text-white`, `padding: 48px 40px`):
   - Back link: `← Blog` in small uppercase muted text
   - Meta row: `category · publishedAt` (if category field added; see CMS section)
   - Title: `36px`, `font-weight: 700`, `max-width: 720px`
   - Excerpt: `16px`, `color: #888`, `max-width: 600px`, Open Sans

2. **Cover image**: Full-width, edge-to-edge (no horizontal padding), `aspect-ratio: 16/6`. Rendered only if `post.coverImage` is set. No border-radius.

3. **Reading body** (`max-width: 720px`, `margin: 0 auto`, `padding: 56px 40px 64px`):
   - `PortableTextRenderer` renders body content
   - Normal paragraphs get `max-w-[65ch]` so line length stays ~12 words
   - Image gallery (carousel or masonry) rendered after body if `post.images` exists

4. **Image gallery**: See §4 below.

---

## 3. Case Study Page (`/case-studies/:slug`)

### Layout

1. **Dark hero** (same dark treatment as blog post):
   - Back link: `← Work`
   - Meta row: `category`
   - Title: `36px`, `font-weight: 700`, `max-width: 720px`
   - Description (maps to `desc`): `16px`, `color: #888`, `max-width: 600px`

2. **Cover image**: Full-width, edge-to-edge, `aspect-ratio: 16/6`. Rendered if `caseStudy.coverImage` is set.

3. **Metrics bar** (`bg-[#161616]`, `padding: 24px 40px`, `border-top: 1px solid #1e1e1e`):
   - Rendered only if `caseStudy.metricItems` is set and non-empty
   - Displays up to 4 metric items horizontally: `value` in white `26px bold`, `label` in muted `11px uppercase`
   - Falls back to nothing (old `metrics` string is only used on the homepage card, not here)

4. **Reading body**: Same as blog post — `max-width: 720px`, centered, `max-w-[65ch]` on paragraphs.

5. **Image gallery**: See §4 below.

---

## 4. Image Gallery Component

Both blog posts and case studies support an image gallery below the body. The display mode is set per-document in the CMS via `imageLayout`.

### Carousel (`imageLayout: 'carousel'`)

- Component: `src/components/ImageCarousel.tsx`
- Full-width track (no horizontal padding), images at `aspect-ratio: 4/3`
- Shows current image + peek of next image (width ~200px, partially visible)
- Prev/Next arrow buttons overlaid on image edges
- Dot indicators below: active dot is wider pill shape (`width: 18px`), inactive dots are circles (`6px`)
- No autoplay. Keyboard accessible (left/right arrow keys when focused).

### Masonry (`imageLayout: 'masonry'`)

- Component: `src/components/ImageMasonry.tsx`
- 2-column CSS `columns` layout, `column-gap: 12px`, `row-gap: 12px`
- Images use `break-inside: avoid`, rendered at their natural aspect ratio (no forced ratio)
- On mobile (`< 640px`): collapses to single column

### Fallback

If `imageLayout` is not set but `images` array is non-empty, defaults to masonry.

---

## 5. CMS Schema Changes (Sanity Studio)

### `studio/schemaTypes/documents/post.ts` — add 4 fields

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | Shown on blog list cards and post hero meta row |
| `coverImage` | `image` (hotspot) | Full-width hero image shown between dark header and body |
| `images` | `array of image` | Gallery images shown after body content |
| `imageLayout` | `string` (radio: `carousel` / `masonry`) | Controls gallery display. Defaults to masonry if unset. |

### `studio/schemaTypes/documents/caseStudy.ts` — add 3 fields

| Field | Type | Description |
|-------|------|-------------|
| `coverImage` | `image` (hotspot) | Full-width hero image |
| `metricItems` | `array of object {value: string, label: string}` | Structured metrics for the metrics bar. Replaces free-text `metrics` on the detail page (old `metrics` string stays for homepage cards). |
| `imageLayout` | `string` (radio: `carousel` / `masonry`) | Controls gallery display. |

The existing `images` field on `caseStudy` is reused for the gallery; no new field needed.

---

## 6. TypeScript Type Changes (`src/types/content.ts`)

```ts
interface Post {
  // existing fields unchanged
  category?: string
  coverImage?: string
  images?: string[]
  imageLayout?: 'carousel' | 'masonry'
}

interface CaseStudy {
  // existing fields unchanged
  coverImage?: string
  metricItems?: { value: string; label: string }[]
  imageLayout?: 'carousel' | 'masonry'
}
```

---

## 7. CMS Adapter Changes

### `src/lib/cms/sanity.ts`

- `getPosts`: add `category` and `"coverImage": coverImage.asset->url` to the list query (category for all grid cells, coverImage for the featured slot)
- `getPost`: add `category`, `"coverImage": coverImage.asset->url`, `"images": images[].asset->url`, `imageLayout`
- `getCaseStudy`: add `"coverImage": coverImage.asset->url`, `metricItems`, `imageLayout`

### `src/lib/cms/static.ts`

No changes required. Static case studies have no `coverImage` or `metricItems`, so the hero image and metrics bar simply won't render for static data.

---

## 8. PortableTextRenderer (`src/components/PortableTextRenderer.tsx`)

- Add `max-w-[65ch]` to the `normal` block paragraph className to constrain line length within the reading column.

---

## 9. Components to Create

| File | Purpose |
|------|---------|
| `src/components/ImageCarousel.tsx` | Carousel with peek, arrows, dot indicators |
| `src/components/ImageMasonry.tsx` | 2-col CSS columns masonry grid |

---

## 10. Out of Scope

- No changes to `CaseStudies.tsx` homepage section (card grid stays as-is)
- No pagination on blog list (render all posts)
- No category filtering on blog list
- No table-of-contents sidebar (decided against option B)
- No dark mode variants for the new components (they inherit existing dark mode tokens)
