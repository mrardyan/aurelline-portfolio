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
