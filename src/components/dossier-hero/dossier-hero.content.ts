import type { DossierPhaseContent } from './dossier-hero.types';

export const DOSSIER_PHASE_CONTENT: DossierPhaseContent = {
  closed: {
    eyebrow: 'Support Systems Operator',
    headline: 'Grigorii',
    roleStatement: 'I make support teams faster by building the tools they actually need.',
    cta: { label: 'View Resume', href: '/resume' },
  },
  open: {
    expansion: 'I automate the repetitive stuff, clean up escalations, and keep things from breaking twice.',
    whispers: ['There\'s always a pattern', 'You just have to look'],
  },
  flight: {
    proofStrip: [
      { value: '45%', label: 'Tier-1 reduction' },
      { value: '35%', label: 'Faster response' },
      { value: '70%', label: 'Less manual load' },
      { value: '112+', label: 'Indexed items' },
    ],
    spatialLabels: ['Fewer manual steps', 'Cleaner escalations', 'AI where it helps'],
  },
  flagship: {
    title: 'Darkest AFK',
    outcome: '112 items indexed, operators stopped guessing',
    context: 'Compensation lookup for support agents',
    cta: 'Open case study',
    href: '/cases/darkest-afk',
  },
  handoff: {
    ctas: [
      { label: 'View case studies', href: '#cases' },
      { label: 'Open resume', href: '/resume' },
      { label: 'Email', href: 'mailto:grigorii584@gmail.com' },
    ],
  },
};
