import { useExperience } from '@/components/experience/ExperienceProvider';
import { useCursorHover } from '@/hooks/use-cursor-hover';
import { useCallback } from 'react';

const NAV_LINKS = [
  { num: '01', label: 'Cases', echo: 'Selected Work', href: '#cases' },
  { num: '02', label: 'Work', echo: 'Technical', href: '#technical-work' },
  { num: '03', label: 'Strengths', echo: 'Core Skills', href: '#strengths' },
  { num: '04', label: 'Contact', echo: 'Get in Touch', href: '#contact' },
];

export function Footer() {
  const { scrollTo } = useExperience();
  const cursorHover = useCursorHover();

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        scrollTo(href, { offset: -48 });
      }
    },
    [scrollTo],
  );

  return (
    <footer className="py-8 md:py-12">
      {/* Gradient separator */}
      <div
        className="h-px mb-8 md:mb-12 mx-auto max-w-5xl"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--border) / 0.4) 25%, hsl(var(--border) / 0.4) 75%, transparent 100%)',
        }}
      />

      <div className="mx-auto max-w-5xl px-6 md:px-8 flex flex-col gap-6">
        {/* Nav echo — numbered links with dual-label hover */}
        <div className="flex flex-wrap items-center gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="group relative flex items-center gap-2 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              {...cursorHover}
            >
              <span className="text-[10px] font-sans text-muted-foreground/50 tabular-nums transition-colors duration-material group-hover:text-accent">
                {link.num}
              </span>
              <span className="text-xs tracking-nav uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-material">
                {link.label}
              </span>
              {/* Serif italic echo */}
              <span className="absolute left-full ml-2 text-[11px] font-serif italic text-accent/0 transition-all duration-spatial ease-expo group-hover:text-accent/70 group-hover:translate-x-0 translate-x-[-4px] whitespace-nowrap pointer-events-none">
                {link.echo}
              </span>
            </a>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60 font-sans tracking-spatial">
            © {new Date().getFullYear()} Grigorii
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/ocejoestrellita116-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground font-sans tracking-spatial transition-colors duration-material rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              {...cursorHover}
            >
              GitHub
            </a>
            <a
              href="mailto:grigorii584@gmail.com"
              className="text-xs text-muted-foreground/60 hover:text-foreground font-sans tracking-spatial transition-colors duration-material rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              {...cursorHover}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
