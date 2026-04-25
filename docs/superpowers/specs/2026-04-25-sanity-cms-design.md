# Sanity CMS Integration — Design Spec

**Date:** 2026-04-25
**Status:** Approved

---

## Overview

Integrate Sanity v3 as the CMS for the portfolio site. Content is fetched client-side at runtime via GROQ queries. Sanity Studio is deployed separately to `sanity.studio` (Sanity-managed hosting). The existing CMS abstraction layer (`src/lib/cms/`) is preserved — only `sanity.ts` and `static.ts` are modified; the adapter toggle in `index.ts` is unchanged.

---

## Repository Structure

```
portfolio/                        ← existing Vite React SPA
├── src/
│   ├── lib/cms/
│   │   ├── index.ts              ← unchanged (adapter toggle + ContentRepository interface)
│   │   ├── sanity.ts             ← fill in with real @sanity/client GROQ queries
│   │   └── static.ts             ← updated to include new singleton stubs
│   ├── types/
│   │   └── content.ts            ← updated with new singleton types
│   └── pages/
│       └── HomePage.tsx          ← updated to fetch from CMS + render dynamic section order
├── pnpm-workspace.yaml           ← add studio/ as workspace package
└── studio/                       ← NEW: Sanity Studio v3 project
    ├── package.json
    ├── sanity.config.ts
    └── schemaTypes/
        ├── index.ts
        ├── documents/
        │   ├── caseStudy.ts
        │   └── post.ts
        └── singletons/
            ├── homepage.ts       ← hero, about, clients, expertise, testimonials, services, sectionOrder
            └── contact.ts
```

---

## Data Flow

**Runtime (portfolio):**
1. User visits portfolio → React app boots
2. `HomePage` calls `cms.getHomepage()` — a single GROQ query that fetches the `homepage` document with `contact` embedded inline
3. `sanityRepo` fires the query via `@sanity/client` against the Sanity CDN
4. Sanity CDN responds with JSON → sections rendered in the configured order

**Content editing (Studio):**
1. Editor visits `yourname.sanity.studio`
2. Edits content, reorders sections, uploads images
3. Changes are live immediately — no rebuild required (client-side queries)

---

## Sanity Schemas

### Document Types

Full documents with card listings on the homepage and detail pages with rich-text body.

#### `caseStudy`
| Field | Type | Notes |
|---|---|---|
| `slug` | slug | generated from title, required |
| `title` | string | required |
| `category` | string | e.g. "Campaign & Content" |
| `metrics` | string | e.g. "12M+ Reach • 450% Engagement" |
| `desc` | text | plain-text summary shown on card |
| `body` | Portable Text | full rich-text body on detail page |
| `images` | image[] | Sanity-hosted, optional |

#### `post`
| Field | Type | Notes |
|---|---|---|
| `slug` | slug | generated from title, required |
| `title` | string | required |
| `publishedAt` | datetime | required |
| `excerpt` | text | plain-text summary shown on card |
| `body` | Portable Text | full article content |

### Singleton Documents

Two singleton documents, each queried by fixed document ID. Edited in place in Studio (no list view).

#### `homepage`

One document covering all homepage sections and layout order.

| Field | Type | Notes |
|---|---|---|
| `hero.headline` | string | |
| `hero.subtext` | string | |
| `hero.ctaLabel` | string | |
| `about.bio` | Portable Text | |
| `about.photo` | image | |
| `clients.items` | array of { name, logo (image) } | |
| `expertise.image` | image | illustration shown in Expertise block |
| `expertise.title` | string | tagline text |
| `expertise.categories` | array of { title, desc } | the 3 animated discipline items |
| `testimonials.items` | array of { quote, author, role, company } | |
| `services.items` | array of { title, items[] (string list) } | |
| `sectionOrder` | array of strings | drag-to-reorder in Studio |

Valid `sectionOrder` values: `about`, `clients`, `expertise`, `caseStudies`, `testimonials`, `services`.

**Fixed order (not configurable):** Navbar → Hero → `[sectionOrder]` → Footer

#### `contact`

Standalone singleton used by both `/contact` page and embedded into `getHomepage()` via a single GROQ query.

| Field | Type |
|---|---|
| `email` | string |
| `socialLinks` | array of { platform: string, url: string } |

**GROQ pattern** — homepage query embeds contact inline:
```groq
*[_type == "homepage"][0] {
  ...,
  "contact": *[_type == "contact"][0]
}
```

---

## ContentRepository Interface Changes

Remove `Work`-related methods. Replace individual singleton getters with `getHomepage()` and `getContact()`.

```ts
export interface ContentRepository {
  // Document lists (cards, no body)
  getCaseStudies(): Promise<CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
  getPosts(): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>

  // Singletons
  getHomepage(): Promise<Homepage>   // includes embedded contact data
  getContact(): Promise<Contact>     // used directly by /contact page
}
```

`getCaseStudies()` and `getPosts()` return card data only (no `body` field) using GROQ field projection. Detail pages call `getCaseStudy(slug)` / `getPost(slug)` for the full document including `body`.

---

## Types (`src/types/content.ts`)

New types to add:

```ts
export interface Homepage {
  hero: {
    headline: string
    subtext: string
    ctaLabel: string
  }
  about: {
    bio: unknown       // Portable Text blocks
    photo: string      // Sanity image URL
  }
  clients: { name: string; logo: string }[]
  expertise: {
    image: string
    title: string
    categories: { title: string; desc: string }[]
  }
  testimonials: { quote: string; author: string; role: string; company: string }[]
  services: { title: string; items: string[] }[]
  sectionOrder: string[]
  contact: Contact     // embedded from contact singleton
}

export interface Contact {
  email: string
  socialLinks: { platform: string; url: string }[]
}
```

Existing `Client`, `Testimonial`, `Service`, `WorkCategory` types stay but become redundant over time — `Homepage` is the authoritative shape going forward.

---

## Rich Text Rendering

Install `@portabletext/react` in the portfolio root. Create a shared `<PortableTextRenderer>` component used by `CaseStudyPage`, `BlogPostPage`, and `About` section. Inline images in Portable Text use `@sanity/image-url` to build CDN URLs.

---

## Environment Variables

```
VITE_CMS_ADAPTER=sanity
VITE_SANITY_PROJECT_ID=<from sanity.io dashboard>
VITE_SANITY_DATASET=production
```

`static` adapter remains the default (no env vars needed) for local dev without Sanity credentials.

---

## Studio Deployment

1. `cd studio && bun install`
2. `sanity login` (Sanity account)
3. `sanity init` — links to Sanity project, sets dataset to `production`
4. `sanity deploy` — publishes to `<chosen-name>.sanity.studio`

Re-deploy after schema changes: `sanity deploy` from `studio/`.

---

## Data Migration

The 4 existing case studies in `src/data/caseStudies.ts` are entered manually into Sanity Studio. `works` and `posts` are currently empty — nothing to migrate. Static image assets (`src/assets/`) are uploaded to Sanity via the Studio media browser.

---

## Out of Scope

- Server-side rendering / static site generation (site remains a client-side SPA)
- Webhooks or ISR-style cache invalidation
- Draft preview mode
- Automated migration scripts
- `Work` document type (work categories are managed via `expertise.categories`)
