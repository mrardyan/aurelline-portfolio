"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useOnceInView } from "../use-once-in-view";

interface CaseStudy {
  title: string;
  category: string;
  metrics: string;
  desc: string;
}

interface CaseStudiesProps {
  caseStudies: CaseStudy[];
}

export function CaseStudies({ caseStudies }: CaseStudiesProps) {
  const [headingRef, headingInView] = useOnceInView<HTMLDivElement>(0.3, "case-heading");
  const [gridRef, gridInView] = useOnceInView<HTMLDivElement>(0.05, "case-grid");

  useEffect(() => {
    console.log("[CaseStudies] render — headingInView:", headingInView, "gridInView:", gridInView);
  });

  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-site-container mx-auto p-6 md:p-10">
        <div
          ref={headingRef}
          className={`mb-10 ${headingInView ? "anim-fade-in-up" : "opacity-0"}`}
        >
          <p className="font-['DM_Sans',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.2] text-muted-foreground tracking-[1.92px] uppercase mb-2">
            Featured Projects
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {caseStudies.map((caseStudy, index) => (
            <div
              key={index}
              className={`border border-border p-6 md:p-8 bg-card group cursor-pointer transition-colors hover:border-brand-purple ${gridInView ? "anim-fade-in-up" : "opacity-0"}`}
              style={gridInView ? { animationDelay: `${0.1 + index * 0.15}s` } : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-['DM_Sans',sans-serif] text-[12px] tracking-[0.7px] uppercase text-muted-foreground">
                  {caseStudy.category}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <ArrowRight size={20} />
                </div>
              </div>
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[22px] md:text-[26px] leading-[1.2] mb-3 text-foreground">
                {caseStudy.title}
              </h3>
              <p className="font-['DM_Sans',sans-serif] font-medium text-[14px] text-primary mb-4">
                {caseStudy.metrics}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-[14px] md:text-[15px] leading-[1.6] text-foreground/80">
                {caseStudy.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
