import { PortableText } from '@portabletext/react'
import type { ComponentProps } from 'react'

type Value = ComponentProps<typeof PortableText>['value']

export type { Value as PortableTextValue }

interface Props {
  value: Value
}

export function PortableTextRenderer({ value }: Props) {
  return (
    <PortableText
      value={value}
      components={{
        block: {
          h2: ({ children }) => (
            <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[28px] md:text-[36px] mb-4 mt-10 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] md:text-[28px] mb-3 mt-8 text-foreground">
              {children}
            </h3>
          ),
          normal: ({ children }) => (
            <p className="font-['Open_Sans',sans-serif] text-[16px] leading-[1.7] text-foreground/80 mb-4 max-w-[65ch]">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-purple pl-6 my-6 font-['Open_Sans',sans-serif] text-[16px] italic text-foreground/70">
              {children}
            </blockquote>
          ),
        },
        marks: {
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          link: ({ value, children }) => (
            <a
              href={value?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
        },
        types: {
          image: ({ value }) => (
            <img
              src={value.asset?.url}
              alt={value.alt ?? ''}
              className="w-full my-8"
            />
          ),
        },
      }}
    />
  )
}
