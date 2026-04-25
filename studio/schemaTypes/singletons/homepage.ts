import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
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
