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

export interface Seo {
  title?: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

export interface Homepage {
  seo?: Seo
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

export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'x' | 'tiktok' | 'whatsapp' | 'thread'

export interface Contact {
  tagline?: string
  email: string
  socialLinks: { platform: SocialPlatform; url: string }[]
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
