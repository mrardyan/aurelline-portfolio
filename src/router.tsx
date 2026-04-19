import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { CaseStudyPage } from '@/pages/CaseStudyPage'
import { WorkPage } from '@/pages/WorkPage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { ContactPage } from '@/pages/ContactPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/case-studies/:slug', element: <CaseStudyPage /> },
  { path: '/works/:slug', element: <WorkPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/contact', element: <ContactPage /> },
])
