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
