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
            ├── hero.ts
            ├── about.ts
            ├── clients.ts
            ├── expertise.ts
            ├── testimonials.ts
            ├── services.ts
            ├── contact.ts
            └── homepageLayout.ts
```

---

## Data Flow

**Runtime (portfolio):**
1. User visits portfolio → React app boots
2. `HomePage` calls `cms.getHomepageLayout()` + all singleton getters in parallel
3. `sanityRepo` fires GROQ queries via `@sanity/client` against the Sanity CDN
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

One document per singleton, queried by fixed document ID. Edited in place in Studio (no list view).

#### `hero`
| Field | Type |
|---|---|
| `headline` | string |
| `subtext` | string |
| `ctaLabel` | string |

#### `about`
| Field | Type |
|---|---|
| `bio` | Portable Text |
| `photo` | image |

#### `clients`
| Field | Type |
|---|---|
| `items` | array of { name: string, logo: image } |

#### `expertise`
Covers both the Expertise visual block (illustration + tagline) and the animated discipline categories list.

| Field | Type |
|---|---|
| `image` | image |
| `title` | string (the tagline) |
| `categories` | array of { title: string, desc: string } |

#### `testimonials`
| Field | Type |
|---|---|
| `items` | array of { quote, author, role, company } |

#### `services`
| Field | Type |
|---|---|
| `items` | array of { title: string, items: string[] } |

#### `contact`
| Field | Type |
|---|---|
| `email` | string |
| `socialLinks` | array of { platform: string, url: string } |

#### `homepageLayout`
Controls the render order of configurable sections on the homepage.

| Field | Type | Notes |
|---|---|---|
| `sections` | array of strings | drag-to-reorder in Studio |

Valid section values: `about`, `clients`, `expertise`, `caseStudies`, `testimonials`, `services`.

**Fixed order (not configurable):** Navbar → Hero → `[sections]` → Footer

---

## ContentRepository Interface Changes

Remove `Work`-related methods. Add singleton getters.

```ts
export interface ContentRepository {
  // Document lists (cards, no body)
  getCaseStudies(): Promise<CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
  getPosts(): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>

  // Singletons
  getHero(): Promise<Hero>
  getAbout(): Promise<About>
  getClients(): Promise<Client[]>
  getExpertise(): Promise<Expertise>
  getTestimonials(): Promise<Testimonial[]>
  getServices(): Promise<Service[]>
  getContact(): Promise<Contact>
  getHomepageLayout(): Promise<string[]>
}
```

`getCaseStudies()` and `getPosts()` return card data only (no `body` field) using GROQ field projection. Detail pages call `getCaseStudy(slug)` / `getPost(slug)` for the full document including `body`.

---

## Types (`src/types/content.ts`)

New types to add:

```ts
export interface Hero {
  headline: string
  subtext: string
  ctaLabel: string
}

export interface About {
  bio: unknown        // Portable Text blocks
  photo: string       // Sanity image URL
}

export interface Expertise {
  image: string
  title: string
  categories: { title: string; desc: string }[]
}

export interface Contact {
  email: string
  socialLinks: { platform: string; url: string }[]
}
```

Existing `Client`, `Testimonial`, `Service`, `WorkCategory` types stay — `WorkCategory` is reused for `Expertise.categories`.

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
