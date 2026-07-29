export interface SampleIdea {
  title: string;
  industry: string;
  audience: string;
  idea: string;
}

export const SAMPLE_IDEAS: SampleIdea[] = [
  {
    title: "Eco-Subscription Box",
    industry: "E-commerce & Consumer Goods",
    audience: "Eco-conscious millennials & zero-waste households",
    idea: "A monthly subscription service offering curated, zero-plastic, biodegradable household and personal care alternatives (shampoo bars, bamboo toothbrushes, natural cleaning concentrates)."
  },
  {
    title: "AI-Contract Risk Assessor",
    industry: "LegalTech & B2B SaaS",
    audience: "Freelancers, independent agencies, and small startups",
    idea: "A lightweight web app where non-lawyers upload consulting/vendor contracts and get instant, color-coded risk scoring on indemnification, intellectual property, and termination clauses with plain-English workaround advice."
  },
  {
    title: "Micro-SaaS for Local SEO",
    industry: "Marketing Technology",
    audience: "Local mom-and-pop shops (bakeries, plumbers, boutiques)",
    idea: "A simple, automated dashboard that scans local listings, auto-generates response suggestions for Google Reviews using AI, and schedules highly localized content updates to boost regional search rankings."
  },
  {
    title: "Peer-to-Peer Gear Sharing",
    industry: "Sharing Economy & Outdoor",
    audience: "Occasional outdoor enthusiasts and camper/hiker hobbyists",
    idea: "A localized marketplace where people can list and rent high-end outdoor equipment (tents, backpacks, kayaks, snowboards) from verified neighbors, including integrated safety waivers and transit insurance."
  }
];
