export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (element && window.lenis) {
    window.lenis.scrollTo(element, { offset: 0, duration: 1.5 })
  } else {
    element?.scrollIntoView({ behavior: 'smooth' })
  }
}
