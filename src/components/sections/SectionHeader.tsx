import { useInView } from '@/hooks/use-in-view';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: Props) {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const base = 'transition-[opacity,transform] duration-spatial ease-expo';
  const hidden = 'opacity-0 translate-y-2';
  const visible = 'opacity-100 translate-y-0';

  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <p
        className={cn(base, isInView ? visible : hidden, 'text-xs tracking-[0.25em] uppercase text-muted-foreground font-sans mb-3')}
        style={{ transitionDelay: '0ms' }}
      >
        ( {eyebrow} )
      </p>
      <h2
        className={cn(base, isInView ? visible : hidden, 'text-3xl md:text-5xl font-serif text-foreground leading-tight tracking-display mb-3')}
        style={{ transitionDelay: '120ms' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(base, isInView ? visible : hidden, 'text-base text-muted-foreground font-sans max-w-lg leading-relaxed')}
          style={{ transitionDelay: '240ms' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
