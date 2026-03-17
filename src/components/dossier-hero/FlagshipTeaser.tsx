import type { FlagshipData } from './dossier-hero.types';
import { useCursorHover } from '@/hooks/use-cursor-hover';

interface Props {
  data: FlagshipData;
  subtleTransform?: string;
}

export function FlagshipTeaser({ data, subtleTransform }: Props) {
  const cursorHover = useCursorHover();

  return (
    <div
      className="max-w-sm w-full mx-6 p-5 pointer-events-auto"
      style={{
        transform: subtleTransform,
        textShadow: '0 0 40px hsl(var(--background)), 0 1px 2px hsl(var(--background) / 0.5)',
      }}
    >
      {/* Eyebrow with gold accent rule */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-2 h-px"
          style={{ background: 'hsl(var(--dossier-gold))' }}
        />
        <p className="text-[10px] tracking-[0.2em] uppercase text-dossier-gold font-sans">
          Featured Case
        </p>
      </div>

      <h3 className="font-serif text-xl text-foreground mb-1">
        {data.title}
      </h3>
      <p className="text-sm text-dossier-navy-soft font-sans mb-1">{data.outcome}</p>
      <p className="text-xs text-dossier-whisper font-sans mb-3">{data.context}</p>

      <a
        href={data.href}
        className="group inline-flex items-center gap-1.5 text-sm font-sans font-medium text-dossier-gold hover:text-dossier-gold/80 transition-colors"
        {...cursorHover}
      >
        {data.cta}
        <span
          aria-hidden
          className="inline-block transition-transform duration-material group-hover:translate-x-1 group-hover:scale-110"
        >
          →
        </span>
      </a>

      {/* Bottom gradient line */}
      <div
        className="mt-4 h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--dossier-gold) / 0.3) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
