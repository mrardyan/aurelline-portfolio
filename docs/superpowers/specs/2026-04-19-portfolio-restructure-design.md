# Portfolio Site — Structure & Architecture Redesign

**Date:** 2026-04-19  
**Status:** Approved  

## Problem

The project was exported from Figma Make and carries several export artifacts that don't match idiomatic Vite + React conventions:

- All page content data (clients, case studies, testimonials, services, works) is hardcoded inside `App.tsx`, making it a 180-line monolith that mixes data with rendering
- `src/app/` nesting is unnecessary for a Vite project
- `"use client"` (Next.js directive) appears in Vite files — no effect, misleads readers
- `src/imports/` contains raw Figma artifacts with machine-generated names
- `components/figma/` carries Figma-branded naming into production code
- `use-once-in-view.ts` (a hook) lives inside `components/`
- `works.tsx` lives alongside layout components rather than inside `sections/`
- The `@/` path alias is configured in `vite.config.ts` but never used — all imports use deep relative paths
- `scrollToSection` is prop-drilled from `App` → `Hero` → `Navbar` and `App` → `Footer`
- `(window as any).lenis` uses an unsafe type cast
- `package.json` name is `@figma/my-make-file`

The site also needs to grow beyond a single page: case study detail pages, work/portfolio detail pages, a blog, and a contact page are planned, with Sanity as the CMS — but the CMS must be swappable without touching component code.

## Goals

1. Standard Vite + React folder structure that any React developer recognises immediately
2. Pages layer with React Router v7 for all planned routes
3. CMS-agnostic content layer — Sanity is one adapter, easily swapped via env var
4. All content types defined once in `types/content.ts` and shared everywhere
5. Eliminate Figma export artifacts and Next.js conventions from the codebase

## Out of Scope

- Removing unused npm dependencies (risk of breakage, separate concern)
- shadcn `ui/` components (generated code, leave untouched)
- Tailwind / CSS configuration (already correct)
- Vite config (already has `@` alias and figma asset resolver — keep as-is)
- Implementing Sanity schema or studio setup

---

## Section 1: Folder Structure

### New layout

```
src/
  pages/
    HomePage.tsx          # all portfolio sections assembled
    CaseStudyPage.tsx     # /case-studies/:slug
    WorkPage.tsx          # /works/:slug
    BlogPage.tsx          # /blog — post listing
    BlogPostPage.tsx      # /blog/:slug — single post
    ContactPage.tsx       # /contact — inquiry form
  components/
    sections/             # page sections (Hero, About, Footer, Works, …)
    ui/                   # shadcn primitives — unchanged
    layout/               # Navbar, Footer extracted here
    ImageWithFallback.tsx # renamed from components/figma/ImageWithFallback
  lib/
    cms/
      index.ts            # ContentRepository interface + adapter selector
      sanity.ts           # Sanity adapter (GROQ queries)
      static.ts           # local data fallback / dev mock
    scrollTo.ts           # scrollToSection utility + window.lenis type
  hooks/
    useOnceInView.ts      # moved from components/
  types/
    content.ts            # CaseStudy, Work, Post, Client, Testimonial, Service
  data/                   # static content — used by static.ts adapter
    clients.ts
    caseStudies.ts
    testimonials.ts
    services.ts
    works.ts
  assets/                 # images and SVGs — unchanged
  styles/                 # CSS files — unchanged
  router.tsx              # createBrowserRouter — all route definitions
  main.tsx                # renders RouterProvider wrapped in providers
  vite-env.d.ts           # add window.lenis type declaration
```

### Key structural decisions

- **Remove `src/app/` nesting.** Vite projects keep components directly under `src/`. The `app/` wrapper is a Next.js / Create React App convention.
- **Delete `src/imports/`.** `MacBookAir4.tsx` and `svg-kpnmpaf0cj.ts` are Figma export artifacts. Each is either renamed and moved to the appropriate location, or deleted if unused.
- **Move `works.tsx` into `sections/`.** It is a page section; it belongs with the other sections.
- **Rename component files to PascalCase.** `hero.tsx` → `Hero.tsx`, `navbar.tsx` → `Navbar.tsx`, etc. Hooks stay camelCase (`useOnceInView.ts`).
- **Remove `components/figma/` subfolder.** `ImageWithFallback.tsx` moves to `components/ImageWithFallback.tsx`.

---

## Section 2: Routing

React Router v7 is already installed. `router.tsx` exports a single `createBrowserRouter`:

```
/                      → HomePage
/case-studies/:slug    → CaseStudyPage
/works/:slug           → WorkPage
/blog                  → BlogPage
/blog/:slug            → BlogPostPage
/contact               → ContactPage
```

`main.tsx` renders `<RouterProvider router={router} />` wrapped in `ThemeProvider` and `ThemeTransitionProvider` (same as today, no change to providers).

`HomePage` assembles all the existing portfolio sections — it is a direct extraction of what `App.tsx` renders today, minus the hardcoded data.

---

## Section 3: CMS Abstraction Layer

### Interface (`lib/cms/index.ts`)

```ts
export interface ContentRepository {
  getCaseStudies(): Promise<CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
  getWorks(): Promise<Work[]>
  getWork(slug: string): Promise<Work | null>
  getPosts(): Promise<Post[]>
  getPost(slug: string): Promise<Post | null>
}

// Selects adapter based on VITE_CMS_ADAPTER env var
// 'sanity' → sanityRepo, anything else → staticRepo
export const cms: ContentRepository
```

### Sanity adapter (`lib/cms/sanity.ts`)

- Uses `@sanity/client` with `projectId`, `dataset`, `apiVersion` from env vars (`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`)
- Each method executes a GROQ query and returns typed results
- Added as a dependency only when the Sanity adapter is wired up

### Static adapter (`lib/cms/static.ts`)

- Imports directly from `data/` files and wraps in `Promise.resolve()`
- Used in local dev when `VITE_CMS_ADAPTER` is unset or `'static'`
- Means the site works fully offline without any Sanity credentials

### Switching adapters

```
VITE_CMS_ADAPTER=sanity   → production (reads from Sanity)
VITE_CMS_ADAPTER=static   → local dev (reads from data/ files)
(unset)                   → defaults to static
```

No component ever imports `sanity.ts` or `static.ts` directly. All pages import only `cms` from `@/lib/cms`.

---

## Section 4: Types (`types/content.ts`)

```ts
interface CaseStudy  { slug: string; title: string; category: string; metrics: string; desc: string; body?: unknown; images?: string[] }
interface Work       { slug: string; title: string; category: string; thumbnail?: string; body?: unknown }
interface Post       { slug: string; title: string; publishedAt: string; excerpt: string; body?: unknown }
interface Client     { name: string; logo: string }
interface Testimonial{ quote: string; author: string; role: string; company: string }
interface Service    { title: string; items: string[] }
```

Both CMS adapters and all page components import from `@/types/content` — content shape is defined once.

---

## Section 5: Cleanup

| Item | Action |
|------|--------|
| `"use client"` in `App.tsx`, `hero.tsx` | Remove — Next.js directive, no effect in Vite |
| All relative `../../` imports | Replace with `@/` equivalents |
| `scrollToSection` prop drilling | Extract to `lib/scrollTo.ts`; Navbar and Footer import directly |
| `(window as any).lenis` | Type via `declare global { interface Window { lenis?: LenisInstance } }` in `vite-env.d.ts` |
| `package.json` name | `@figma/my-make-file` → `portfolio` |
| `src/imports/MacBookAir4.tsx` | Audit usage; rename/move or delete |
| `src/imports/svg-kpnmpaf0cj.ts` | Audit usage; rename/move or delete |
| Hardcoded data in `App.tsx` | Extract to `data/*.ts` files; `App.tsx` (now `HomePage.tsx`) imports from there |

---

## Error Handling

- `cms.getCaseStudy(slug)` returns `null` for unknown slugs — pages render a 404 state
- CMS adapter failures surface as thrown errors — wrap page data fetching in error boundaries or try/catch with fallback UI

## Testing Approach

- Static adapter makes unit-testing pages straightforward — no Sanity credentials needed
- Swap adapter in tests: `vi.mock('@/lib/cms', () => ({ cms: staticRepo }))`
