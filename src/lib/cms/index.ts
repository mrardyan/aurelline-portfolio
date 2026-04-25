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
