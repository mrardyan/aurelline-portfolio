interface Props {
  images: string[]
  alt?: string
}

export function ImageMasonry({ images, alt = '' }: Props) {
  return (
    <div className="columns-1 sm:columns-2 gap-3">
      {images.map((url, i) => (
        <div key={i} className="break-inside-avoid mb-3">
          <img
            src={url}
            alt={`${alt} ${i + 1}`}
            className="w-full block"
          />
        </div>
      ))}
    </div>
  )
}
