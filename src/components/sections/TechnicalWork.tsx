import { PORTFOLIO } from '@/data/portfolio-content';
import { SectionShell } from './SectionShell';
import { SectionHeader } from './SectionHeader';
import { EditorialCard } from './EditorialCard';

export function TechnicalWork() {
  const { header, items } = PORTFOLIO.technical;

  return (
    <SectionShell id="technical-work">
      <SectionHeader {...header} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((project, i) => (
          <EditorialCard key={project.title} variant="dark" delay={i * 80}>
            <span className="inline-block text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-accent mb-4 px-2 py-0.5 rounded border border-accent/30">
              {project.badge}
            </span>
            <h3 className="text-xl font-serif text-foreground mb-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-5">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[11px] font-mono rounded bg-secondary/80 text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-foreground hover:text-accent transition-colors duration-material"
            >
              GitHub <span aria-hidden>↗</span>
            </a>
          </EditorialCard>
        ))}
      </div>
    </SectionShell>
  );
}
