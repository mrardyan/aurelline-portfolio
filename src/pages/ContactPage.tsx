import { useEffect, useState } from 'react'
import { cms } from '@/lib/cms'
import type { Contact } from '@/types/content'

export function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    cms.getContact().then(setContact)
  }, [])

  const email = contact?.email ?? 'hello@rare.studio'

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
          Contact
        </h1>
        <a
          href={`mailto:${email}`}
          className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline"
        >
          {email}
        </a>
        {contact?.socialLinks && contact.socialLinks.length > 0 && (
          <div className="mt-6 flex gap-4 justify-center">
            {contact.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['DM_Sans',sans-serif] text-[15px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
