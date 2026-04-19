# Portfolio Site — Structure & Architecture Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Figma-exported portfolio site into idiomatic Vite + React with a pages layer, CMS abstraction, typed content, and clean separation of concerns.

**Architecture:** Flatten `src/app/` nesting into `src/`; add `pages/` for React Router v7 routes; add `lib/cms/` with a `ContentRepository` interface satisfied by a Sanity adapter and a static fallback; extract all hardcoded data to `data/`; type everything through `types/content.ts`. The app stays runnable after every task — new files are created alongside old ones, and the final switchover (updating `main.tsx`) happens in Task 13.

**Tech Stack:** React 18, TypeScript, Vite, React Router v7, Tailwind CSS v4, shadcn/ui, Framer Motion (motion/react), Lenis

---

## No Test Runner

This project has no test framework configured. Verification uses `npm run build` to confirm TypeScript compilation and bundling succeed. Spot-check `npm run dev` after Tasks 9, 12, and 13 to confirm the UI renders.

---

## File Map

### Files to Create

| File | Responsibility |
|------|---------------|
| `src/types/content.ts` | All shared content type interfaces |
| `src/data/clients.ts` | Client logo data |
| `src/data/caseStudies.ts` | Case study data |
| `src/data/testimonials.ts` | Testimonial data |
| `src/data/services.ts` | Service list data |
| `src/data/works.ts` | Works category data |
| `src/lib/cms/index.ts` | ContentRepository interface + adapter selector |
| `src/lib/cms/sanity.ts` | Sanity adapter (stub — configured later) |
| `src/lib/cms/static.ts` | Static data adapter |
| `src/lib/scrollTo.ts` | scrollToSection utility |
| `src/hooks/useOnceInView.ts` | IntersectionObserver hook |
| `src/components/ImageWithFallback.tsx` | Image with error fallback |
| `src/components/ui/` | shadcn primitives (copied from `src/app/components/ui/`) |
| `src/components/ThemeProvider.tsx` | next-themes wrapper |
| `src/components/ThemeTransitionContext.tsx` | Theme transition state + toggle |
| `src/components/ThemeTransitionOverlay.tsx` | Animated wipe overlay |
| `src/components/ModeToggle.tsx` | Dark/light toggle button |
| `src/components/CustomCursor.tsx` | Custom cursor blob |
| `src/components/SmoothScroll.tsx` | Lenis smooth scroll wrapper |
| `src/components/layout/Navbar.tsx` | Site navigation |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/sections/Hero.tsx` | Hero section |
| `src/components/sections/About.tsx` | About section |
| `src/components/sections/NotableClients.tsx` | Client logos grid |
| `src/components/sections/Expertise.tsx` | Expertise section |
| `src/components/sections/CaseStudies.tsx` | Case studies grid |
| `src/components/sections/Testimonials.tsx` | Testimonials grid |
| `src/components/sections/Services.tsx` | Services grid |
| `src/components/sections/Works.tsx` | Works category list |
| `src/router.tsx` | createBrowserRouter with all routes |
| `src/pages/HomePage.tsx` | Portfolio landing (replaces App.tsx) |
| `src/pages/CaseStudyPage.tsx` | `/case-studies/:slug` detail |
| `src/pages/WorkPage.tsx` | `/works/:slug` detail |
| `src/pages/BlogPage.tsx` | `/blog` listing |
| `src/pages/BlogPostPage.tsx` | `/blog/:slug` single post |
| `src/pages/ContactPage.tsx` | `/contact` inquiry |

### Files to Modify

| File | Change |
|------|--------|
| `src/main.tsx` | Use RouterProvider; update provider imports |
| `src/vite-env.d.ts` | Add `window.lenis` type declaration |
| `package.json` | Fix name from `@figma/my-make-file` to `portfolio` |

### Files to Delete (Task 14)

- `src/app/` — entire directory (emptied by moves above)
- `src/imports/MacBookAir4.tsx` — Figma artifact, not imported anywhere
- `src/imports/svg-kpnmpaf0cj.ts` — Figma artifact, not imported anywhere
- `src/imports/image-0.png` — used only by MacBookAir4.tsx

---

## Tasks

### Task 1: Create shared content types

**Files:**
- Create: `src/types/content.ts`

- [ ] Create `src/types/content.ts`:

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

export interface Work {
  slug: string
  title: string
  category: string
  thumbnail?: string
  body?: unknown
}

export interface Post {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  body?: unknown
}

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

- [ ] Verify build passes:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds (new file, no consumers yet)

- [ ] Commit:

```bash
git add src/types/content.ts
git commit -m "feat: add shared content types"
```

---

### Task 2: Extract hardcoded data to data files

**Files:**
- Create: `src/data/clients.ts`
- Create: `src/data/caseStudies.ts`
- Create: `src/data/testimonials.ts`
- Create: `src/data/services.ts`
- Create: `src/data/works.ts`

The data currently lives inline in `src/app/App.tsx`. Do NOT modify `App.tsx` here — the old file stays alive until Task 13.

- [ ] Create `src/data/clients.ts`:

```ts
import type { Client } from '@/types/content'
import logoPhilips from '@/assets/logo-philips.svg'
import logoRoyalCanin from '@/assets/logo-royalcanin.svg'
import logoTokopedia from '@/assets/logo-tokopedia.svg'
import logoPurina from '@/assets/logo-purina.svg'
import logoCapCut from '@/assets/logo-capcut.svg'
import logoPetkit from '@/assets/logo-petkit.png'
import logoTikTok from '@/assets/logo-tiktok.svg'
import logoBarbie from '@/assets/logo-barbie.svg'
import logoShopee from '@/assets/logo-shopee.svg'

export const clients: Client[] = [
  { name: 'Philips', logo: logoPhilips },
  { name: 'Royal Canin', logo: logoRoyalCanin },
  { name: 'Tokopedia', logo: logoTokopedia },
  { name: 'Purina', logo: logoPurina },
  { name: 'CapCut', logo: logoCapCut },
  { name: 'Petkit', logo: logoPetkit },
  { name: 'TikTok', logo: logoTikTok },
  { name: 'Barbie', logo: logoBarbie },
  { name: 'Shopee', logo: logoShopee },
]
```

- [ ] Create `src/data/caseStudies.ts`:

```ts
import type { CaseStudy } from '@/types/content'

export const caseStudies: CaseStudy[] = [
  {
    slug: 'barbie-shopee-campaign',
    title: 'Barbie x Shopee Campaign',
    category: 'Campaign & Content',
    metrics: '12M+ Reach • 450% Engagement Increase',
    desc: 'Led end-to-end campaign strategy for Barbie movie launch, orchestrating influencer partnerships and creating viral content that generated 12M+ impressions across platforms.',
  },
  {
    slug: 'tiktok-brand-accelerator',
    title: 'TikTok Brand Accelerator',
    category: 'Brand Strategy',
    metrics: '200K+ New Followers • 8x ROI',
    desc: 'Developed comprehensive TikTok growth strategy for consumer electronics brand, resulting in 200K+ follower growth and 8x return on ad spend within 3 months.',
  },
  {
    slug: 'royal-canin-kol-network',
    title: 'Royal Canin KOL Network',
    category: 'KOL Management',
    metrics: '50+ Creators • 25M Impressions',
    desc: 'Built and managed network of 50+ pet influencers, creating authentic content ecosystem that drove 25M impressions and 35% increase in brand consideration.',
  },
  {
    slug: 'philips-product-launch',
    title: 'Philips Product Launch',
    category: 'Integrated Campaign',
    metrics: '300% Sales Lift • Award Winning',
    desc: 'Orchestrated multi-channel product launch combining PR, influencer, and paid media. Campaign won Silver at Marketing Excellence Awards and exceeded sales targets by 300%.',
  },
]
```

- [ ] Create `src/data/testimonials.ts`:

```ts
import type { Testimonial } from '@/types/content'

export const testimonials: Testimonial[] = [
  {
    quote: 'Rare transformed our brand presence on TikTok. Her understanding of platform dynamics and creator relationships is unmatched. We saw 10x growth in 6 months.',
    author: 'Sarah Chen',
    role: 'VP Marketing, Consumer Electronics Brand',
    company: 'Fortune 500 Tech Company',
  },
  {
    quote: "Working with Rare was a masterclass in strategic thinking. She doesn't just execute campaigns—she builds ecosystems that drive sustainable growth.",
    author: 'Michael Torres',
    role: 'Brand Director',
    company: 'Global Beauty Retailer',
  },
  {
    quote: 'Her ability to identify and activate the right KOLs is exceptional. The influencer network she built for us continues to drive value years later.',
    author: 'Lisa Anderson',
    role: 'Head of Digital',
    company: 'Premium Pet Care Brand',
  },
  {
    quote: 'Rare brings a rare combination of creative vision and analytical rigor. Every campaign is backed by data but never loses its human touch.',
    author: 'David Kim',
    role: 'CMO',
    company: 'E-Commerce Platform',
  },
  {
    quote: 'She turned our product launch into a cultural moment. The buzz and sales exceeded all expectations. Truly one of the best in the industry.',
    author: 'Emma Rodriguez',
    role: 'Marketing Manager',
    company: 'Consumer Appliances',
  },
  {
    quote: "Rare's strategic guidance helped us navigate the complex influencer landscape. Her network and insights are invaluable.",
    author: 'James Park',
    role: 'Founder & CEO',
    company: 'DTC Lifestyle Brand',
  },
]
```

- [ ] Create `src/data/services.ts`:

```ts
import type { Service } from '@/types/content'

export const services: Service[] = [
  {
    title: 'Campaign Strategy',
    items: ['Creative Concepting', 'Multi-Channel Planning', 'Launch Execution', 'Performance Optimization'],
  },
  {
    title: 'Content Production',
    items: ['Video Production', 'Photography Direction', 'Content Calendars', 'Asset Management'],
  },
  {
    title: 'KOL Management',
    items: ['Influencer Sourcing', 'Relationship Building', 'Contract Negotiation', 'Campaign Coordination'],
  },
  {
    title: 'Brand Strategy',
    items: ['Market Positioning', 'Audience Research', 'Messaging Framework', 'Brand Guidelines'],
  },
  {
    title: 'Growth Marketing',
    items: ['Paid Social Strategy', 'Performance Analytics', 'A/B Testing', 'Conversion Optimization'],
  },
  {
    title: 'Event Production',
    items: ['Experiential Design', 'Venue Coordination', 'Guest Management', 'Post-Event Amplification'],
  },
]
```

- [ ] Create `src/data/works.ts`:

```ts
import type { WorkCategory } from '@/types/content'

export const workCategories: WorkCategory[] = [
  {
    title: 'Campaign & Content',
    desc: 'High-impact creative campaigns and content strategy',
  },
  {
    title: 'Key Opinion Leader',
    desc: 'Strategic KOL partnerships and influencer management',
  },
  {
    title: 'Brand Strategic',
    desc: 'Comprehensive brand positioning and growth planning',
  },
]
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/data/
git commit -m "feat: extract hardcoded content data to data/ files"
```

---

### Task 3: Create CMS abstraction layer

**Files:**
- Create: `src/lib/cms/index.ts`
- Create: `src/lib/cms/static.ts`
- Create: `src/lib/cms/sanity.ts`

- [ ] Create `src/lib/cms/index.ts`:

```ts
import type { CaseStudy, Work, Post } from '@/types/content'
import { staticRepo } from './static'
import { sanityRepo } from './sanity'

export interface ContentRepository {
  getCaseStudies(): Promise<CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
  getWorks(): Promise<Work[]>
  getWork(slug: string): Promise<Work | null>
  getPosts(): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>
}

export const cms: ContentRepository =
  import.meta.env.VITE_CMS_ADAPTER === 'sanity' ? sanityRepo : staticRepo
```

- [ ] Create `src/lib/cms/static.ts`:

```ts
import type { ContentRepository } from './index'
import type { Work, Post } from '@/types/content'
import { caseStudies } from '@/data/caseStudies'

const works: Work[] = []
const posts: Post[] = []

export const staticRepo: ContentRepository = {
  getCaseStudies: () => Promise.resolve(caseStudies),
  getCaseStudy: (slug) =>
    Promise.resolve(caseStudies.find((cs) => cs.slug === slug) ?? null),
  getWorks: () => Promise.resolve(works),
  getWork: (slug) =>
    Promise.resolve(works.find((w) => w.slug === slug) ?? null),
  getPosts: () => Promise.resolve(posts),
  getPost: (slug) =>
    Promise.resolve(posts.find((p) => p.slug === slug) ?? null),
}
```

- [ ] Create `src/lib/cms/sanity.ts`:

```ts
import type { ContentRepository } from './index'

// To activate: install @sanity/client, set VITE_CMS_ADAPTER=sanity,
// and configure VITE_SANITY_PROJECT_ID + VITE_SANITY_DATASET env vars.
const notConfigured = (): never => {
  throw new Error(
    'Sanity adapter not configured. Set VITE_CMS_ADAPTER=static or add Sanity env vars.'
  )
}

export const sanityRepo: ContentRepository = {
  getCaseStudies: async () => notConfigured(),
  getCaseStudy: async (_slug) => notConfigured(),
  getWorks: async () => notConfigured(),
  getWork: async (_slug) => notConfigured(),
  getPosts: async () => notConfigured(),
  getPost: async (_slug) => notConfigured(),
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/lib/cms/
git commit -m "feat: add CMS abstraction layer with static and Sanity adapters"
```

---

### Task 4: Create scrollTo utility and type window.lenis

**Files:**
- Create: `src/lib/scrollTo.ts`
- Modify: `src/vite-env.d.ts`

- [ ] Create `src/lib/scrollTo.ts`:

```ts
export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (element && window.lenis) {
    window.lenis.scrollTo(element, { offset: 0, duration: 1.5 })
  } else {
    element?.scrollIntoView({ behavior: 'smooth' })
  }
}
```

- [ ] Write `src/vite-env.d.ts` (replace entirely):

```ts
/// <reference types="vite/client" />

interface LenisInstance {
  scrollTo(
    target: HTMLElement | string | number,
    options?: { offset?: number; duration?: number }
  ): void
  raf(time: number): void
  destroy(): void
}

declare global {
  interface Window {
    lenis?: LenisInstance
  }
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/lib/scrollTo.ts src/vite-env.d.ts
git commit -m "feat: extract scrollToSection utility and type window.lenis"
```

---

### Task 5: Create hooks/useOnceInView and ImageWithFallback

**Files:**
- Create: `src/hooks/useOnceInView.ts`
- Create: `src/components/ImageWithFallback.tsx`

- [ ] Create `src/hooks/useOnceInView.ts` (same logic as original, debug console.logs removed):

```ts
import { useEffect, useRef, useState } from 'react'

export function useOnceInView<T extends HTMLElement = HTMLElement>(
  amount = 0.1,
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          setInView(true)
        }
      },
      { threshold: amount }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [amount])

  return [ref, inView] as const
}
```

Note: the original `label` parameter was only used for debug logging; it is removed here.

- [ ] Create `src/components/ImageWithFallback.tsx`:

```tsx
import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  )
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/hooks/ src/components/ImageWithFallback.tsx
git commit -m "feat: add useOnceInView hook and ImageWithFallback component"
```

---

### Task 6: Copy ui/ components to new location

**Files:**
- Create: `src/components/ui/` (copied from `src/app/components/ui/`)

The shadcn ui/ files use only relative imports to each other (`./utils`, etc.). Copying the folder wholesale preserves all those references.

- [ ] Copy the entire ui folder:

```bash
cp -r "/Users/ardyan/Downloads/Enhance Personal Portfolio Site/src/app/components/ui" \
      "/Users/ardyan/Downloads/Enhance Personal Portfolio Site/src/components/ui"
```

- [ ] Verify the copy contains all files:

```bash
ls "/Users/ardyan/Downloads/Enhance Personal Portfolio Site/src/components/ui/" | wc -l
```

Expected: same count as `src/app/components/ui/`

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds (old ui/ still exists at `src/app/components/ui/`, no conflicts)

- [ ] Commit:

```bash
git add src/components/ui/
git commit -m "feat: copy shadcn ui components to src/components/ui/"
```

---

### Task 7: Create shared non-layout components

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/components/ThemeTransitionContext.tsx`
- Create: `src/components/ThemeTransitionOverlay.tsx`
- Create: `src/components/ModeToggle.tsx`
- Create: `src/components/CustomCursor.tsx`
- Create: `src/components/SmoothScroll.tsx`

- [ ] Create `src/components/ThemeProvider.tsx`:

```tsx
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

- [ ] Create `src/components/ThemeTransitionContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface ThemeTransitionContextType {
  isTransitioning: boolean
  toggleTheme: () => void
  transitionColors: { bg: string; logo: string }
}

const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(undefined)

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionColors, setTransitionColors] = useState({ bg: '#564BB4', logo: '#ffffff' })

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return

    const isGoingToDark = resolvedTheme === 'light'
    setTransitionColors({
      bg: isGoingToDark ? 'oklch(0.145 0 0)' : '#ffffff',
      logo: isGoingToDark ? '#a89eff' : '#564BB4',
    })

    setIsTransitioning(true)

    setTimeout(() => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      setIsTransitioning(false)
    }, 1800)
  }, [isTransitioning, setTheme, resolvedTheme])

  return (
    <ThemeTransitionContext.Provider value={{ isTransitioning, toggleTheme, transitionColors }}>
      {children}
    </ThemeTransitionContext.Provider>
  )
}

export function useThemeTransition() {
  const context = useContext(ThemeTransitionContext)
  if (context === undefined) {
    throw new Error('useThemeTransition must be used within a ThemeTransitionProvider')
  }
  return context
}
```

- [ ] Create `src/components/ThemeTransitionOverlay.tsx`:

```tsx
import { motion, AnimatePresence } from 'motion/react'
import { useThemeTransition } from '@/components/ThemeTransitionContext'

export function ThemeTransitionOverlay() {
  const { isTransitioning, transitionColors } = useThemeTransition()

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
          style={{ willChange: 'transform', backgroundColor: transitionColors.bg }}
        >
          <div className="h-[100px] overflow-hidden flex items-center justify-center [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: [0, 1, 1, 0], y: ['100%', '0%', '0%', '-100%'] }}
              transition={{ duration: 1.2, delay: 0.6, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <p
                className="font-['DM_Serif_Display',serif] text-[48px] md:text-[64px]"
                style={{ color: transitionColors.logo }}
              >
                rare
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] Create `src/components/ModeToggle.tsx`:

```tsx
import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useThemeTransition } from '@/components/ThemeTransitionContext'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { resolvedTheme } = useTheme()
  const { toggleTheme } = useThemeTransition()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleTheme()}
      className="rounded-full hover:bg-accent/50 transition-colors relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
```

- [ ] Create `src/components/CustomCursor.tsx`:

```tsx
import React, { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const initCursor = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const blob = blobRef.current
    const dot = dotRef.current
    if (!blob || !dot) return

    const interactiveSelectors = "a, button, [role='button'], input, textarea, select, label"

    const handleMouseMove = (e: MouseEvent) => {
      blob.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      if (!initCursor.current) {
        blob.style.opacity = '1'
        dot.style.opacity = '1'
        initCursor.current = true
      }
    }

    const handleMouseOut = () => {
      blob.style.opacity = '0'
      dot.style.opacity = '0'
      initCursor.current = false
    }

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelectors)) {
        blob.classList.add('custom-cursor--link')
      } else {
        blob.classList.remove('custom-cursor--link')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseOut)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseOut)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      <div ref={blobRef} className="custom-cursor hidden lg:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden lg:block" />
    </>
  )
}
```

- [ ] Create `src/components/SmoothScroll.tsx`:

```tsx
import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash)
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 2 })
        }
      }, 500)
    }

    window.lenis = lenis

    return () => {
      lenis.destroy()
      window.lenis = undefined
    }
  }, [])

  return <>{children}</>
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/components/ThemeProvider.tsx src/components/ThemeTransitionContext.tsx \
        src/components/ThemeTransitionOverlay.tsx src/components/ModeToggle.tsx \
        src/components/CustomCursor.tsx src/components/SmoothScroll.tsx
git commit -m "feat: add shared components to src/components/"
```

---

### Task 8: Create layout components (Navbar, Footer)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`

- [ ] Create `src/components/layout/Navbar.tsx`:

```tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  scrollToSection: (id: string) => void
}

export function Navbar({ scrollToSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false)
    scrollToSection(id)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, staggerChildren: 0.1, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <nav className="relative h-full">
      {/* Desktop Navigation */}
      <motion.div
        className="hidden h-full md:flex flex-col justify-between items-end"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-4 items-end">
          {(['works', 'about', 'testimonials'] as const).map((id) => (
            <motion.button
              key={id}
              variants={itemVariants}
              onClick={() => handleScroll(id)}
              className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase transition-colors hover:text-primary"
            >
              {id}
            </motion.button>
          ))}
          <motion.div variants={itemVariants} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => handleScroll('contact')}
              className="group relative overflow-hidden px-4 py-1 h-auto font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-none transition-all duration-300"
            >
              <div className="relative flex flex-col items-center">
                <motion.span className="inline-block transition-transform duration-300 group-hover:-translate-y-[150%]">
                  Contact
                </motion.span>
                <motion.span className="absolute inline-block translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                  Contact
                </motion.span>
              </div>
            </Button>
          </motion.div>
        </div>
        <motion.div variants={itemVariants}>
          <ModeToggle />
        </motion.div>
      </motion.div>

      {/* Mobile */}
      <motion.div
        className="md:hidden flex items-center justify-end w-full gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ModeToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-accent transition-colors rounded text-foreground"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full right-0 w-[200px] border border-border bg-background shadow-xl z-50 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-6">
              {(['works', 'about', 'testimonials'] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase text-left hover:text-primary transition-colors"
                >
                  {id}
                </button>
              ))}
              <Button
                variant="outline"
                onClick={() => handleScroll('contact')}
                className="font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none w-full"
              >
                Contact
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
```

- [ ] Create `src/components/layout/Footer.tsx`:

```tsx
import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FooterProps {
  scrollToSection: (id: string) => void
}

export function Footer({ scrollToSection }: FooterProps) {
  return (
    <section id="contact" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex flex-col justify-between"
          >
            <motion.p
              onClick={() => scrollToSection('home')}
              className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-pointer text-foreground"
            >
              rare
            </motion.p>
            <div className="flex justify-between items-end">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('contact')}
                  className="group relative overflow-hidden px-6 py-2 h-auto font-['DM_Sans',sans-serif] font-semibold text-[14px] tracking-[0.7px] uppercase border-foreground text-foreground hover:bg-foreground hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-none w-full md:w-auto transition-all duration-300"
                >
                  <div className="relative flex flex-col items-center">
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-[150%]">
                      Contact
                    </span>
                    <span className="absolute inline-block translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                      Contact
                    </span>
                  </div>
                </Button>
              </motion.div>
              <div className="flex gap-6">
                <motion.a whileTap={{ scale: 0.9 }} href="#" className="transition-colors hover:text-primary text-foreground">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a whileTap={{ scale: 0.9 }} href="#" className="transition-colors hover:text-primary text-foreground">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
          <div className="p-6 md:p-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="font-['DM_Sans',sans-serif] text-[16px] md:text-[18px] text-muted-foreground mb-4">
                Let's craft a rare journey for your brand.
              </p>
              <a
                href="mailto:hello@rare.studio"
                className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline inline-flex items-center gap-2 group"
              >
                hello@rare.studio
                <ExternalLink size={20} />
              </a>
              <p className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground mt-6">
                © 2026 Rare. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/components/layout/
git commit -m "feat: add layout components Navbar and Footer"
```

---

### Task 9: Create section components

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/NotableClients.tsx`
- Create: `src/components/sections/Expertise.tsx`
- Create: `src/components/sections/CaseStudies.tsx`
- Create: `src/components/sections/Testimonials.tsx`
- Create: `src/components/sections/Services.tsx`
- Create: `src/components/sections/Works.tsx`

- [ ] Create `src/components/sections/Hero.tsx`:

```tsx
import { motion, useScroll, useTransform } from 'motion/react'
import { Navbar } from '@/components/layout/Navbar'

interface HeroProps {
  scrollToSection: (id: string) => void
}

export function Hero({ scrollToSection }: HeroProps) {
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
            <motion.p className="font-['DM_Serif_Display',serif] text-[32px] md:text-[40px] leading-[0.5] cursor-default text-foreground">
              rare
            </motion.p>
            <motion.p
              style={{ opacity }}
              className="font-['DM_Sans',sans-serif] font-medium text-[32px] md:text-[48px] leading-[1.1] text-brand-purple"
            >
              between viral moments and brand growth.
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

- [ ] Create `src/components/sections/About.tsx`:

```tsx
import { motion } from 'motion/react'

interface AboutProps {
  imageSrc: string
}

export function About({ imageSrc }: AboutProps) {
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
            <motion.div transition={{ duration: 0.3 }} className="relative w-full h-full">
              <img
                alt="Rare - Brand Manager"
                className="w-full h-full sm:min-h-[300px] object-cover transition-all duration-500 select-none user-select-none pointer-events-none"
                src={imageSrc}
                draggable="false"
              />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 md:p-10 flex items-center"
          >
            <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[22px] leading-[1.6] text-foreground">
              I'm Rare, a{' '}
              <span className="underline decoration-solid decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                brand & marketing manager
              </span>{' '}
              working at the intersection of brand strategy, content, and growth. I specialize in
              turning creative concepts into high-impact campaigns, from high-end production and
              event orchestration to strategic KOL management.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/NotableClients.tsx`:

```tsx
import { motion } from 'motion/react'
import type { Client } from '@/types/content'

interface NotableClientsProps {
  clients: Client[]
}

export function NotableClients({ clients }: NotableClientsProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-r-0 md:border-r border-border p-6 md:p-10 flex flex-col justify-between"
          >
            <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase">
              Notable Clients
            </p>
            <p className="font-['Open_Sans',sans-serif] text-[14px] text-foreground mt-4 md:mt-0">
              Trusted by 100+ brands from various industries
            </p>
          </motion.div>
          <div className="p-4 xl:p-10 h-full">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 sm:gap-2 items-center justify-items-center h-fit md:h-full"
            >
              {clients.map((client) => (
                <motion.div
                  key={client.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
                  }}
                  className="flex items-center justify-center cursor-default h-auto md:h-full w-full"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-auto object-contain transition-all dark:brightness-0 dark:invert dark:opacity-70 select-none user-select-none pointer-events-none"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/Expertise.tsx`:

```tsx
import { motion } from 'motion/react'

interface ExpertiseProps {
  imageSrc: string
}

export function Expertise({ imageSrc }: ExpertiseProps) {
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
              <img
                alt="Brand Strategy"
                className="w-full h-full object-cover transition-all duration-700 select-none user-select-none pointer-events-none"
                src={imageSrc}
                draggable="false"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-10 flex items-end"
          >
            <p className="font-['DM_Sans',sans-serif] text-[28px] md:text-[40px] leading-[1.2] text-foreground">
              Building consumer brands through{' '}
              <span className="underline decoration-brand-purple dark:decoration-brand-purple-dark decoration-[15%] underline-offset-[15%] decoration-skip-ink-none">
                content, KOL & growth strategy
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/CaseStudies.tsx`:

```tsx
import { ArrowRight } from 'lucide-react'
import { useOnceInView } from '@/hooks/useOnceInView'
import type { CaseStudy } from '@/types/content'

interface CaseStudiesProps {
  caseStudies: CaseStudy[]
}

export function CaseStudies({ caseStudies }: CaseStudiesProps) {
  const [headingRef, headingInView] = useOnceInView<HTMLDivElement>(0.3)
  const [gridRef, gridInView] = useOnceInView<HTMLDivElement>(0.05)

  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <div
          ref={headingRef}
          className={`mb-10 ${headingInView ? 'anim-fade-in-up' : 'opacity-0'}`}
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            Featured Projects
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={caseStudy.slug}
              className={`border border-border p-6 md:p-8 bg-card group cursor-pointer transition-colors hover:border-brand-purple ${gridInView ? 'anim-fade-in-up' : 'opacity-0'}`}
              style={gridInView ? { animationDelay: `${0.1 + index * 0.15}s` } : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-['DM_Sans',sans-serif] text-[12px] tracking-[0.7px] uppercase text-muted-foreground">
                  {caseStudy.category}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <ArrowRight size={20} />
                </div>
              </div>
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] md:text-[26px] leading-[1.2] mb-3 text-foreground">
                {caseStudy.title}
              </h3>
              <p className="font-['DM_Sans',sans-serif] font-medium text-[14px] text-primary mb-4">
                {caseStudy.metrics}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-[14px] md:text-[15px] leading-[1.6] text-foreground/80">
                {caseStudy.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/Testimonials.tsx`:

```tsx
import { useOnceInView } from '@/hooks/useOnceInView'
import type { Testimonial } from '@/types/content'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [headingRef, headingInView] = useOnceInView<HTMLDivElement>(0.3)
  const [gridRef, gridInView] = useOnceInView<HTMLDivElement>(0.05)

  return (
    <section id="testimonials" className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <div
          ref={headingRef}
          className={`mb-10 ${headingInView ? 'anim-fade-in-up' : 'opacity-0'}`}
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            What clients say
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`border border-border p-6 md:p-8 bg-card transition-colors hover:bg-accent/5 shadow-sm ${gridInView ? 'anim-fade-in-up' : 'opacity-0'}`}
              style={gridInView ? { animationDelay: `${0.2 + index * 0.15}s` } : undefined}
            >
              <p className="font-['Open_Sans',sans-serif] text-[14px] md:text-[15px] leading-[1.7] text-foreground/90 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-['DM_Sans',sans-serif] font-semibold text-[15px] text-foreground">
                  {testimonial.author}
                </p>
                <p className="font-['Open_Sans',sans-serif] text-[13px] text-muted-foreground/80 mt-1">
                  {testimonial.role}
                </p>
                <p className="font-['Open_Sans',sans-serif] text-[12px] text-muted-foreground/60 mt-0.5">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/Services.tsx`:

```tsx
import { motion } from 'motion/react'
import type { Service } from '@/types/content'

interface ServicesProps {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            Services
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border"
        >
          {services.map((service, index) => {
            const total = services.length
            const isLastMobile = index === total - 1
            const isLastTablet = index >= total - (total % 2 === 0 ? 2 : total % 2)
            const isLastDesktop = index >= total - (total % 3 === 0 ? 3 : total % 3)

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
                }}
                className={`
                  p-6 md:p-8 transition-colors hover:bg-brand-purple/5 border-border
                  border-r-0
                  sm:border-r sm:[&:nth-child(2n)]:border-r-0
                  lg:border-r lg:[&:nth-child(3n)]:border-r-0
                  lg:[&:nth-child(2n)]:border-r
                  ${isLastMobile ? 'border-b-0' : 'border-b'}
                  sm:${isLastTablet ? 'border-b-0' : 'border-b'}
                  lg:${isLastDesktop ? 'border-b-0' : 'border-b'}
                `}
              >
                <h4 className="font-['DM_Sans',sans-serif] font-semibold text-[18px] md:text-[20px] mb-4 text-foreground">
                  {service.title}
                </h4>
                <ul className="space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] Create `src/components/sections/Works.tsx`:

```tsx
import { motion } from 'motion/react'
import type { WorkCategory } from '@/types/content'

interface WorksProps {
  categories: WorkCategory[]
}

export function Works({ categories }: WorksProps) {
  return (
    <section id="works" className="border-b border-border bg-background w-full overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-border flex md:justify-end">
          <div className="w-full md:max-w-site-column p-6 md:p-10 flex md:justify-start">
            <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase">
              WORKS
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              initial="initial"
              whileHover="hover"
              className="relative border-b last:border-b-0 border-border w-full flex justify-start transition-all overflow-hidden hover:text-foreground hover:bg-accent/10 select-none group"
            >
              <div className="w-full md:max-w-site-column px-8 md:px-20 py-8 md:py-12">
                <div className="relative h-[60px] md:h-[80px] flex items-center overflow-hidden">
                  <motion.div
                    variants={{ initial: { y: 0, opacity: 1 }, hover: { y: -100, opacity: 0 } }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full"
                  >
                    <p className="font-['DM_Sans',sans-serif] font-medium text-[24px] md:text-[32px] leading-[1.2]">
                      {category.title}
                    </p>
                  </motion.div>
                  <motion.div
                    variants={{ initial: { y: 100, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex items-center"
                  >
                    <p className="font-['DM_Sans',sans-serif] text-[18px] md:text-[20px] leading-[1.5] text-foreground/80 max-w-[90%]">
                      {category.desc}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add src/components/sections/
git commit -m "feat: add section components to src/components/sections/"
```

---

### Task 10: Create router.tsx

**Files:**
- Create: `src/router.tsx`

- [ ] Create `src/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { CaseStudyPage } from '@/pages/CaseStudyPage'
import { WorkPage } from '@/pages/WorkPage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { ContactPage } from '@/pages/ContactPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/case-studies/:slug', element: <CaseStudyPage /> },
  { path: '/works/:slug', element: <WorkPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/contact', element: <ContactPage /> },
])
```

Note: This file won't compile until pages are created in Task 11-12. Create the stub pages first, then come back to verify.

---

### Task 11: Create pages/HomePage.tsx

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] Create `src/pages/HomePage.tsx`:

```tsx
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
import imgPersonal from '@/assets/personal-picture.png'
import imgIllustration from '@/assets/illustration-1.png'
import { clients } from '@/data/clients'
import { caseStudies } from '@/data/caseStudies'
import { testimonials } from '@/data/testimonials'
import { services } from '@/data/services'
import { workCategories } from '@/data/works'

export function HomePage() {
  return (
    <>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero scrollToSection={scrollToSection} />
          <About imageSrc={imgPersonal} />
          <NotableClients clients={clients} />
          <Expertise imageSrc={imgIllustration} />
          <Works categories={workCategories} />
          <CaseStudies caseStudies={caseStudies} />
          <Testimonials testimonials={testimonials} />
          <Services services={services} />
          <Footer scrollToSection={scrollToSection} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  )
}
```

---

### Task 12: Create stub pages

**Files:**
- Create: `src/pages/CaseStudyPage.tsx`
- Create: `src/pages/WorkPage.tsx`
- Create: `src/pages/BlogPage.tsx`
- Create: `src/pages/BlogPostPage.tsx`
- Create: `src/pages/ContactPage.tsx`

- [ ] Create `src/pages/CaseStudyPage.tsx`:

```tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { CaseStudy } from '@/types/content'

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)

  useEffect(() => {
    if (slug) cms.getCaseStudy(slug).then(setCaseStudy)
  }, [slug])

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['DM_Sans',sans-serif] text-muted-foreground">
          {caseStudy === null ? 'Loading…' : 'Case study not found.'}
        </p>
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
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80">{caseStudy.desc}</p>
    </div>
  )
}
```

- [ ] Create `src/pages/WorkPage.tsx`:

```tsx
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
```

- [ ] Create `src/pages/BlogPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    cms.getPosts().then(setPosts)
  }, [])

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto">
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-10 text-foreground">
        Blog
      </h1>
      {posts.length === 0 ? (
        <p className="font-['Open_Sans',sans-serif] text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="border border-border p-6">
              <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] mb-2 text-foreground">
                {post.title}
              </h2>
              <p className="font-['Open_Sans',sans-serif] text-[14px] text-muted-foreground mb-2">
                {post.publishedAt}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-[15px] text-foreground/80">{post.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] Create `src/pages/BlogPostPage.tsx`:

```tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Post } from '@/types/content'

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
      <p className="font-['Open_Sans',sans-serif] text-[13px] text-muted-foreground mb-4">{post.publishedAt}</p>
      <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-6 text-foreground">
        {post.title}
      </h1>
      <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80">{post.excerpt}</p>
    </div>
  )
}
```

- [ ] Create `src/pages/ContactPage.tsx`:

```tsx
export function ContactPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
          Contact
        </h1>
        <a
          href="mailto:hello@rare.studio"
          className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline"
        >
          hello@rare.studio
        </a>
      </div>
    </div>
  )
}
```

- [ ] Verify build (Tasks 10–12 together):

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds — router.tsx and all pages now compile

- [ ] Commit:

```bash
git add src/router.tsx src/pages/
git commit -m "feat: add router and pages (HomePage, CaseStudy, Work, Blog, Contact)"
```

---

### Task 13: Switch main.tsx to RouterProvider (the switchover)

**Files:**
- Modify: `src/main.tsx`

This is the moment the app switches over from `App.tsx` to the new structure. After this step, open the dev server and verify the site renders correctly.

- [ ] Write `src/main.tsx` (replace entirely):

```tsx
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/router'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeTransitionProvider } from '@/components/ThemeTransitionContext'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <ThemeTransitionProvider>
      <RouterProvider router={router} />
    </ThemeTransitionProvider>
  </ThemeProvider>
)
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Start dev server and confirm the site renders:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run dev
```

Open http://localhost:5173. Verify:
- [ ] Portfolio loads with all sections visible
- [ ] Dark/light mode toggle works
- [ ] Smooth scroll works
- [ ] Navbar links scroll to correct sections
- [ ] Custom cursor appears on desktop

- [ ] Commit:

```bash
git add src/main.tsx
git commit -m "feat: switch to RouterProvider and new component structure"
```

---

### Task 14: Delete src/app/ and Figma import artifacts

**Files:**
- Delete: `src/app/` (entire directory)
- Delete: `src/imports/MacBookAir4.tsx`
- Delete: `src/imports/svg-kpnmpaf0cj.ts`
- Delete: `src/imports/image-0.png`

- [ ] Delete old directories:

```bash
rm -rf "/Users/ardyan/Downloads/Enhance Personal Portfolio Site/src/app"
rm -rf "/Users/ardyan/Downloads/Enhance Personal Portfolio Site/src/imports"
```

- [ ] Verify build still passes (confirming nothing relied on the deleted files):

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds with no import errors

- [ ] Commit:

```bash
git add -A
git commit -m "chore: delete src/app/ and Figma import artifacts"
```

---

### Task 15: Fix package.json name

**Files:**
- Modify: `package.json`

- [ ] Open `package.json` and change line 2:

```diff
-  "name": "@figma/my-make-file",
+  "name": "portfolio",
```

- [ ] Verify build:

```bash
cd "/Users/ardyan/Downloads/Enhance Personal Portfolio Site" && npm run build
```

Expected: Build succeeds

- [ ] Commit:

```bash
git add package.json
git commit -m "chore: fix package name from Figma export artifact"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|------------------|-----------|
| Remove `src/app/` nesting | Task 14 |
| PascalCase component files | Tasks 7–9 |
| `pages/` for 6 routes | Tasks 10–11 |
| `lib/cms/` with interface + adapters | Task 3 |
| `types/content.ts` | Task 1 |
| `data/` files from App.tsx | Task 2 |
| `hooks/useOnceInView` | Task 5 |
| `components/layout/` for Navbar + Footer | Task 8 |
| `components/ImageWithFallback` (not figma/) | Task 5 |
| `lib/scrollTo.ts` (no prop drilling) | Task 4 + Tasks 8–9 |
| `window.lenis` typed | Task 4 |
| Remove `"use client"` | All new files omit it |
| `@/` imports throughout | All new files use `@/` |
| Delete Figma artifacts | Task 14 |
| Fix `package.json` name | Task 15 |
| VITE_CMS_ADAPTER env var | Task 3 |

**Placeholder scan:** No TBDs. Stub pages have real (minimal) implementations — they fetch from `cms` and render actual data. `sanityRepo` throws a descriptive error until configured.

**Type consistency:** `WorkCategory` defined in Task 1, used in `data/works.ts` (Task 2) and `Works.tsx` (Task 9). `CaseStudy.slug` added as required field — data file in Task 2 includes slugs. `useOnceInView` in Task 5 drops the `label` parameter that was only used for debug logging — callers in Tasks 9 pass only `amount`. All consistent.
