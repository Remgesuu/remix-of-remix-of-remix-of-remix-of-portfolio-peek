export interface SectionHeaderData {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface CaseStudyPreview {
  slug: string;
  number: string;
  category: string;
  title: string;
  roleLine: string;
  summary: string;
  metrics: { value: string; label: string }[];
  href: string;
  status: 'live' | 'stub';
}

export interface TechnicalProject {
  badge: string;
  title: string;
  description: string;
  stack: string[];
  href: string;
}

export interface StrengthItem {
  iconKey: 'workflow' | 'incident' | 'signal';
  eyebrow: string;
  title: string;
  description: string;
}

export interface ContactEntry {
  label: string;
  value: string;
  href?: string;
}

export interface PortfolioContent {
  cases: {
    header: SectionHeaderData;
    items: CaseStudyPreview[];
  };
  technical: {
    header: SectionHeaderData;
    items: TechnicalProject[];
  };
  strengths: {
    header: SectionHeaderData;
    items: StrengthItem[];
  };
  contact: {
    headline: string;
    subtext: string;
    resumeCta: { label: string; href: string };
    entries: ContactEntry[];
  };
}
