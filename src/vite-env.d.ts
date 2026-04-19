/// <reference types="vite/client" />

interface LenisInstance {
  scrollTo(
    target: HTMLElement | string | number,
    options?: { offset?: number; duration?: number }
  ): void
  raf(time: number): void
  destroy(): void
}

declare global {
  interface Window {
    lenis?: LenisInstance
  }
}
