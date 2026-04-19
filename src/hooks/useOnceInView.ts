import { useEffect, useRef, useState } from 'react'

export function useOnceInView<T extends HTMLElement = HTMLElement>(
  amount = 0.1,
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          setInView(true)
        }
      },
      { threshold: amount }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [amount])

  return [ref, inView] as const
}
