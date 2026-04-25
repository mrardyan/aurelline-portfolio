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
      title: 'Metrics (legacy)',
      type: 'string',
      description: 'Used on homepage cards. e.g. "12M+ Reach • 450% Engagement Increase"',
    }),
    defineField({
      name: 'metricItems',
      title: 'Metric Items',
      type: 'array',
      description: 'Structured metrics shown in the detail page header bar.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "+40%"' }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Conversion rate"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name: 'desc',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width image displayed between the header and body. Recommended: 1600×600px.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Displayed after the body content as a gallery.',
    }),
    defineField({
      name: 'imageLayout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      description: 'How to display gallery images. Defaults to masonry if unset.',
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
