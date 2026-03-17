import { PORTFOLIO } from '@/data/portfolio-content';
import { SectionShell } from './SectionShell';
import { SectionHeader } from './SectionHeader';
import { EditorialCard } from './EditorialCard';
import { Settings, Search, Radio } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  workflow: Settings,
  incident: Search,
  signal: Radio,
};

export function Strengths() {
  const { header, items } = PORTFOLIO.strengths;

  return (
    <SectionShell id="strengths">
      <SectionHeader {...header} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((s, i) => {
          const Icon = ICONS[s.iconKey];
          return (
          <EditorialCard key={s.title} delay={i * 80}>
            <div className="flex items-center gap-2 mb-3">
              {Icon ? <Icon size={16} className="text-accent" /> : <span className="text-base text-accent" aria-hidden>●</span>}
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-muted-foreground">
                {s.eyebrow}
              </span>
            </div>
            <h3 className="text-lg font-serif text-foreground mb-2 leading-snug">{s.title}</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              {s.description}
            </p>
          </EditorialCard>
          );
        })}
      </div>
    </SectionShell>
  );
}
