# Sanity CMS Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up Sanity v3 as the CMS backend, replacing hardcoded data in `src/data/` and component props with live content fetched via GROQ queries.

**Architecture:** A `studio/` workspace package contains Sanity Studio v3 with all schemas; it is deployed independently to `sanity.studio`. The portfolio's existing CMS adapter layer (`src/lib/cms/`) is filled in — `sanity.ts` gets real `@sanity/client` GROQ queries, `static.ts` keeps working as the dev fallback. `HomePage` fetches a single `getHomepage()` call and renders sections in the order configured in Studio.

**Tech Stack:** Sanity v3, `@sanity/client`, `@portabletext/react`, React 18, Vite, TypeScript, bun, pnpm workspaces.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `pnpm-workspace.yaml` | Add `studio/` as workspace package |
| Create | `studio/package.json` | Studio project metadata + scripts |
| Create | `studio/tsconfig.json` | TypeScript config for Studio |
| Create | `studio/sanity.cli.ts` | CLI project ID / dataset config |
| Create | `studio/sanity.config.ts` | Studio plugins, structure, singleton config |
| Create | `studio/schemaTypes/index.ts` | Export all schema types |
| Create | `studio/schemaTypes/documents/caseStudy.ts` | Case study document schema |
| Create | `studio/schemaTypes/documents/post.ts` | Blog post document schema |
| Create | `studio/schemaTypes/singletons/homepage.ts` | Homepage singleton schema |
| Create | `studio/schemaTypes/singletons/contact.ts` | Contact singleton schema |
| Modify | `src/types/content.ts` | Add `Homepage`, `Contact` types; remove `Work` |
| Modify | `src/lib/cms/index.ts` | Update `ContentRepository` interface |
| Modify | `src/lib/cms/static.ts` | Update stubs to match new interface |
| Modify | `src/lib/cms/sanity.ts` | Implement all methods with real GROQ queries |
| Create | `src/components/PortableTextRenderer.tsx` | Shared Portable Text renderer |
| Modify | `src/components/sections/Hero.tsx` | Accept `headline` prop from CMS |
| Modify | `src/components/sections/About.tsx` | Accept `bio` (Portable Text) + `photo` from CMS |
| Modify | `src/components/sections/Expertise.tsx` | Accept `image` + `title` from CMS |
| Modify | `src/pages/HomePage.tsx` | Fetch from CMS, render sections in dynamic order |
| Modify | `src/pages/CaseStudyPage.tsx` | Render body with PortableTextRenderer |
| Modify | `src/pages/BlogPostPage.tsx` | Render body with PortableTextRenderer |
| Modify | `src/pages/ContactPage.tsx` | Fetch contact data from CMS |

---

## Task 1: Initialize studio/ workspace package

**Files:**
- Modify: `pnpm-workspace.yaml`
- Create: `studio/package.json`
- Create: `studio/tsconfig.json`
- Create: `studio/sanity.cli.ts`

- [ ] **Step 1: Update pnpm-workspace.yaml**

Replace the entire file content:

```yaml
packages:
  - '.'
  - 'studio'
```

- [ ] **Step 2: Create studio/package.json**

```json
{
  "name": "portfolio-studio",
  "private": true,
  "version": "1.0.0",
  "main": "package.json",
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "sanity": "^3.0.0",
    "styled-components": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 3: Create studio/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "module": "preserve",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", ".sanity"]
}
```

- [ ] **Step 4: Create studio/sanity.cli.ts**

This file is read by the `sanity` CLI. `SANITY_STUDIO_PROJECT_ID` is set after running `sanity login && sanity init` (Task 12).

```ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
})
```

- [ ] **Step 5: Install Studio dependencies**

```bash
cd studio && bun install
```

Expected: `node_modules/` created inside `studio/`, `bun.lock` updated at repo root.

- [ ] **Step 6: Commit**

```bash
git add pnpm-workspace.yaml studio/package.json studio/tsconfig.json studio/sanity.cli.ts bun.lock
git commit -m "feat: initialize studio/ as workspace package"
```

---

## Task 2: Sanity document schemas

**Files:**
- Create: `studio/schemaTypes/documents/caseStudy.ts`
- Create: `studio/schemaTypes/documents/post.ts`

- [ ] **Step 1: Create studio/schemaTypes/documents/caseStudy.ts**

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
      title: 'Metrics',
      type: 'string',
      description: 'e.g. "12M+ Reach • 450% Engagement Increase"',
    }),
    defineField({
      name: 'desc',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
```

- [ ] **Step 2: Create studio/schemaTypes/documents/post.ts**

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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt' },
  },
})
```

- [ ] **Step 3: Commit**

```bash
git add studio/schemaTypes/documents/
git commit -m "feat: add caseStudy and post Sanity document schemas"
```

---

## Task 3: Sanity singleton schemas + schema index

**Files:**
- Create: `studio/schemaTypes/singletons/homepage.ts`
- Create: `studio/schemaTypes/singletons/contact.ts`
- Create: `studio/schemaTypes/index.ts`

- [ ] **Step 1: Create studio/schemaTypes/singletons/homepage.ts**

```ts
import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'string' }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'object',
      fields: [
        defineField({
          name: 'bio',
          title: 'Bio',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'logo', title: 'Logo', type: 'image' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Illustration',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'title', title: 'Tagline', type: 'string' }),
        defineField({
          name: 'categories',
          title: 'Disciplines',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'desc', title: 'Description', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
            defineField({ name: 'author', title: 'Author', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'company', title: 'Company', type: 'string' }),
          ],
          preview: { select: { title: 'author', subtitle: 'company' } },
        },
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'sectionOrder',
      title: 'Section Order',
      description: 'Drag to reorder. Fixed: Navbar → Hero → [below] → Footer',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'About', value: 'about' },
              { title: 'Clients', value: 'clients' },
              { title: 'Expertise & Disciplines', value: 'expertise' },
              { title: 'Case Studies', value: 'caseStudies' },
              { title: 'Testimonials', value: 'testimonials' },
              { title: 'Services', value: 'services' },
            ],
          },
        },
      ],
    }),
  ],
})
```

- [ ] **Step 2: Create studio/schemaTypes/singletons/contact.ts**

```ts
import { defineType, defineField } from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
})
```

- [ ] **Step 3: Create studio/schemaTypes/index.ts**

```ts
import { caseStudy } from './documents/caseStudy'
import { post } from './documents/post'
import { homepage } from './singletons/homepage'
import { contact } from './singletons/contact'

export const schemaTypes = [caseStudy, post, homepage, contact]
```

- [ ] **Step 4: Commit**

```bash
git add studio/schemaTypes/
git commit -m "feat: add homepage and contact singleton schemas"
```

---

## Task 4: Configure Sanity Studio

**Files:**
- Create: `studio/sanity.config.ts`

- [ ] **Step 1: Create studio/sanity.config.ts**

The `structureTool` config prevents creating/deleting singletons by rendering them as fixed list items. `schema.templates` filter prevents the "Create new" button appearing for singleton types.

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const SINGLETON_TYPES = new Set(['homepage', 'contact'])

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage')
              .id('homepage')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('Contact')
              .id('contact')
              .child(S.document().schemaType('contact').documentId('contact')),
            S.divider(),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('post').title('Blog Posts'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
})
```

- [ ] **Step 2: Verify Studio builds**

```bash
cd studio && bun run build
```

Expected: Build succeeds with no TypeScript errors. Output in `studio/dist/`.

- [ ] **Step 3: Commit**

```bash
git add studio/sanity.config.ts
git commit -m "feat: configure Sanity Studio with singleton structure"
```

---

## Task 5: Update TypeScript types

**Files:**
- Modify: `src/types/content.ts`

- [ ] **Step 1: Replace src/types/content.ts**

```ts
export interface CaseStudy {
  slug: string
  title: string
  category: string
  metrics: string
  desc: string
  body?: unknown
  images?: string[]
}

export interface Post {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  body?: unknown
}

export interface Homepage {
  hero: {
    headline: string
    subtext: string
    ctaLabel: string
  }
  about: {
    bio: unknown
    photo: string
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
  contact: Contact
}

export interface Contact {
  email: string
  socialLinks: { platform: string; url: string }[]
}

// Legacy types kept for section component prop signatures
export interface Client {
  name: string
  logo: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

export interface Service {
  title: string
  items: string[]
}

export interface WorkCategory {
  title: string
  desc: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: add Homepage and Contact types, remove Work type"
```

---

## Task 6: Update ContentRepository interface + static adapter

**Files:**
- Modify: `src/lib/cms/index.ts`
- Modify: `src/lib/cms/static.ts`

- [ ] **Step 1: Replace src/lib/cms/index.ts**

```ts
import type { CaseStudy, Post, Homepage, Contact } from '@/types/content'
import { staticRepo } from './static'
import { sanityRepo } from './sanity'

export interface ContentRepository {
  getCaseStudies(): Promise<CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
  getPosts(): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>
  getHomepage(): Promise<Homepage | null>
  getContact(): Promise<Contact | null>
}

export const cms: ContentRepository =
  import.meta.env.VITE_CMS_ADAPTER === 'sanity' ? sanityRepo : staticRepo
```

- [ ] **Step 2: Replace src/lib/cms/static.ts**

Seed the static adapter with the current hardcoded values so the site still works without Sanity credentials.

```ts
import type { ContentRepository } from './index'
import type { Homepage, Contact } from '@/types/content'
import { caseStudies } from '@/data/caseStudies'

const DEFAULT_SECTION_ORDER = ['about', 'clients', 'expertise', 'caseStudies', 'testimonials', 'services']

const homepage: Homepage = {
  hero: {
    headline: 'between viral moments and brand growth.',
    subtext: '',
    ctaLabel: 'View Work',
  },
  about: {
    bio: [],
    photo: '',
  },
  clients: [],
  expertise: {
    image: '',
    title: 'Building consumer brands through content, KOL & growth strategy',
    categories: [
      { title: 'Campaign & Content', desc: 'High-impact creative campaigns and content strategy' },
      { title: 'Key Opinion Leader', desc: 'Strategic KOL partnerships and influencer management' },
      { title: 'Brand Strategic', desc: 'Comprehensive brand positioning and growth planning' },
    ],
  },
  testimonials: [],
  services: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  contact: { email: 'hello@rare.studio', socialLinks: [] },
}

const contact: Contact = { email: 'hello@rare.studio', socialLinks: [] }

export const staticRepo: ContentRepository = {
  getCaseStudies: () => Promise.resolve(caseStudies),
  getCaseStudy: (slug) => Promise.resolve(caseStudies.find((cs) => cs.slug === slug) ?? null),
  getPosts: () => Promise.resolve([]),
  getPost: () => Promise.resolve(null),
  getHomepage: () => Promise.resolve(homepage),
  getContact: () => Promise.resolve(contact),
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/cms/index.ts src/lib/cms/static.ts
git commit -m "feat: update ContentRepository interface and static adapter"
```

---

## Task 7: Install portfolio CMS packages + implement Sanity adapter

**Files:**
- Modify: `src/lib/cms/sanity.ts`

- [ ] **Step 1: Install packages in portfolio root**

```bash
bun add @sanity/client @portabletext/react
```

Expected: Both packages appear in `package.json` dependencies. `bun.lock` updated.

- [ ] **Step 2: Replace src/lib/cms/sanity.ts**

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
        desc,
        body,
        "images": images[].asset->url
      }
    `, { slug })
  },

  async getPosts() {
    return client.fetch<Post[]>(`
      *[_type == "post"] | order(publishedAt desc) {
        "slug": slug.current,
        title,
        publishedAt,
        excerpt
      }
    `)
  },

  async getPost(slug) {
    return client.fetch<Post | null>(`
      *[_type == "post" && slug.current == $slug][0] {
        "slug": slug.current,
        title,
        publishedAt,
        excerpt,
        body
      }
    `, { slug })
  },

  async getHomepage() {
    return client.fetch<Homepage | null>(`
      *[_type == "homepage"][0] {
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
          email,
          socialLinks
        }
      }
    `)
  },

  async getContact() {
    return client.fetch<Contact | null>(`*[_type == "contact"][0]`)
  },
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/cms/sanity.ts package.json bun.lock
git commit -m "feat: implement Sanity adapter with GROQ queries"
```

---

## Task 8: Create PortableTextRenderer component

**Files:**
- Create: `src/components/PortableTextRenderer.tsx`

- [ ] **Step 1: Create src/components/PortableTextRenderer.tsx**

Used by `CaseStudyPage` and `BlogPostPage` for rich-text body content.

```tsx
import { PortableText } from '@portabletext/react'
import type { ComponentProps } from 'react'

type Value = ComponentProps<typeof PortableText>['value']

interface Props {
  value: Value
}

export function PortableTextRenderer({ value }: Props) {
  return (
    <PortableText
      value={value}
      components={{
        block: {
          h2: ({ children }) => (
            <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[28px] md:text-[36px] mb-4 mt-10 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] md:text-[28px] mb-3 mt-8 text-foreground">
              {children}
            </h3>
          ),
          normal: ({ children }) => (
            <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-4">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-purple pl-6 my-6 font-['Open_Sans',sans-serif] text-[16px] italic text-foreground/70">
              {children}
            </blockquote>
          ),
        },
        marks: {
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          link: ({ value, children }) => (
            <a
              href={value?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
        },
        types: {
          image: ({ value }) => (
            <img
              src={value.asset?.url}
              alt={value.alt ?? ''}
              className="w-full my-8"
            />
          ),
        },
      }}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PortableTextRenderer.tsx
git commit -m "feat: add PortableTextRenderer component"
```

---

## Task 9: Update Hero, About, Expertise section components

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/Expertise.tsx`

- [ ] **Step 1: Replace src/components/sections/Hero.tsx**

`headline` replaces the hardcoded string. The brand name "rare" stays hardcoded.

```tsx
import { motion, useScroll, useTransform } from 'motion/react'
import { Navbar } from '@/components/layout/Navbar'

interface HeroProps {
  scrollToSection: (id: string) => void
  headline: string
}

export function Hero({ scrollToSection, headline }: HeroProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section id="home" className="relative border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="border-r-0 md:border-r border-border p-8 md:p-10 flex flex-col gap-12 md:gap-20"
          >
            <p className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-default text-foreground">
              rare
            </p>
            <motion.p
              style={{ opacity }}
              className="font-['DM_Sans',sans-serif] font-medium text-[32px] md:text-[48px] leading-[1.1] text-brand-purple"
            >
              {headline}
            </motion.p>
          </motion.div>
          <div className="h-fit md:h-full px-8 md:p-10 flex flex-col items-end justify-between">
            <Navbar scrollToSection={scrollToSection} />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace src/components/sections/About.tsx**

`bio` is Portable Text blocks from Sanity. Uses `PortableText` directly (not `PortableTextRenderer`) to apply About-specific typography. `photo` is a Sanity CDN URL.

```tsx
import { motion } from 'motion/react'
import { PortableText } from '@portabletext/react'
import type { ComponentProps } from 'react'

type PortableTextValue = ComponentProps<typeof PortableText>['value']

interface AboutProps {
  bio: unknown
  photo: string
}

export function About({ bio, photo }: AboutProps) {
  return (
    <section id="about" className="border-b border-border bg-background overflow-hidden">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full h-full">
              {photo && (
                <img
                  alt="Rare - Brand Manager"
                  className="w-full h-full sm:min-h-[300px] object-cover transition-all duration-500 select-none user-select-none pointer-events-none"
                  src={photo}
                  draggable="false"
                />
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 md:p-10 flex items-center"
          >
            <div>
              <PortableText
                value={bio as PortableTextValue}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[22px] leading-[1.6] text-foreground">
                        {children}
                      </p>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    underline: ({ children }) => (
                      <span className="underline decoration-solid decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                        {children}
                      </span>
                    ),
                    link: ({ value, children }) => (
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Replace src/components/sections/Expertise.tsx**

`image` and `title` replace the hardcoded values. The underline decoration is applied to the full `title` string.

```tsx
import { motion } from 'motion/react'

interface ExpertiseProps {
  image: string
  title: string
}

export function Expertise({ image, title }: ExpertiseProps) {
  return (
    <section id="expertise" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex items-end"
          >
            <div className="relative w-full aspect-video">
              {image && (
                <img
                  alt="Brand Strategy"
                  className="w-full h-full object-cover transition-all duration-700 select-none user-select-none pointer-events-none"
                  src={image}
                  draggable="false"
                />
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-10 flex items-end"
          >
            <p className="font-['DM_Sans',sans-serif] text-[28px] md:text-[40px] leading-[1.2] text-foreground">
              <span className="underline decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                {title}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/About.tsx src/components/sections/Expertise.tsx
git commit -m "feat: update Hero, About, Expertise to accept CMS props"
```

---

## Task 10: Update HomePage — CMS fetch + dynamic section order

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Replace src/pages/HomePage.tsx**

Fetches `getHomepage()` and `getCaseStudies()` in parallel. Renders sections in the order defined by `homepage.sectionOrder`. The `expertise` entry renders both `<Expertise>` and `<Works>` together since they share the same data source.

```tsx
import { useEffect, useState, Fragment } from 'react'
import { cms } from '@/lib/cms'
import type { Homepage, CaseStudy } from '@/types/content'
import { SmoothScroll } from '@/components/SmoothScroll'
import { ThemeTransitionOverlay } from '@/components/ThemeTransitionOverlay'
import { CustomCursor } from '@/components/CustomCursor'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { NotableClients } from '@/components/sections/NotableClients'
import { Expertise } from '@/components/sections/Expertise'
import { Works } from '@/components/sections/Works'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { Testimonials } from '@/components/sections/Testimonials'
import { Services } from '@/components/sections/Services'
import { Footer } from '@/components/layout/Footer'
import { scrollToSection } from '@/lib/scrollTo'

const DEFAULT_SECTION_ORDER = ['about', 'clients', 'expertise', 'caseStudies', 'testimonials', 'services']

export function HomePage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null)
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    Promise.all([cms.getHomepage(), cms.getCaseStudies()]).then(([hp, cs]) => {
      setHomepage(hp)
      setCaseStudies(cs)
    })
  }, [])

  if (!homepage) {
    return <div className="min-h-screen bg-background" />
  }

  const order = homepage.sectionOrder?.length ? homepage.sectionOrder : DEFAULT_SECTION_ORDER

  const sectionMap: Record<string, React.ReactNode> = {
    about: <About key="about" bio={homepage.about.bio} photo={homepage.about.photo} />,
    clients: <NotableClients key="clients" clients={homepage.clients} />,
    expertise: (
      <Fragment key="expertise">
        <Expertise image={homepage.expertise.image} title={homepage.expertise.title} />
        <Works categories={homepage.expertise.categories} />
      </Fragment>
    ),
    caseStudies: <CaseStudies key="caseStudies" caseStudies={caseStudies} />,
    testimonials: <Testimonials key="testimonials" testimonials={homepage.testimonials} />,
    services: <Services key="services" services={homepage.services} />,
  }

  return (
    <>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero
            scrollToSection={scrollToSection}
            headline={homepage.hero.headline}
          />
          {order.map((section) => sectionMap[section] ?? null)}
          <Footer scrollToSection={scrollToSection} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: update HomePage to fetch from CMS with dynamic section order"
```

---

## Task 11: Update CaseStudyPage + BlogPostPage with rich-text body

**Files:**
- Modify: `src/pages/CaseStudyPage.tsx`
- Modify: `src/pages/BlogPostPage.tsx`

- [ ] **Step 1: Replace src/pages/CaseStudyPage.tsx**

```tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { CaseStudy } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { ComponentProps } from 'react'
import { PortableText } from '@portabletext/react'

type PortableTextValue = ComponentProps<typeof PortableText>['value']

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
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-10">
        {caseStudy.desc}
      </p>
      {caseStudy.body && (
        <div className="border-t border-border pt-10">
          <PortableTextRenderer value={caseStudy.body as PortableTextValue} />
        </div>
      )}
      {caseStudy.images && caseStudy.images.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          {caseStudy.images.map((url, i) => (
            <img key={i} src={url} alt="" className="w-full" />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Replace src/pages/BlogPostPage.tsx**

```tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import type { ComponentProps } from 'react'
import { PortableText } from '@portabletext/react'

type PortableTextValue = ComponentProps<typeof PortableText>['value']

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
        {post.publishedAt}
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
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/CaseStudyPage.tsx src/pages/BlogPostPage.tsx
git commit -m "feat: render Portable Text body in CaseStudyPage and BlogPostPage"
```

---

## Task 12: Update ContactPage + environment setup + deploy Studio

**Files:**
- Modify: `src/pages/ContactPage.tsx`

- [ ] **Step 1: Replace src/pages/ContactPage.tsx**

```tsx
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Contact } from '@/types/content'

export function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    cms.getContact().then(setContact)
  }, [])

  const email = contact?.email ?? 'hello@rare.studio'

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
          Contact
        </h1>
        <a
          href={`mailto:${email}`}
          className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline"
        >
          {email}
        </a>
        {contact?.socialLinks && contact.socialLinks.length > 0 && (
          <div className="mt-6 flex gap-4 justify-center">
            {contact.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['DM_Sans',sans-serif] text-[15px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ContactPage.tsx
git commit -m "feat: update ContactPage to fetch from CMS"
```

- [ ] **Step 3: Create a Sanity project and configure env vars**

Run these commands from the `studio/` directory. You will be prompted to log in and create/select a project.

```bash
cd studio
bun run dev
```

The first run will prompt `sanity login` if not authenticated. After login, it will prompt to create or link a Sanity project — create a new one named `portfolio`. This writes the project ID into the CLI config.

Once the project is created, note the **Project ID** from the terminal output or from `sanity.io/manage`.

- [ ] **Step 4: Create studio/.env.local**

```
SANITY_STUDIO_PROJECT_ID=<your-project-id>
SANITY_STUDIO_DATASET=production
```

Add to `.gitignore` if not already present:

```
studio/.env.local
```

- [ ] **Step 5: Update studio/sanity.config.ts with project ID**

Replace the `projectId` and `dataset` values with the actual values (hardcode for Studio, since `process.env` in Vite/Sanity Studio context requires config):

```ts
// In studio/sanity.config.ts, replace:
projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

// With your actual values:
projectId: 'your-actual-project-id',
dataset: 'production',
```

- [ ] **Step 6: Create portfolio .env.local**

In the repo root (portfolio):

```
VITE_CMS_ADAPTER=sanity
VITE_SANITY_PROJECT_ID=<your-project-id>
VITE_SANITY_DATASET=production
```

Add to `.gitignore`:

```
.env.local
```

- [ ] **Step 7: Configure CORS for localhost in Sanity dashboard**

Visit `sanity.io/manage` → your project → API → CORS Origins. Add:
- `http://localhost:5173` (Vite dev server)
- Your deployed portfolio URL when you deploy

- [ ] **Step 8: Deploy Sanity Studio**

```bash
cd studio && bun run deploy
```

Expected: Prompted to choose a Studio hostname (e.g. `rare`). Studio is published at `rare.sanity.studio`.

- [ ] **Step 9: Seed the homepage singleton**

Visit your Studio URL. Click **Homepage** → fill in all fields → publish. Repeat for **Contact**. Add the 4 case studies from `src/data/caseStudies.ts` manually via **Case Studies** → **New**.

- [ ] **Step 10: Verify the portfolio works end-to-end**

```bash
bun run dev
```

Open `http://localhost:5173`. The homepage should load content from Sanity. If `VITE_CMS_ADAPTER` is not set, it falls back to the static adapter (hardcoded values still work).
