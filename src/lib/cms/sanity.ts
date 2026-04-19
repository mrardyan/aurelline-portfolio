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
