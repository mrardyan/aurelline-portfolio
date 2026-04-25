import { defineType, defineField } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'string',
      description: 'e.g. "12M+ Reach • 450% Engagement Increase"',
    }),
    defineField({
      name: 'desc',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Page Title', type: 'string', description: '~50–60 chars. Defaults to the case study title.' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, description: '~150–160 chars. Defaults to the summary.' }),
        defineField({ name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Recommended: 1200×630px.', options: { hotspot: true } }),
        defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
