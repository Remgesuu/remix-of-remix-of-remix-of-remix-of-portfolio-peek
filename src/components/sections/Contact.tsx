import { PORTFOLIO } from '@/data/portfolio-content';
import { useInView } from '@/hooks/use-in-view';
import { useCursorHover } from '@/hooks/use-cursor-hover';
import { SectionShell } from './SectionShell';

export function Contact() {
  const { headline, subtext, resumeCta, entries } = PORTFOLIO.contact;
  const [leftRef, leftVisible] = useInView({ threshold: 0.15 });
  const [rightRef, rightVisible] = useInView({ threshold: 0.15 });
  const hoverProps = useCursorHover();

  const reveal = (visible: boolean, delay = 0) =>
    ({
      className: `transition-[opacity,transform] duration-spatial ease-expo ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`,
      style: { transitionDelay: `${delay}ms` },
    } as const);

  return (
    <SectionShell id="contact">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left: CTA */}
        <div ref={leftRef}>
          <h2
            {...reveal(leftVisible, 0)}
            className={`text-3xl md:text-5xl font-serif text-foreground leading-tight tracking-display mb-3 transition-[opacity,transform] duration-spatial ease-expo ${leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {headline}
          </h2>
          <p
            className={`text-base text-muted-foreground font-sans leading-relaxed mb-6 transition-[opacity,transform] duration-spatial ease-expo ${leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '120ms' }}
          >
            {subtext}
          </p>
          <a
            href={resumeCta.href}
            {...hoverProps}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-sans font-medium border border-foreground/20 rounded-md text-foreground hover:bg-foreground hover:text-background transition-[opacity,transform,colors] duration-spatial ease-expo ${leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '240ms' }}
          >
            {resumeCta.label}
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* Right: Contact matrix */}
        <div ref={rightRef} className="flex flex-col gap-4 md:pt-2">
          {entries.map((entry, i) => (
            <div
              key={entry.label}
              className={`flex flex-col transition-[opacity,transform] duration-spatial ease-expo ${rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ transitionDelay: `${120 + i * 80}ms` }}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground mb-0.5">
                {entry.label}
              </span>
              {entry.href ? (
                <a
                  href={entry.href}
                  target={entry.href.startsWith('http') ? '_blank' : undefined}
                  rel={entry.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  {...hoverProps}
                  className="text-sm font-sans text-foreground hover:text-accent transition-colors duration-material"
                >
                  {entry.value}
                </a>
              ) : (
                <span className="text-sm font-sans text-foreground">{entry.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
