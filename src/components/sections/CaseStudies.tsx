import { PORTFOLIO } from '@/data/portfolio-content';
import { SectionShell } from './SectionShell';
import { SectionHeader } from './SectionHeader';
import { EditorialCard } from './EditorialCard';
import { MetricChips } from './MetricChips';
import { TextLinkArrow } from './TextLinkArrow';

export function CaseStudies() {
  const { header, items } = PORTFOLIO.cases;
  const [featured, ...secondary] = items;

  return (
    <SectionShell id="cases">
      <SectionHeader {...header} />

      {/* Featured card */}
      <EditorialCard className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-muted-foreground">{featured.number}</span>
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-sans">
                {featured.category}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-1">
              {featured.title}
            </h3>
            <p className="text-xs font-sans text-muted-foreground mb-4">
              {featured.roleLine}
            </p>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-5 max-w-lg">
              {featured.summary}
            </p>
            <MetricChips metrics={featured.metrics} />
          </div>
          <div className="md:self-end shrink-0">
            {featured.status === 'stub' ? (
              <span className="text-xs text-muted-foreground font-sans px-2 py-0.5 bg-secondary/60 rounded">Case study coming soon</span>
            ) : (
              <TextLinkArrow label="Open case study" href={featured.href} />
            )}
          </div>
        </div>
      </EditorialCard>

      {/* Secondary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondary.map((c, i) => (
          <EditorialCard key={c.slug} delay={i * 80}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-muted-foreground">{c.number}</span>
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-sans">
                {c.category}
              </span>
            </div>
            <h3 className="text-xl font-serif text-foreground mb-1">{c.title}</h3>
            <p className="text-xs font-sans text-muted-foreground mb-3">{c.roleLine}</p>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4">
              {c.summary}
            </p>
            <MetricChips metrics={c.metrics} />
            <div className="mt-4">
              {c.status === 'stub' ? (
                <span className="text-xs text-muted-foreground font-sans px-2 py-0.5 bg-secondary/60 rounded">Coming soon</span>
              ) : (
                <TextLinkArrow label="Open case study" href={c.href} />
              )}
            </div>
          </EditorialCard>
        ))}
      </div>
    </SectionShell>
  );
}
