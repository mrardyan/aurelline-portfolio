import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt?: string
}

export function ImageCarousel({ images, alt = '' }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((url, i) => (
            <div key={i} className="flex-[0_0_85%] md:flex-[0_0_75%] mr-3 last:mr-0">
              <img
                src={url}
                alt={`${alt} ${i + 1}`}
                className="w-full aspect-[4/3] object-cover block"
              />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow transition-opacity hover:opacity-100 opacity-80"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={scrollNext}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow transition-opacity hover:opacity-100 opacity-80"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {images.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === selectedIndex
                  ? 'w-4 bg-foreground'
                  : 'w-1.5 bg-foreground/25 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
