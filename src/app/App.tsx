"use client";

import { useState } from "react";
import { Hero } from "./components/sections/hero";
import { About } from "./components/sections/about";
import { NotableClients } from "./components/sections/notable-clients";
import { Expertise } from "./components/sections/expertise";
import { Works } from "./components/works";
import { CaseStudies } from "./components/sections/case-studies";
import { Testimonials } from "./components/sections/testimonials";
import { Services } from "./components/sections/services";
import { Footer } from "./components/sections/footer";
import { SmoothScroll } from "./components/smooth-scroll";
import { ThemeTransitionOverlay } from "./components/theme-transition-overlay";
import { CustomCursor } from "./components/custom-cursor";

// Assets
import imgImage2 from "../assets/personal-picture.png";
import imgFrame21023 from "../assets/illustration-1.png";
import logoPhilips from "../assets/logo-philips.svg";
import logoRoyalCanin from "../assets/logo-royalcanin.svg";
import logoTokopedia from "../assets/logo-tokopedia.svg";
import logoPurina from "../assets/logo-purina.svg";
import logoCapCut from "../assets/logo-capcut.svg";
import logoPetkit from "../assets/logo-petkit.png";
import logoTikTok from "../assets/logo-tiktok.svg";
import logoBarbie from "../assets/logo-barbie.svg";
import logoShopee from "../assets/logo-shopee.svg";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Campaign & Content");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && (window as any).lenis) {
      (window as any).lenis.scrollTo(element, { offset: 0, duration: 1.5 });
    } else {
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clients = [
    { name: "Philips", logo: logoPhilips },
    { name: "Royal Canin", logo: logoRoyalCanin },
    { name: "Tokopedia", logo: logoTokopedia },
    { name: "Purina", logo: logoPurina },
    { name: "CapCut", logo: logoCapCut },
    { name: "Petkit", logo: logoPetkit },
    { name: "TikTok", logo: logoTikTok },
    { name: "Barbie", logo: logoBarbie },
    { name: "Shopee", logo: logoShopee },
  ];

  const worksCategories = [
    {
      title: "Campaign & Content",
      desc: "High-impact creative campaigns and content strategy",
    },
    {
      title: "Key Opinion Leader",
      desc: "Strategic KOL partnerships and influencer management",
    },
    {
      title: "Brand Strategic",
      desc: "Comprehensive brand positioning and growth planning",
    },
  ];

  const caseStudies = [
    {
      title: "Barbie x Shopee Campaign",
      category: "Campaign & Content",
      metrics: "12M+ Reach • 450% Engagement Increase",
      desc: "Led end-to-end campaign strategy for Barbie movie launch, orchestrating influencer partnerships and creating viral content that generated 12M+ impressions across platforms.",
    },
    {
      title: "TikTok Brand Accelerator",
      category: "Brand Strategy",
      metrics: "200K+ New Followers • 8x ROI",
      desc: "Developed comprehensive TikTok growth strategy for consumer electronics brand, resulting in 200K+ follower growth and 8x return on ad spend within 3 months.",
    },
    {
      title: "Royal Canin KOL Network",
      category: "KOL Management",
      metrics: "50+ Creators • 25M Impressions",
      desc: "Built and managed network of 50+ pet influencers, creating authentic content ecosystem that drove 25M impressions and 35% increase in brand consideration.",
    },
    {
      title: "Philips Product Launch",
      category: "Integrated Campaign",
      metrics: "300% Sales Lift • Award Winning",
      desc: "Orchestrated multi-channel product launch combining PR, influencer, and paid media. Campaign won Silver at Marketing Excellence Awards and exceeded sales targets by 300%.",
    },
  ];

  const testimonials = [
    {
      quote: "Rare transformed our brand presence on TikTok. Her understanding of platform dynamics and creator relationships is unmatched. We saw 10x growth in 6 months.",
      author: "Sarah Chen",
      role: "VP Marketing, Consumer Electronics Brand",
      company: "Fortune 500 Tech Company",
    },
    {
      quote: "Working with Rare was a masterclass in strategic thinking. She doesn't just execute campaigns—she builds ecosystems that drive sustainable growth.",
      author: "Michael Torres",
      role: "Brand Director",
      company: "Global Beauty Retailer",
    },
    {
      quote: "Her ability to identify and activate the right KOLs is exceptional. The influencer network she built for us continues to drive value years later.",
      author: "Lisa Anderson",
      role: "Head of Digital",
      company: "Premium Pet Care Brand",
    },
    {
      quote: "Rare brings a rare combination of creative vision and analytical rigor. Every campaign is backed by data but never loses its human touch.",
      author: "David Kim",
      role: "CMO",
      company: "E-Commerce Platform",
    },
    {
      quote: "She turned our product launch into a cultural moment. The buzz and sales exceeded all expectations. Truly one of the best in the industry.",
      author: "Emma Rodriguez",
      role: "Marketing Manager",
      company: "Consumer Appliances",
    },
    {
      quote: "Rare's strategic guidance helped us navigate the complex influencer landscape. Her network and insights are invaluable.",
      author: "James Park",
      role: "Founder & CEO",
      company: "DTC Lifestyle Brand",
    },
  ];

  const services = [
    {
      title: "Campaign Strategy",
      items: ["Creative Concepting", "Multi-Channel Planning", "Launch Execution", "Performance Optimization"],
    },
    {
      title: "Content Production",
      items: ["Video Production", "Photography Direction", "Content Calendars", "Asset Management"],
    },
    {
      title: "KOL Management",
      items: ["Influencer Sourcing", "Relationship Building", "Contract Negotiation", "Campaign Coordination"],
    },
    {
      title: "Brand Strategy",
      items: ["Market Positioning", "Audience Research", "Messaging Framework", "Brand Guidelines"],
    },
    {
      title: "Growth Marketing",
      items: ["Paid Social Strategy", "Performance Analytics", "A/B Testing", "Conversion Optimization"],
    },
    {
      title: "Event Production",
      items: ["Experiential Design", "Venue Coordination", "Guest Management", "Post-Event Amplification"],
    },
  ];

  return (
    <>
      <SmoothScroll>
        <div className="bg-background min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative">
          <ThemeTransitionOverlay />
          <Hero scrollToSection={scrollToSection} />
          <About imageSrc={imgImage2} />
          <NotableClients clients={clients} />
          <Expertise imageSrc={imgFrame21023} />
          <Works categories={worksCategories} />
          <CaseStudies caseStudies={caseStudies} />
          <Testimonials testimonials={testimonials} />
          <Services services={services} />
          <Footer scrollToSection={scrollToSection} />
        </div>
      </SmoothScroll>
      <CustomCursor />
    </>
  );
}
