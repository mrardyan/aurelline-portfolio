import type { ContentRepository } from './index'
import type { Homepage, Contact } from '@/types/content'
import { caseStudies } from '@/data/caseStudies'

const DEFAULT_SECTION_ORDER = ['about', 'clients', 'expertise', 'caseStudies', 'testimonials', 'services']

const homepage: Homepage = {
  hero: {
    headline: 'between viral moments and brand growth.',
    subtext: '',
    ctaLabel: 'View Work',
  },
  about: {
    bio: [],
    photo: '',
  },
  clients: [],
  expertise: {
    image: '',
    title: 'Building consumer brands through content, KOL & growth strategy',
    categories: [
      { title: 'Campaign & Content', desc: 'High-impact creative campaigns and content strategy' },
      { title: 'Key Opinion Leader', desc: 'Strategic KOL partnerships and influencer management' },
      { title: 'Brand Strategic', desc: 'Comprehensive brand positioning and growth planning' },
    ],
  },
  testimonials: [],
  services: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  contact: { email: 'hello@rare.studio', socialLinks: [] },
}

const contact: Contact = { email: 'hello@rare.studio', socialLinks: [] }

export const staticRepo: ContentRepository = {
  getCaseStudies: () => Promise.resolve(caseStudies),
  getCaseStudy: (slug) => Promise.resolve(caseStudies.find((cs) => cs.slug === slug) ?? null),
  getPosts: () => Promise.resolve([]),
  getPost: () => Promise.resolve(null),
  getHomepage: () => Promise.resolve(homepage),
  getContact: () => Promise.resolve(contact),
}
