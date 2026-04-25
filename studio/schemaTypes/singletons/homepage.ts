import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  preview: { prepare: () => ({ title: 'Homepage' }) },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'string' }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'object',
      fields: [
        defineField({
          name: 'bio',
          title: 'Bio',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'logo', title: 'Logo', type: 'image' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Illustration',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'title', title: 'Tagline', type: 'string' }),
        defineField({
          name: 'categories',
          title: 'Disciplines',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'desc', title: 'Description', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
            defineField({ name: 'author', title: 'Author', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'company', title: 'Company', type: 'string' }),
          ],
          preview: { select: { title: 'author', subtitle: 'company' } },
        },
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Page Title', type: 'string', description: 'Appears in browser tab and search results. ~50–60 chars.' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, description: 'Summary shown in search results. ~150–160 chars.' }),
        defineField({ name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Used when shared on LinkedIn, X, WhatsApp etc. Recommended: 1200×630px.', options: { hotspot: true } }),
        defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
    defineField({
      name: 'sectionOrder',
      title: 'Section Order',
      description: 'Drag to reorder. Fixed: Navbar → Hero → [below] → Footer',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'About', value: 'about' },
              { title: 'Clients', value: 'clients' },
              { title: 'Expertise & Disciplines', value: 'expertise' },
              { title: 'Case Studies', value: 'caseStudies' },
              { title: 'Testimonials', value: 'testimonials' },
              { title: 'Services', value: 'services' },
            ],
          },
        },
      ],
    }),
  ],
})
