import type { ProofItem } from './dossier-hero.types';

interface Props {
  items: ProofItem[];
  visible?: boolean;
}

export function ProofStrip({ items, visible = true }: Props) {
  return (
    <div className="flex flex-col items-center px-6">
      {/* Top gradient rule */}
      <div
        className="w-full max-w-md h-px mb-5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--border) / 0.4) 30%, hsl(var(--border) / 0.4) 70%, transparent 100%)',
        }}
      />

      {/* Bare flex row — no backdrop panel */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-6 py-4">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="text-center transition-all duration-spatial"
            style={{
              transitionDelay: visible ? `${i * 100}ms` : '0ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            <div
              className="text-3xl md:text-4xl font-serif text-foreground leading-none tracking-display"
              style={{
                textShadow: '0 0 30px hsl(var(--background)), 0 0 60px hsl(var(--background) / 0.6)',
              }}
            >
              {item.value}
            </div>
            <div className="text-[11px] tracking-spatial uppercase text-dossier-whisper font-sans mt-1.5">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom gradient rule */}
      <div
        className="w-full max-w-md h-px mt-5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--border) / 0.4) 30%, hsl(var(--border) / 0.4) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
