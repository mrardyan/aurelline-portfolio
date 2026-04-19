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
