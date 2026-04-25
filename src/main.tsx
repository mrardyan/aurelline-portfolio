import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/router'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeTransitionProvider } from '@/components/ThemeTransitionContext'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeTransitionProvider>
        <RouterProvider router={router} />
      </ThemeTransitionProvider>
    </ThemeProvider>
  </HelmetProvider>
)
