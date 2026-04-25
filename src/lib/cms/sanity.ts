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
