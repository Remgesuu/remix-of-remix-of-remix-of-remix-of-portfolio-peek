import type { PortfolioContent } from './portfolio-content.types';

export const PORTFOLIO: PortfolioContent = {
  cases: {
    header: {
      eyebrow: 'Case Studies',
      title: 'Operator-led outcomes',
      description:
        'What I worked on, what I did, what changed.',
    },
    items: [
      {
        slug: 'darkest-afk',
        number: '01',
        category: 'Support Systems Design',
        title: 'Darkest AFK',
        roleLine: 'Support Operator · Heapp Games',
        summary:
          'Made a bilingual lookup table for 112+ in-game items so operators could handle compensation requests without guessing or asking each other.',
        metrics: [
          { value: '112+', label: 'Indexed items' },
          { value: '~40%', label: 'Faster resolution' },
          { value: 'Bilingual', label: 'EN / RU coverage' },
        ],
        href: '/cases/darkest-afk',
        status: 'stub',
      },
      {
        slug: 'dig-dig-die',
        number: '02',
        category: 'Feedback Intelligence',
        title: 'Dig Dig Die',
        roleLine: 'QA & Feedback Analyst · Heapp Games',
        summary:
          'Pulled 23 bug reports from community channels, wrote them up properly, and got them into the dev sprint backlog.',
        metrics: [
          { value: '23', label: 'Structured issues' },
          { value: 'Priority', label: 'Backlog created' },
          { value: 'Cross-team', label: 'Dev ↔ Support' },
        ],
        href: '/cases/dig-dig-die',
        status: 'stub',
      },
      {
        slug: 'vacation-cafe',
        number: '03',
        category: 'Retention & Friction Analysis',
        title: 'Vacation Cafe',
        roleLine: 'Support Analyst · Heapp Games',
        summary:
          'Spotted the support issues that were making players quit and wrote up UX fixes for the product team.',
        metrics: [
          { value: 'Retention', label: 'Main problem' },
          { value: 'UX fixes', label: 'Proposed to product' },
          { value: 'Player data', label: 'From support tickets' },
        ],
        href: '/cases/vacation-cafe',
        status: 'stub',
      },
    ],
  },

  technical: {
    header: {
      eyebrow: 'Technical Work',
      title: 'Shipped builds',
      description: 'Things I built outside of ticket work.',
    },
    items: [
      {
        badge: 'Shipped build',
        title: 'Jarvis v1',
        description:
          'Local AI tool I use daily — handles task lists, pulls context from old notes, and writes summaries so I don\'t have to.',
        stack: ['Python', 'FastAPI', 'SQLite', 'Chroma', 'LangChain'],
        href: 'https://github.com/ocejoestrellita116-dev',
      },
      {
        badge: 'Shipped build',
        title: 'Vacation Dashboard React',
        description:
          'Dashboard for sorting through player feedback. Shows which issues keep coming back and where players drop off.',
        stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Recharts'],
        href: 'https://github.com/ocejoestrellita116-dev',
      },
    ],
  },

  strengths: {
    header: {
      eyebrow: 'Strengths',
      title: 'What I bring',
    },
    items: [
      {
        iconKey: 'workflow',
        eyebrow: 'Automation',
        title: 'Workflow automation & operator tooling',
        description:
          'I build the macros, scripts, and small tools that save operators from copy-pasting the same thing 40 times a day.',
      },
      {
        iconKey: 'incident',
        eyebrow: 'Incidents',
        title: 'Incident handling & issue reproduction',
        description:
          'When something breaks, I write it up so devs can reproduce it on the first try instead of asking five follow-up questions.',
      },
      {
        iconKey: 'signal',
        eyebrow: 'Systems',
        title: 'Signal packaging & systems thinking',
        description:
          'I read 200 tickets and tell you the three things that actually matter. Product, QA, and leads get a summary, not a spreadsheet dump.',
      },
    ],
  },

  contact: {
    headline: 'Let\'s connect',
    subtext: 'Looking for support ops and technical support work. Remote, EU timezone.',
    resumeCta: { label: 'Open resume', href: '/resume' },
    entries: [
      { label: 'Email', value: 'grigorii584@gmail.com', href: 'mailto:grigorii584@gmail.com' },
      { label: 'GitHub', value: 'ocejoestrellita116-dev', href: 'https://github.com/ocejoestrellita116-dev' },
      { label: 'Location', value: 'Remote · EU timezone' },
    ],
  },
};
