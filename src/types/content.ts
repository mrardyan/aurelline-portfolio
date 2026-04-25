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
