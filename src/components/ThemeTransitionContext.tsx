import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface ThemeTransitionContextType {
  isTransitioning: boolean
  toggleTheme: () => void
  transitionColors: { bg: string; logo: string }
}

const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(undefined)

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionColors, setTransitionColors] = useState({ bg: '#564BB4', logo: '#ffffff' })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    if (isTransitioningRef.current) return

    const isGoingToDark = resolvedTheme === 'light'
    setTransitionColors({
      bg: isGoingToDark ? 'oklch(0.145 0 0)' : '#ffffff',
      logo: isGoingToDark ? '#a89eff' : '#564BB4',
    })

    isTransitioningRef.current = true
    setIsTransitioning(true)

    timerRef.current = setTimeout(() => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      isTransitioningRef.current = false
      setIsTransitioning(false)
    }, 1800)
  }, [setTheme, resolvedTheme])

  return (
    <ThemeTransitionContext.Provider value={{ isTransitioning, toggleTheme, transitionColors }}>
      {children}
    </ThemeTransitionContext.Provider>
  )
}

export function useThemeTransition() {
  const context = useContext(ThemeTransitionContext)
  if (context === undefined) {
    throw new Error('useThemeTransition must be used within a ThemeTransitionProvider')
  }
  return context
}
