export function ContactPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-site-container mx-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-['DM_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] mb-4 text-foreground">
          Contact
        </h1>
        <a
          href="mailto:hello@rare.studio"
          className="font-['DM_Sans',sans-serif] text-[20px] md:text-[24px] text-primary hover:underline"
        >
          hello@rare.studio
        </a>
      </div>
    </div>
  )
}
