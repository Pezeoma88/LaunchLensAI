export interface Competitor {
  name: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
}

export interface Patent {
  title: string;
  numberOrRef: string;
  relation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  workaround: string;
}

export interface DomainSuggestion {
  domainName: string;
  tld: string;
  status: 'Highly Likely' | 'Moderately Likely' | 'Premium/Taken';
  suitabilityScore: number;
  why: string;
}

export interface MarketSizeData {
  tamValue: string;
  tamDesc: string;
  samValue: string;
  samDesc: string;
  somValue: string;
  somDesc: string;
  chartData: {
    name: string;
    value: number;
    label: string;
  }[];
}

export interface MonetizationStrategy {
  strategyName: string;
  description: string;
  pricingSuggestion: string;
  pros: string[];
  cons: string[];
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface LaunchPhase {
  phase: string;
  timeline: string;
  milestones: string[];
  tactics: string[];
}

export interface BusinessAnalysisReport {
  id: string;
  createdAt: string;
  inputIdea: string;
  industry?: string;
  targetAudience?: string;

  favorite?: boolean;

  businessName: string;
  elevatorPitch: string;
  competitors: Competitor[];
  patents: Patent[];
  domains: DomainSuggestion[];
  marketSize: MarketSizeData;
  monetization: MonetizationStrategy[];
  swot: SWOTData;
  launchStrategy: LaunchPhase[];
}